import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase, Room, GameStateDB } from '@/utils/supabase';
import { GameState, PlayerType } from '@/types/game';
import { initializeGameState, makeMove as makeGameMove } from '@/utils/gameLogic';
import { RealtimeChannel } from '@supabase/supabase-js';

interface SupabaseMultiplayerContextType {
  isConnected: boolean;
  roomId: string | null;
  playerId: string | null;
  playerRole: PlayerType | null;
  isHost: boolean;
  opponent: { id: string; name: string } | null;
  gameState: GameState | null;
  createRoom: (playerName: string) => Promise<void>;
  joinRoom: (roomId: string, playerName: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  makeMove: (row: number, col: number) => Promise<void>;
  resetGame: () => Promise<void>;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

const SupabaseMultiplayerContext = createContext<SupabaseMultiplayerContextType | undefined>(undefined);

interface SupabaseMultiplayerProviderProps {
  children: React.ReactNode;
}

// Generate a simple user ID for this session
const generateUserId = () => `user_${Math.random().toString(36).substring(2, 15)}`;

export const SupabaseMultiplayerProvider: React.FC<SupabaseMultiplayerProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerId] = useState<string>(generateUserId());
  const [playerRole, setPlayerRole] = useState<PlayerType | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [opponent, setOpponent] = useState<{ id: string; name: string } | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [roomChannel, setRoomChannel] = useState<RealtimeChannel | null>(null);
  const [roomCheckInterval, setRoomCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Use refs to avoid stale closures in intervals
  const opponentRef = useRef(opponent);
  const roomIdRef = useRef(roomId);
  const playerIdRef = useRef(playerId);
  const isHostRef = useRef(isHost);

  // Update refs when state changes
  useEffect(() => {
    opponentRef.current = opponent;
  }, [opponent]);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);

  // Initialize connection
  useEffect(() => {
    setConnectionStatus('connecting');
    
    // Test Supabase connection
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('rooms').select('count').limit(1);
        if (error) throw error;
        setIsConnected(true);
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Supabase connection error:', error);
        setConnectionStatus('error');
      }
    };

    testConnection();
  }, []);

  // Set up real-time subscription for room updates
  const subscribeToRoom = useCallback((roomId: string) => {
    // First, fetch current room state to get any existing opponent
    const fetchInitialRoomState = async () => {
      try {
        const { data: room, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();
        
        if (room && !error) {
          if (room.guest_id && room.guest_name && room.host_id === playerId) {
            // Current user is host, guest is already there
            setOpponent({ id: room.guest_id, name: room.guest_name });
            console.log('Host found existing guest:', room.guest_name);
          } else if (room.host_id && room.host_name && room.guest_id === playerId) {
            // Current user is guest, host is already there
            setOpponent({ id: room.host_id, name: room.host_name });
            console.log('Guest found existing host:', room.host_name);
          }
        }
      } catch (error) {
        console.error('Error fetching initial room state:', error);
      }
    };
    
    // Fetch initial state
    fetchInitialRoomState();
    
    // Set up periodic room check as fallback
    const intervalId = setInterval(async () => {
      const currentRoomId = roomIdRef.current;
      const currentOpponent = opponentRef.current;
      const currentPlayerId = playerIdRef.current;
      const currentIsHost = isHostRef.current;
      
      if (!currentRoomId) {
        return;
      }
      
      try {
        const { data: room, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', currentRoomId)
          .single();
        
        if (room && !error) {
          if (room.guest_id && room.guest_name && room.host_id === currentPlayerId && !currentOpponent) {
            console.log('Host found guest:', room.guest_name);
            setOpponent({ id: room.guest_id, name: room.guest_name });
          } else if (room.host_id && room.host_name && room.guest_id === currentPlayerId && !currentOpponent) {
            console.log('Guest found host:', room.host_name);
            setOpponent({ id: room.host_id, name: room.host_name });
          }
        }
      } catch (error) {
        console.error('Error in periodic room check:', error);
      }
    }, 3000); // Check every 3 seconds (less frequent)

    setRoomCheckInterval(intervalId);

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_states',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const dbGameState = payload.new as GameStateDB;
          setGameState({
            board: dbGameState.board,
            currentPlayer: dbGameState.current_player,
            moveCount: dbGameState.move_count,
            gameOver: dbGameState.game_over,
            winner: dbGameState.winner as any,
            winningLine: dbGameState.winning_line,
            scores: dbGameState.scores
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`
        },
        async (payload) => {
          const room = payload.new as Room;
          
          // Update opponent info when someone joins
          if (room.guest_id && room.guest_name && room.host_id === playerId) {
            console.log('Host detected guest joined:', room.guest_name);
            setOpponent({ id: room.guest_id, name: room.guest_name });
          } else if (room.host_id && room.host_name && room.guest_id === playerId) {
            console.log('Guest detected host via real-time:', room.host_name);
            setOpponent({ id: room.host_id, name: room.host_name });
          }
        }
      )
      .subscribe((status, err) => {
        if (err) console.error('Subscription error:', err);
        
        // If subscription fails, try to reconnect
        if (status === 'CHANNEL_ERROR') {
          console.log('Channel error, attempting to reconnect...');
          setTimeout(() => {
            if (roomIdRef.current === roomId) {
              subscribeToRoom(roomId);
            }
          }, 3000);
        }
      });

    setRoomChannel(channel);
    return channel;
  }, [playerId]);

  // Clean up subscription
  const unsubscribeFromRoom = useCallback(() => {
    if (roomChannel) {
      supabase.removeChannel(roomChannel);
      setRoomChannel(null);
    }
    if (roomCheckInterval) {
      clearInterval(roomCheckInterval);
      setRoomCheckInterval(null);
    }
  }, [roomChannel, roomCheckInterval]);

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = useCallback(async (playerName: string) => {
    try {
      // Clean up any existing subscription first
      if (roomChannel || roomCheckInterval) {
        unsubscribeFromRoom();
      }

      const newRoomId = generateRoomId();
      
      // Create room
      const { error: roomError } = await supabase
        .from('rooms')
        .insert({
          id: newRoomId,
          host_id: playerId,
          host_name: playerName,
          status: 'waiting'
        });

      if (roomError) throw roomError;

      // Create initial game state
      const initialGameState = initializeGameState();
      const { error: gameError } = await supabase
        .from('game_states')
        .insert({
          room_id: newRoomId,
          board: initialGameState.board,
          current_player: initialGameState.currentPlayer,
          move_count: initialGameState.moveCount,
          game_over: initialGameState.gameOver,
          winner: initialGameState.winner,
          winning_line: initialGameState.winningLine,
          scores: initialGameState.scores
        });

      if (gameError) throw gameError;

      // Set local state first
      setRoomId(newRoomId);
      setPlayerRole('X');
      setIsHost(true);
      setGameState(initialGameState);

      // Then subscribe to room updates
      subscribeToRoom(newRoomId);
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }, [playerId, subscribeToRoom, unsubscribeFromRoom, roomChannel, roomCheckInterval]);

  const joinRoom = useCallback(async (roomId: string, playerName: string) => {
    try {
      // Clean up any existing subscription first
      if (roomChannel || roomCheckInterval) {
        unsubscribeFromRoom();
      }

      // Check if room exists and has space
      const { data: room, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (fetchError) throw new Error('Room not found');
      if (!room) throw new Error('Room not found');
      if (room.guest_id) throw new Error('Room is full');

      // Join the room
      const { error: updateError } = await supabase
        .from('rooms')
        .update({
          guest_id: playerId,
          guest_name: playerName,
          status: 'playing'
        })
        .eq('id', roomId);

      if (updateError) throw updateError;

      // Get current game state
      const { data: gameState, error: gameError } = await supabase
        .from('game_states')
        .select('*')
        .eq('room_id', roomId)
        .single();

      if (gameError || !gameState) throw new Error('Failed to load game state');

      // Set local state first
      setRoomId(roomId);
      setPlayerRole('O');
      setIsHost(false);
      setOpponent({ id: room.host_id, name: room.host_name });
      setGameState({
        board: gameState.board,
        currentPlayer: gameState.current_player,
        moveCount: gameState.move_count,
        gameOver: gameState.game_over,
        winner: gameState.winner as any,
        winningLine: gameState.winning_line,
        scores: gameState.scores
      });

      // Then subscribe to room updates
      subscribeToRoom(roomId);
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }, [playerId, subscribeToRoom, unsubscribeFromRoom, roomChannel, roomCheckInterval]);

  const leaveRoom = useCallback(async () => {
    if (!roomId) return;

    try {
      unsubscribeFromRoom();

      // Always delete room and game state data when anyone leaves
      // Delete game state first (due to foreign key constraint)
      const { error: gameStateError } = await supabase
        .from('game_states')
        .delete()
        .eq('room_id', roomId);
      
      if (gameStateError) {
        console.error('Error deleting game state:', gameStateError);
      }

      // Delete room
      const { error: roomError } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);
      
      if (roomError) {
        console.error('Error deleting room:', roomError);
      }

      // Reset local state
      setRoomId(null);
      setPlayerRole(null);
      setIsHost(false);
      setOpponent(null);
      setGameState(null);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  }, [roomId, unsubscribeFromRoom]);

  const makeMove = useCallback(async (row: number, col: number) => {
    if (!roomId || !gameState || !playerRole) {
      return;
    }

    // Check if it's player's turn
    if (gameState.currentPlayer !== playerRole) {
      throw new Error('Not your turn');
    }

    // Check if cell is already occupied
    if (gameState.board[row][col].player !== null) {
      return;
    }

    try {
      // Calculate new game state
      const newGameState = makeGameMove(gameState, row, col);
      
      // Update local state immediately for responsive UI
      setGameState(newGameState);

      // Update database
      const { error } = await supabase
        .from('game_states')
        .update({
          board: newGameState.board,
          current_player: newGameState.currentPlayer,
          move_count: newGameState.moveCount,
          game_over: newGameState.gameOver,
          winner: newGameState.winner,
          winning_line: newGameState.winningLine,
          scores: newGameState.scores,
          updated_at: new Date().toISOString()
        })
        .eq('room_id', roomId);

      if (error) {
        console.error('Database update failed:', error);
        // Revert local state if database update fails
        setGameState(gameState);
        throw error;
      }
    } catch (error) {
      console.error('Error making move:', error);
      throw error;
    }
  }, [roomId, gameState, playerRole]);

  const resetGame = useCallback(async () => {
    if (!roomId || !isHost) return;

    try {
      const newGameState = initializeGameState();
      // Preserve scores from current game
      if (gameState) {
        newGameState.scores = gameState.scores;
      }

      const { error } = await supabase
        .from('game_states')
        .update({
          board: newGameState.board,
          current_player: newGameState.currentPlayer,
          move_count: newGameState.moveCount,
          game_over: newGameState.gameOver,
          winner: newGameState.winner,
          winning_line: newGameState.winningLine,
          scores: newGameState.scores,
          updated_at: new Date().toISOString()
        })
        .eq('room_id', roomId);

      if (error) throw error;

      console.log(`Game reset in room ${roomId}`);
    } catch (error) {
      console.error('Error resetting game:', error);
      throw error;
    }
  }, [roomId, isHost, gameState]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (roomChannel) {
        supabase.removeChannel(roomChannel);
      }
      if (roomCheckInterval) {
        clearInterval(roomCheckInterval);
      }
    };
  }, []);

  const value: SupabaseMultiplayerContextType = {
    isConnected,
    roomId,
    playerId,
    playerRole,
    isHost,
    opponent,
    gameState,
    createRoom,
    joinRoom,
    leaveRoom,
    makeMove,
    resetGame,
    connectionStatus,
  };

  return (
    <SupabaseMultiplayerContext.Provider value={value}>
      {children}
    </SupabaseMultiplayerContext.Provider>
  );
};

export const useSupabaseMultiplayer = (): SupabaseMultiplayerContextType => {
  const context = useContext(SupabaseMultiplayerContext);
  if (context === undefined) {
    throw new Error('useSupabaseMultiplayer must be used within a SupabaseMultiplayerProvider');
  }
  return context;
}; 