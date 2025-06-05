import { createClient } from '@supabase/supabase-js';

// 🔑 Supabase configuration with fallbacks
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase credentials are available
const isSupabaseConfigured = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && 
                            supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

let supabase: any = null;

try {
  if (isSupabaseConfigured) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } else {
    // Create a mock client to prevent crashes
    console.warn('Supabase not configured, using mock client');
    supabase = {
      from: () => ({
        select: () => ({ error: new Error('Supabase not configured') }),
        insert: () => ({ error: new Error('Supabase not configured') }),
        update: () => ({ error: new Error('Supabase not configured') }),
        delete: () => ({ error: new Error('Supabase not configured') }),
        single: () => ({ error: new Error('Supabase not configured') }),
      }),
      channel: () => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => {},
        unsubscribe: () => {},
      }),
    };
  }
} catch (error) {
  console.error('Failed to initialize Supabase:', error);
  // Create mock client as fallback
  supabase = {
    from: () => ({
      select: () => ({ error: new Error('Supabase initialization failed') }),
      insert: () => ({ error: new Error('Supabase initialization failed') }),
      update: () => ({ error: new Error('Supabase initialization failed') }),
      delete: () => ({ error: new Error('Supabase initialization failed') }),
      single: () => ({ error: new Error('Supabase initialization failed') }),
    }),
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
      subscribe: () => {},
      unsubscribe: () => {},
    }),
  };
}

export { supabase, isSupabaseConfigured };

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
  turn_start_time?: string; // When the current turn started
  turn_time_limit: number; // Time limit per turn in seconds (default 15)
  updated_at: string;
} 