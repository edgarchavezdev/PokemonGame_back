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
  BATTLE_START: 'battle_start',
};

module.exports = EVENTO_WS;
