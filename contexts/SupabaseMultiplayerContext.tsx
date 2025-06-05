import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase, Room, GameStateDB } from '@/utils/supabase';
import { GameState, PlayerType } from '@/types/game';
import { initializeGameState, makeMove as makeGameMove, handleTimeout } from '@/utils/gameLogic';
import { RealtimeChannel } from '@supabase/supabase-js';

interface SupabaseMultiplayerContextType {
  isConnected: boolean;
  roomId: string | null;
  playerId: string | null;
  playerRole: PlayerType | null;
  isHost: boolean;
  opponent: { id: string; name: string } | null;
  currentPlayerName: string | null;
  gameState: GameState | null;
  createRoom: (playerName: string) => Promise<void>;
  joinRoom: (roomId: string, playerName: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  makeMove: (row: number, col: number) => Promise<void>;
  resetGame: () => Promise<void>;
  onTurnTimeout: () => Promise<void>;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  isAutoRestarting: boolean;
  isOpponentDisconnected: boolean;
  continueWaitingForOpponent: () => void;
}

const SupabaseMultiplayerContext = createContext<SupabaseMultiplayerContextType | undefined>(undefined);

interface SupabaseMultiplayerProviderProps {
  children: React.ReactNode;
}

// Generate a simple user ID for this session
const generateUserId = () => `user_${Math.random().toString(36).substring(2, 15)}`;

// Add a utility function for cleaning player names
const cleanDisplayName = (name: string): string => {
  if (!name) return '';
  // Remove any version of the [RANDOM] tag
  return name.replace(/\[RANDOM\][\s]*/gi, '');
};

export const SupabaseMultiplayerProvider: React.FC<SupabaseMultiplayerProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerId] = useState<string>(generateUserId());
  const [playerRole, setPlayerRole] = useState<PlayerType | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [opponent, setOpponent] = useState<{ id: string; name: string } | null>(null);
  const [currentPlayerName, setCurrentPlayerName] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [roomChannel, setRoomChannel] = useState<RealtimeChannel | null>(null);
  const [roomCheckInterval, setRoomCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [isAutoRestarting, setIsAutoRestarting] = useState(false);
  const [isOpponentDisconnected, setIsOpponentDisconnected] = useState(false);
  const autoRestartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use refs to avoid stale closures in intervals
  const opponentRef = useRef(opponent);
  const roomIdRef = useRef(roomId);
  const playerIdRef = useRef(playerId);
  const isHostRef = useRef(isHost);
  const isCleaningUpRef = useRef(isCleaningUp);
  const gameStateRef = useRef(gameState);

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

  useEffect(() => {
    isCleaningUpRef.current = isCleaningUp;
  }, [isCleaningUp]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

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
          // Only set opponent if both host and guest slots are filled and we're not looking at ourselves
          if (room.guest_id && room.guest_name && room.host_id && room.host_name) {
            if (room.host_id === playerId) {
              // Current user is host, guest is the opponent
              setOpponent({ id: room.guest_id, name: room.guest_name });
              console.log('Host found existing guest:', room.guest_name);
            } else if (room.guest_id === playerId) {
              // Current user is guest, host is the opponent
              setOpponent({ id: room.host_id, name: room.host_name });
              console.log('Guest found existing host:', room.host_name);
            }
          } else {
            // Room is not full, no opponent yet
            console.log('Room not full, no opponent set');
            setOpponent(null);
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
        (payload: any) => {
          const dbGameState = payload.new as GameStateDB;
          const newGameState = {
            board: dbGameState.board,
            currentPlayer: dbGameState.current_player,
            moveCount: dbGameState.move_count,
            gameOver: dbGameState.game_over,
            winner: dbGameState.winner as any,
            winningLine: dbGameState.winning_line,
            scores: dbGameState.scores,
            turnStartTime: dbGameState.turn_start_time ? new Date(dbGameState.turn_start_time) : undefined,
            turnTimeLimit: dbGameState.turn_time_limit || 15
          };
          
          console.log('Game state updated:', {
            moveCount: newGameState.moveCount,
            gameOver: newGameState.gameOver,
            winner: newGameState.winner,
            hasTimeout: !!autoRestartTimeoutRef.current,
            isAutoRestarting
          });
          
          setGameState(newGameState);
          
          // Clear auto-restart state when a new game starts
          if (newGameState.moveCount === 0 && !newGameState.gameOver) {
            console.log('New game detected, clearing auto-restart state');
            setIsAutoRestarting(false);
            if (autoRestartTimeoutRef.current) {
              clearTimeout(autoRestartTimeoutRef.current);
              autoRestartTimeoutRef.current = null;
              console.log('Cleared auto-restart timeout due to new game');
            }
          }
          
          // Auto-restart game 5 seconds after someone wins
          if (newGameState.gameOver && newGameState.winner && isHostRef.current && !autoRestartTimeoutRef.current) {
            console.log('Auto-restart triggered: game over, winner:', newGameState.winner, 'isHost:', isHostRef.current);
            
            // Set auto-restart flag to prevent multiple triggers
            setIsAutoRestarting(true);
            
            // Phase 1: Clear board after 2 seconds
            const timeout = setTimeout(async () => {
              console.log('Phase 1: Clearing board after 2 seconds...');
              
              const currentRoomId = roomIdRef.current;
              const currentGameState = gameStateRef.current;
              
              if (!currentRoomId) {
                console.log('No room ID, aborting auto-restart');
                setIsAutoRestarting(false);
                autoRestartTimeoutRef.current = null;
                return;
              }
              
              try {
                // Create an empty board state for visual clearing
                const emptyGameState = initializeGameState(true); // Start timer immediately for new game
                // Preserve scores from current game
                if (currentGameState) {
                  emptyGameState.scores = currentGameState.scores;
                }
                
                // Update database immediately to sync both players
                const { error } = await supabase
                  .from('game_states')
                  .update({
                    board: emptyGameState.board,
                    current_player: emptyGameState.currentPlayer,
                    move_count: emptyGameState.moveCount,
                    game_over: emptyGameState.gameOver,
                    winner: emptyGameState.winner,
                    winning_line: emptyGameState.winningLine,
                    scores: emptyGameState.scores,
                    turn_start_time: emptyGameState.turnStartTime?.toISOString() || null,
                    turn_time_limit: emptyGameState.turnTimeLimit,
                    updated_at: new Date().toISOString()
                  })
                  .eq('room_id', currentRoomId);

                if (error) {
                  console.error('Database update failed during board clear:', error);
                  throw error;
                }
                
                console.log('Board cleared in database - both players should see empty board');
                
                // Phase 2: Wait additional 3 seconds for the "new game starting" phase
                const newGameTimeout = setTimeout(async () => {
                  console.log('Phase 2: New game officially starting...');
                  
                  const finalRoomId = roomIdRef.current;
                  if (!finalRoomId) {
                    console.log('No room ID for phase 2, aborting');
                    setIsAutoRestarting(false);
                    autoRestartTimeoutRef.current = null;
                    return;
                  }
                  
                  try {
                    // Just clear the auto-restart flag - board is already cleared
                    console.log('New game ready - clearing auto-restart flag');
                    setIsAutoRestarting(false);
                  } catch (error) {
                    console.error('Phase 2 failed:', error);
                    setIsAutoRestarting(false);
                  } finally {
                    autoRestartTimeoutRef.current = null;
                  }
                }, 3000); // Additional 3 seconds
                
                // Store the new game timeout
                autoRestartTimeoutRef.current = newGameTimeout;
                
              } catch (error) {
                console.error('Phase 1 failed:', error);
                setIsAutoRestarting(false);
                autoRestartTimeoutRef.current = null;
              }
            }, 2000); // 2 seconds
            
            autoRestartTimeoutRef.current = timeout;
            console.log('Auto-restart timeout set for 2 seconds (board clear)');
          }
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
        async (payload: any) => {
          const room = payload.new as Room;
          
          // Update opponent info when someone joins
          if (room.guest_id && room.guest_name && room.host_id === playerId) {
            console.log('Host detected guest joined:', room.guest_name);
            setOpponent({ id: room.guest_id, name: room.guest_name });
            setIsOpponentDisconnected(false);
            
            // For random matchmaking, reset the game when a new opponent joins
            if (room.host_name?.includes('[RANDOM]') || room.guest_name?.includes('[RANDOM]')) {
              console.log('Random match - new opponent joined, resetting game');
              const initialGameState = initializeGameState(true);
              // Preserve scores if there was a previous game
              if (gameStateRef.current) {
                initialGameState.scores = gameStateRef.current.scores;
              }
              
              // Update game state in database
              try {
                await supabase
                  .from('game_states')
                  .update({
                    board: initialGameState.board,
                    current_player: initialGameState.currentPlayer,
                    move_count: initialGameState.moveCount,
                    game_over: initialGameState.gameOver,
                    winner: initialGameState.winner,
                    winning_line: initialGameState.winningLine,
                    scores: initialGameState.scores,
                    turn_start_time: initialGameState.turnStartTime?.toISOString() || null,
                    turn_time_limit: initialGameState.turnTimeLimit,
                    updated_at: new Date().toISOString()
                  })
                  .eq('room_id', roomId);
              } catch (error) {
                console.error('Error resetting game after new opponent joined:', error);
              }
            }
          } else if (room.host_id && room.host_name && room.guest_id === playerId) {
            console.log('Guest detected host via real-time:', room.host_name);
            setOpponent({ id: room.host_id, name: room.host_name });
            setIsOpponentDisconnected(false);
          }
          
          // Handle opponent disconnection
          if (room.host_id === playerId && !room.guest_id && opponentRef.current) {
            console.log('Host detected guest left - had opponent:', opponentRef.current?.name);
            
            // Trigger disconnection for ANY game where we had an opponent
            setOpponent(null);
            if (!isOpponentDisconnected) { // Only trigger if not already disconnected
              setIsOpponentDisconnected(true);
              
              // For random matchmaking, reset the game state for the remaining player
              if (room.host_name?.includes('[RANDOM]')) {
                console.log('Random match - guest left, resetting game state');
                
                // Reset the game state for the remaining player
                const initialGameState = initializeGameState(true);
                // Preserve scores
                if (gameStateRef.current) {
                  initialGameState.scores = gameStateRef.current.scores;
                }
                
                // Update game state
                setGameState(initialGameState);
                
                // Update game state in database
                try {
                  await supabase
                    .from('game_states')
                    .update({
                      board: initialGameState.board,
                      current_player: initialGameState.currentPlayer,
                      move_count: initialGameState.moveCount,
                      game_over: initialGameState.gameOver,
                      winner: initialGameState.winner,
                      winning_line: initialGameState.winningLine,
                      scores: initialGameState.scores,
                      turn_start_time: initialGameState.turnStartTime?.toISOString() || null,
                      turn_time_limit: initialGameState.turnTimeLimit,
                      updated_at: new Date().toISOString()
                    })
                    .eq('room_id', roomId);
                } catch (error) {
                  console.error('Error resetting game after opponent left:', error);
                }
              } else {
                console.log('Regular game - guest left, showing disconnection popup');
              }
            }
          } else if (room.guest_id === playerId && !room.host_id && opponentRef.current) {
            console.log('Guest detected host left - had opponent:', opponentRef.current?.name);
            
            // Trigger disconnection for ANY game where we had an opponent
            setOpponent(null);
            if (!isOpponentDisconnected) { // Only trigger if not already disconnected
              setIsOpponentDisconnected(true);
              
              // For random matchmaking, reset the game state for the remaining player
              if (room.guest_name?.includes('[RANDOM]')) {
                console.log('Random match - host left, resetting game state');
                
                // Reset the game state for the remaining player
                const initialGameState = initializeGameState(true);
                // Preserve scores
                if (gameStateRef.current) {
                  initialGameState.scores = gameStateRef.current.scores;
                }
                
                // Update game state
                setGameState(initialGameState);
                
                // Update game state in database
                try {
                  await supabase
                    .from('game_states')
                    .update({
                      board: initialGameState.board,
                      current_player: initialGameState.currentPlayer,
                      move_count: initialGameState.moveCount,
                      game_over: initialGameState.gameOver,
                      winner: initialGameState.winner,
                      winning_line: initialGameState.winningLine,
                      scores: initialGameState.scores,
                      turn_start_time: initialGameState.turnStartTime?.toISOString() || null,
                      turn_time_limit: initialGameState.turnTimeLimit,
                      updated_at: new Date().toISOString()
                    })
                    .eq('room_id', roomId);
                } catch (error) {
                  console.error('Error resetting game after host left:', error);
                }
              } else {
                console.log('Regular game - host left, showing disconnection popup');
              }
            }
          }
          
          // Check if room is now completely empty and delete it
          if (!room.host_id && !room.guest_id) {
            console.log('Room is completely empty, deleting it immediately');
            // Delete game state first
            try {
              await supabase
                .from('game_states')
                .delete()
                .eq('room_id', roomId);
              
              // Delete room
              await supabase
                .from('rooms')
                .delete()
                .eq('id', roomId);
              
              console.log('Empty room deleted successfully:', roomId);
            } catch (error) {
              console.error('Error deleting empty room:', error);
            }
          }
        }
      )
      .subscribe((status: string, err?: Error) => {
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

  // Define a helper function for joining a random match
  const joinExistingRoom = async (roomId: string, playerName: string) => {
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
      scores: gameState.scores,
      turnStartTime: gameState.turn_start_time ? new Date(gameState.turn_start_time) : new Date(),
      turnTimeLimit: gameState.turn_time_limit || 15
    });
    setCurrentPlayerName(cleanDisplayName(playerName));

    // Then subscribe to room updates
    subscribeToRoom(roomId);
  };

  const createRoom = useCallback(async (playerName: string) => {
    try {
      // Clean up any existing subscription first
      if (roomChannel || roomCheckInterval) {
        unsubscribeFromRoom();
      }

      // Reset opponent and disconnection state
      setOpponent(null);
      setIsOpponentDisconnected(false);

      // Check if this is a request for random matchmaking
      const isRandomMatch = playerName.startsWith('[RANDOM]');
      const actualPlayerName = isRandomMatch ? playerName.replace('[RANDOM] ', '') : playerName;
      
      if (isRandomMatch) {
        // First, check if there are any open rooms waiting for random matches
        const { data: availableRooms, error: roomsError } = await supabase
          .from('rooms')
          .select('*')
          .eq('status', 'waiting')
          .is('guest_id', null)
          .ilike('host_name', '%[RANDOM]%');
        
        if (roomsError) throw roomsError;
        
        // If we found an available random match room, join it
        if (availableRooms && availableRooms.length > 0) {
          const roomToJoin = availableRooms[0];
          console.log('Found random match room to join:', roomToJoin.id);
          
          // Join as guest
          try {
            await joinExistingRoom(roomToJoin.id, actualPlayerName);
            return; // Successfully joined existing room
          } catch (error) {
            console.log('Failed to join random room, creating new one instead:', error);
            // Continue with creating a new room
          }
        }
        
        // No available rooms, create a new one for random matching
        console.log('No available random match rooms, creating new one');
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

      // Create initial game state with timer started
      const initialGameState = initializeGameState(true);
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
          scores: initialGameState.scores,
          turn_start_time: initialGameState.turnStartTime?.toISOString() || null,
          turn_time_limit: initialGameState.turnTimeLimit
        });

      if (gameError) throw gameError;

      // Set local state first
      setRoomId(newRoomId);
      setPlayerRole('X');
      setIsHost(true);
      setGameState(initialGameState);
      setCurrentPlayerName(cleanDisplayName(actualPlayerName));

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

      // Reset opponent and disconnection state
      setOpponent(null);
      setIsOpponentDisconnected(false);

      await joinExistingRoom(roomId, playerName);
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }, [playerId, subscribeToRoom, unsubscribeFromRoom, roomChannel, roomCheckInterval]);

  const leaveRoom = useCallback(async () => {
    if (!roomId || isCleaningUpRef.current) return;

    try {
      console.log('Leaving room:', roomId);
      setIsCleaningUp(true);
      
      // Clear any pending auto-restart timeout
      if (autoRestartTimeoutRef.current) {
        clearTimeout(autoRestartTimeoutRef.current);
        autoRestartTimeoutRef.current = null;
        console.log('Cleared auto-restart timeout during room leave');
      }
      setIsAutoRestarting(false);
      
      unsubscribeFromRoom();

      // Check if this is a random matchmaking room
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();
      
      if (roomError) {
        console.error('Error fetching room data during leave:', roomError);
        // Proceed with cleanup as normal
        await cleanupRoom(roomId);
      } else if (room) {
        const isRandomRoom = room.host_name?.includes('[RANDOM]') || 
                            (room.guest_name?.includes('[RANDOM]'));
        
        // Determine if current player is host or guest based on actual room data
        const isCurrentPlayerHost = room.host_id === playerId;
        const isCurrentPlayerGuest = room.guest_id === playerId;
        
        console.log('Leave room analysis:', {
          playerId,
          roomHostId: room.host_id,
          roomGuestId: room.guest_id,
          isCurrentPlayerHost,
          isCurrentPlayerGuest,
          isRandomRoom
        });
        
        if (isRandomRoom) {
          // For random matchmaking, handle player leaving logic
          if (isCurrentPlayerHost) {
            // Current player is the host and leaving
            if (room.guest_id) {
              console.log('Host leaving random room with guest present, transferring host role');
              // Transfer host role to guest and remove self
              const { error: transferError } = await supabase
                .from('rooms')
                .update({
                  host_id: room.guest_id,
                  host_name: room.guest_name,
                  guest_id: null,
                  guest_name: null,
                  status: 'waiting'
                })
                .eq('id', roomId);
              
              if (transferError) {
                console.error('Error transferring host role:', transferError);
                // If transfer fails, clean up the room
                await cleanupRoom(roomId);
              } else {
                console.log('Host role transferred successfully');
              }
            } else {
              // No guest, room will be empty after host leaves - clean up the room
              console.log('Host leaving empty random room, cleaning up');
              await cleanupRoom(roomId);
            }
          } else if (isCurrentPlayerGuest) {
            // Current player is the guest and leaving
            console.log('Guest leaving random room');
            const { error: updateError } = await supabase
              .from('rooms')
              .update({
                guest_id: null,
                guest_name: null,
                status: 'waiting'
              })
              .eq('id', roomId);
            
            if (updateError) {
              console.error('Error removing guest:', updateError);
              // If update fails, try to clean up the room
              await cleanupRoom(roomId);
            } else {
              console.log('Guest removed successfully');
              // After removing guest, check if there's still a host
              if (!room.host_id) {
                console.log('No host in room after guest left, cleaning up');
                await cleanupRoom(roomId);
              }
            }
          } else {
            // Player is neither host nor guest (shouldn't happen, but handle it)
            console.warn('Player is neither host nor guest in room, cleaning up');
            await cleanupRoom(roomId);
          }
          
          // Only reset game state if there's still a player in the room
          // Check room state after updates
          const { data: updatedRoom, error: roomCheckError } = await supabase
            .from('rooms')
            .select('*')
            .eq('id', roomId)
            .single();
          
          if (!roomCheckError && updatedRoom && (updatedRoom.host_id || updatedRoom.guest_id)) {
            // Room still has a player, reset game state for them
            console.log('Room still has players, resetting game state');
            if (gameState) {
              const initialGameState = initializeGameState(true);
              // Preserve scores
              initialGameState.scores = gameState.scores;
              
              const { error: gameStateError } = await supabase
                .from('game_states')
                .update({
                  board: initialGameState.board,
                  current_player: initialGameState.currentPlayer,
                  move_count: initialGameState.moveCount,
                  game_over: initialGameState.gameOver,
                  winner: initialGameState.winner,
                  winning_line: initialGameState.winningLine,
                  scores: initialGameState.scores,
                  turn_start_time: initialGameState.turnStartTime?.toISOString() || null,
                  turn_time_limit: initialGameState.turnTimeLimit,
                  updated_at: new Date().toISOString()
                })
                .eq('room_id', roomId);
              
              if (gameStateError) {
                console.error('Error resetting game state:', gameStateError);
              }
            }
          } else {
            console.log('Room is empty or error occurred, no game state reset needed');
          }
        } else {
          // For regular games, always clean up the room
          console.log('Regular game room, cleaning up');
          await cleanupRoom(roomId);
        }
      } else {
        // Room not found, no need to clean up
        console.log('Room not found during leave, skipping cleanup');
      }

      // Reset local state
      setRoomId(null);
      setPlayerRole(null);
      setIsHost(false);
      setOpponent(null);
      setGameState(null);
      setCurrentPlayerName(null);
      setIsOpponentDisconnected(false); // Reset disconnection state
      console.log('All local state reset, including isOpponentDisconnected set to false');
    } catch (error) {
      console.error('Error leaving room:', error);
    } finally {
      setIsCleaningUp(false);
    }
  }, [roomId, unsubscribeFromRoom, isCleaningUp, playerId, gameState]);

  // Helper function to cleanup room data
  const cleanupRoom = async (roomIdToClean: string) => {
    if (isCleaningUpRef.current) {
      console.log('Cleanup already in progress for room:', roomIdToClean);
      return;
    }

    try {
      console.log('Cleaning up room data for:', roomIdToClean);
      
      // Delete game state first (due to foreign key constraint)
      const { error: gameStateError } = await supabase
        .from('game_states')
        .delete()
        .eq('room_id', roomIdToClean);
      
      if (gameStateError) {
        console.error('Error deleting game state:', gameStateError);
      } else {
        console.log('Game state deleted successfully for room:', roomIdToClean);
      }

      // Delete room
      const { error: roomError } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomIdToClean);
      
      if (roomError) {
        console.error('Error deleting room:', roomError);
      } else {
        console.log('Room deleted successfully:', roomIdToClean);
      }
    } catch (error) {
      console.error('Error in cleanupRoom:', error);
    }
  };

  // Function to cleanup abandoned rooms (rooms older than 30 minutes)
  const cleanupAbandonedRooms = useCallback(async () => {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      
      // Find rooms older than 30 minutes
      const { data: oldRooms, error: fetchError } = await supabase
        .from('rooms')
        .select('id')
        .lt('created_at', thirtyMinutesAgo);
      
      if (fetchError) {
        console.error('Error fetching old rooms:', fetchError);
        return;
      }

      if (oldRooms && oldRooms.length > 0) {
        console.log(`Found ${oldRooms.length} abandoned rooms to cleanup`);
        
        // Cleanup each abandoned room
        for (const room of oldRooms) {
          await cleanupRoom(room.id);
        }
      }
    } catch (error) {
      console.error('Error cleaning up abandoned rooms:', error);
    }
  }, []);

  // Periodically cleanup abandoned rooms (every 10 minutes)
  useEffect(() => {
    // Initial cleanup
    cleanupAbandonedRooms();
    
    // Setup periodic cleanup
    const cleanupInterval = setInterval(cleanupAbandonedRooms, 10 * 60 * 1000); // Every 10 minutes
    
    return () => {
      clearInterval(cleanupInterval);
    };
  }, [cleanupAbandonedRooms]);

  const makeMove = useCallback(async (row: number, col: number) => {
    if (!roomId || !gameState || !playerRole) {
      return;
    }

    // Safety mechanisms: Clear auto-restart state if it's stuck
    if (isAutoRestarting) {
      // Safety 1: if game is not actually over but auto-restart is true, clear it
      if (!gameState.gameOver && autoRestartTimeoutRef.current) {
        console.log('Game is not over but auto-restart is active, clearing auto-restart state');
        setIsAutoRestarting(false);
        if (autoRestartTimeoutRef.current) {
          clearTimeout(autoRestartTimeoutRef.current);
          autoRestartTimeoutRef.current = null;
        }
        // Don't return, let the move proceed
      }
      // Safety 2: if it's a fresh game (moveCount 0) but auto-restart is stuck, clear it
      else if (!gameState.gameOver && gameState.moveCount === 0) {
        console.log('Fresh game detected but auto-restart is stuck, clearing auto-restart state');
        setIsAutoRestarting(false);
        if (autoRestartTimeoutRef.current) {
          clearTimeout(autoRestartTimeoutRef.current);
          autoRestartTimeoutRef.current = null;
        }
        // Don't return, let the move proceed
      }
      // Only block if it's a legitimate auto-restart (game is over)
      else if (gameState.gameOver) {
        console.log('Move blocked: legitimate auto-restart in progress (game is over)');
        return;
      }
    }

    // Check if it's player's turn - silently return instead of throwing error
    if (gameState.currentPlayer !== playerRole) {
      console.log('Not your turn - move ignored');
      return;
    }

    // Check if cell is already occupied
    if (gameState.board[row][col].player !== null) {
      return;
    }

    try {
      // Create server timestamp for consistent timer synchronization
      const serverTimestamp = new Date();
      
      // Calculate new game state with server timestamp
      const newGameState = makeGameMove(gameState, row, col, serverTimestamp);
      
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
          turn_start_time: newGameState.turnStartTime?.toISOString() || null,
          turn_time_limit: newGameState.turnTimeLimit,
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
  }, [roomId, gameState, playerRole, isAutoRestarting]);

  const resetGame = useCallback(async () => {
    if (!roomId || !isHost) return;

    try {
      console.log('Starting game reset...');

      const newGameState = initializeGameState(true); // Start timer immediately for multiplayer
      // Preserve scores from current game
      if (gameState) {
        newGameState.scores = gameState.scores;
      }

      console.log('New game state created:', { 
        moveCount: newGameState.moveCount, 
        gameOver: newGameState.gameOver,
        winner: newGameState.winner,
        scores: newGameState.scores 
      });

      // Update local state immediately for responsive UI
      setGameState(newGameState);

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
          turn_start_time: newGameState.turnStartTime?.toISOString() || null,
          turn_time_limit: newGameState.turnTimeLimit,
          updated_at: new Date().toISOString()
        })
        .eq('room_id', roomId);

      if (error) {
        console.error('Database update failed during reset:', error);
        throw error;
      }

      // Clear auto-restart state only after successful database update
      console.log('Game reset completed, clearing auto-restart state');
      setIsAutoRestarting(false);

      console.log(`Game reset completed in room ${roomId}`);
    } catch (error) {
      console.error('Error resetting game:', error);
      throw error;
    }
  }, [roomId, isHost, gameState]);

  const onTurnTimeout = useCallback(async () => {
    if (!roomId || !gameState || !playerRole) return;

    try {
      // Handle timeout - current player loses
      const newGameState = handleTimeout(gameState, gameState.currentPlayer);
      
      // Update local state immediately
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
          turn_start_time: newGameState.turnStartTime?.toISOString() || null,
          turn_time_limit: newGameState.turnTimeLimit,
          updated_at: new Date().toISOString()
        })
        .eq('room_id', roomId);

      if (error) {
        console.error('Database update failed on timeout:', error);
        // Revert local state if database update fails
        setGameState(gameState);
        throw error;
      }
    } catch (error) {
      console.error('Error handling timeout:', error);
      throw error;
    }
  }, [roomId, gameState, playerRole]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Cleanup room data when component unmounts
      const cleanup = async () => {
        if (roomIdRef.current && !isCleaningUpRef.current) {
          console.log('Component unmounting, cleaning up room:', roomIdRef.current);
          await cleanupRoom(roomIdRef.current);
        }
      };

      // Cleanup real-time subscriptions
      if (roomChannel) {
        supabase.removeChannel(roomChannel);
      }
      if (roomCheckInterval) {
        clearInterval(roomCheckInterval);
      }
      if (autoRestartTimeoutRef.current) {
        clearTimeout(autoRestartTimeoutRef.current);
      }

      // Perform async cleanup only if not already cleaning up
      if (!isCleaningUpRef.current) {
        cleanup();
      }
    };
  }, []);

  // Add the function to continue waiting for opponent
  const continueWaitingForOpponent = useCallback(() => {
    setIsOpponentDisconnected(false);
  }, []);

  const value: SupabaseMultiplayerContextType = {
    isConnected,
    roomId,
    playerId,
    playerRole,
    isHost,
    opponent,
    currentPlayerName,
    gameState,
    createRoom,
    joinRoom,
    leaveRoom,
    makeMove,
    resetGame,
    onTurnTimeout,
    connectionStatus,
    isAutoRestarting,
    isOpponentDisconnected,
    continueWaitingForOpponent,
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