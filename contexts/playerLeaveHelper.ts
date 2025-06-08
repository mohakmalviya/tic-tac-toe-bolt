// Helper function to handle player leaving a random room
import { supabase } from '@/utils/supabase';
import { initializeGameState } from '@/utils/gameLogic';

export const handlePlayerLeaveRandomRoom = async (roomId: string, isPlayerHost: boolean) => {
  try {
    console.log(`Player ${isPlayerHost ? 'host' : 'guest'} leaving random room, but keeping room active`);
    
    // Prepare update based on which player is leaving (host or guest)
    const updateData = isPlayerHost 
      ? { host_id: null, host_name: null, status: 'waiting' } 
      : { guest_id: null, guest_name: null, status: 'waiting' };
    
    // Update the room to remove the leaving player
    const { error: updateError } = await supabase
      .from('rooms')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', roomId);
    
    if (updateError) {
      console.error('Error updating room for player leave:', updateError);
      return;
    }
    
    // Reset game state to an empty board but preserve the room
    const initialGameState = initializeGameState(false); // Don't start timer yet
    
    const { error: gameStateError } = await supabase
      .from('game_states')
      .update({
        board: initialGameState.board,
        current_player: initialGameState.currentPlayer,
        move_count: initialGameState.moveCount,
        game_over: initialGameState.gameOver,
        winner: initialGameState.winner,
        winning_line: initialGameState.winningLine,
        scores: { X: 0, O: 0 }, // Reset scores when a player leaves
        turn_start_time: null, // Don't start timer until new player joins
        turn_time_limit: initialGameState.turnTimeLimit,
        updated_at: new Date().toISOString()
      })
      .eq('room_id', roomId);
    
    if (gameStateError) {
      console.error('Error resetting game state for player leave:', gameStateError);
    }
    
    console.log('Random room updated, player removed but room preserved');
  } catch (error) {
    console.error('Error in handlePlayerLeaveRandomRoom:', error);
  }
};
