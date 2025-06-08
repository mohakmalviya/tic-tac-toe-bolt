import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// 🔑 Supabase configuration with fallbacks
// Try multiple sources for environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 
                   Constants.expoConfig?.extra?.supabaseUrl || 
                   'https://gphimauaxuguazvobmmc.supabase.co';

const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       Constants.expoConfig?.extra?.supabaseAnonKey || 
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwaGltYXVheHVndWF6dm9ibW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4ODg3NDEsImV4cCI6MjA2NDQ2NDc0MX0.B_7vQGXtWM5buRnMAfDFSQnQ2gLyiWq83ft__oEdh8I';

// Always log environment variable status (even in production for debugging)
console.log('🔧 Supabase Environment Check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlStartsWith: supabaseUrl.startsWith('https://') ? 'https://' : 'invalid',
  urlLength: supabaseUrl.length,
  keyLength: supabaseAnonKey.length,
  isDev: __DEV__,
  nodeEnv: process.env.NODE_ENV || 'undefined',
  fromProcessEnv: !!(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  fromConstants: !!(Constants.expoConfig?.extra?.supabaseUrl && Constants.expoConfig?.extra?.supabaseAnonKey)
});

// Check if Supabase credentials are available
const isSupabaseConfigured = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && 
                            supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

// Mock query builder that chains methods properly
const createMockQueryBuilder = (errorMessage: string) => {
  const mockError = new Error(errorMessage);
  const mockResult = { data: null, error: mockError };
  
  const builder: any = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    lt: () => builder,
    gt: () => builder,
    limit: () => builder,
    single: () => builder,
    then: (resolve: Function) => resolve(mockResult),
    catch: () => builder,
  };
  
  return builder;
};

let supabase: SupabaseClient;

try {
  if (isSupabaseConfigured) {
    console.log('✅ Initializing Supabase with real credentials');
    
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    
    // Test the connection (in all environments for debugging)
    const testConnection = async () => {
      try {
        const result = await supabase.from('rooms').select('count').limit(1);
        if (result.error) {
          console.error('❌ Supabase connection test failed:', result.error);
        } else {
          console.log('✅ Supabase connection test successful');
        }
      } catch (error: any) {
        console.error('❌ Supabase connection test error:', error);
      }
    };
    testConnection();
    
  } else {
    // Create a mock client to prevent crashes
    console.warn('❌ Supabase not configured, using mock client');
    console.log('Missing credentials details:', {
      url: !supabaseUrl ? 'missing' : 'present',
      key: !supabaseAnonKey ? 'missing' : 'present',
      urlValue: supabaseUrl || 'empty',
      keyValue: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'empty'
    });
    
    supabase = {
      from: (table: string) => createMockQueryBuilder('Supabase not configured'),
      channel: (name: string) => ({
        on: (event: string, callback: Function) => ({ subscribe: () => {} }),
        subscribe: () => {},
        unsubscribe: () => {},
      }),
      removeChannel: (channel: any) => {},
    } as any;
  }
} catch (error) {
  console.error('❌ Failed to initialize Supabase:', error);
  
  // Create mock client as fallback
  supabase = {
    from: (table: string) => createMockQueryBuilder('Supabase initialization failed'),
    channel: (name: string) => ({
      on: (event: string, callback: Function) => ({ subscribe: () => {} }),
      subscribe: () => {},
      unsubscribe: () => {},
    }),
    removeChannel: (channel: any) => {},
  } as any;
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
  room_type: 'random' | 'friends';
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