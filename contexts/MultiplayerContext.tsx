import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, PlayerType } from '@/types/game';

interface MultiplayerContextType {
  socket: Socket | null;
  isConnected: boolean;
  roomId: string | null;
  playerId: string | null;
  playerRole: PlayerType | null;
  isHost: boolean;
  opponent: { id: string; name: string } | null;
  gameState: GameState | null;
  createRoom: (playerName: string) => void;
  joinRoom: (roomId: string, playerName: string) => void;
  leaveRoom: () => void;
  makeMove: (row: number, col: number) => void;
  resetGame: () => void;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  connectToServer: () => void;
  disconnectFromServer: () => void;
}

const MultiplayerContext = createContext<MultiplayerContextType | undefined>(undefined);

// Replace with your actual server URL - for development, you can use ngrok or similar
const SERVER_URL = __DEV__ ? 'http://192.168.29.216:3001' : 'https://your-server-url.com';

interface MultiplayerProviderProps {
  children: React.ReactNode;
}

export const MultiplayerProvider: React.FC<MultiplayerProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerRole, setPlayerRole] = useState<PlayerType | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [opponent, setOpponent] = useState<{ id: string; name: string } | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');

  const connectToServer = useCallback(() => {
    if (socket) return; // Already connected or connecting

    console.log('Connecting to multiplayer server...');
    setConnectionStatus('connecting');
    
    const socketInstance = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setConnectionStatus('connected');
      setPlayerId(socketInstance.id || null);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setRoomId(null);
      setPlayerRole(null);
      setIsHost(false);
      setOpponent(null);
      setGameState(null);
    });

    socketInstance.on('connect_error', (error: Error) => {
      console.error('Connection error:', error);
      setConnectionStatus('error');
    });

    // Room events
    socketInstance.on('room-created', (data: { roomId: string; role: PlayerType }) => {
      setRoomId(data.roomId);
      setPlayerRole(data.role);
      setIsHost(true);
    });

    socketInstance.on('room-joined', (data: { roomId: string; role: PlayerType; opponent: { id: string; name: string } }) => {
      setRoomId(data.roomId);
      setPlayerRole(data.role);
      setIsHost(false);
      setOpponent(data.opponent);
    });

    socketInstance.on('player-joined', (data: { opponent: { id: string; name: string } }) => {
      setOpponent(data.opponent);
    });

    socketInstance.on('player-left', () => {
      setOpponent(null);
      // Optionally pause the game or show a "waiting for opponent" message
    });

    socketInstance.on('room-error', (error: string) => {
      console.error('Room error:', error);
      alert(`Room error: ${error}`);
    });

    // Game events
    socketInstance.on('game-state-updated', (newGameState: GameState) => {
      setGameState(newGameState);
    });

    socketInstance.on('move-made', (data: { gameState: GameState }) => {
      setGameState(data.gameState);
    });

    socketInstance.on('game-reset', (newGameState: GameState) => {
      setGameState(newGameState);
    });

    setSocket(socketInstance);
  }, [socket]);

  const disconnectFromServer = useCallback(() => {
    if (socket) {
      console.log('Disconnecting from server...');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setRoomId(null);
      setPlayerRole(null);
      setIsHost(false);
      setOpponent(null);
      setGameState(null);
      setPlayerId(null);
    }
  }, [socket]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const createRoom = useCallback((playerName: string) => {
    if (socket && isConnected) {
      socket.emit('create-room', { playerName });
    }
  }, [socket, isConnected]);

  const joinRoom = useCallback((roomId: string, playerName: string) => {
    if (socket && isConnected) {
      socket.emit('join-room', { roomId, playerName });
    }
  }, [socket, isConnected]);

  const leaveRoom = useCallback(() => {
    if (socket && roomId) {
      socket.emit('leave-room', { roomId });
      setRoomId(null);
      setPlayerRole(null);
      setIsHost(false);
      setOpponent(null);
      setGameState(null);
    }
  }, [socket, roomId]);

  const makeMove = useCallback((row: number, col: number) => {
    if (socket && roomId && gameState) {
      socket.emit('make-move', { roomId, row, col });
    }
  }, [socket, roomId, gameState]);

  const resetGame = useCallback(() => {
    if (socket && roomId) {
      socket.emit('reset-game', { roomId });
    }
  }, [socket, roomId]);

  const value: MultiplayerContextType = {
    socket,
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
    connectToServer,
    disconnectFromServer,
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = (): MultiplayerContextType => {
  const context = useContext(MultiplayerContext);
  if (context === undefined) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
}; 