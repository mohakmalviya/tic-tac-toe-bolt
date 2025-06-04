import { createClient } from '@supabase/supabase-js';

// 🔑 Supabase configuration
// Option 1: Use environment variables (recommended)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Option 2: Replace the values above directly if not using .env file
// const supabaseUrl = 'https://xxxxxxxxxxxxxxxxxx.supabase.co';
// const supabaseAnonKey = 'your-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types for TypeScript
export interface Room {
  id: string;
  host_id: string;
  host_name: string;
  guest_id?: string;
  guest_name?: string;
  status: 'waiting' | 'playing' | 'finished';
  created_at: string;
}

export interface GameStateDB {
  room_id: string;
  board: any; // JSONB
  current_player: 'X' | 'O';
  move_count: number;
  game_over: boolean;
  winner?: string;
  winning_line?: any; // JSONB
  scores: {
    X: number;
    O: number;
    draws: number;
  };
  updated_at: string;
} 