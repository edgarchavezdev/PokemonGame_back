/**
 * Enum con los nombres de eventos del WebSocket.
 * Centraliza los nombres para evitar strings mágicos.
 */
const EVENTO_WS = {
  CONEXION: 'connection',
  DESCONEXION: 'disconnect',
  ERROR: 'error',
  MENSAJE: 'mensaje',
  UNIRSE_LOBBY: 'join_lobby',
  LISTO: 'ready',
  LOBBY_READY: 'lobby_ready',
  BATTLE_START: 'battle_start',
  BATTLE_TURN: 'turn_result',
  ATTACK: 'attack',
  ATTACK_RESULT: 'attack_result',
  TURN_CHANGE: 'turn_change',
  TURN_RESULT: 'turn_result',
  POKEMON_CHANGE: 'pokemon_change',
  BATTLE_RESULT: 'battle_end',
};

module.exports = EVENTO_WS;
