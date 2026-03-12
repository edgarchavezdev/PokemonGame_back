/**
 * Enum con los nombres de eventos del WebSocket.
 * Centraliza los nombres para evitar strings mágicos.
 */
const EVENTO_WS = {
  CONEXION: 'connection',
  DESCONEXION: 'disconnect',
  ERROR: 'error',
  MENSAJE: 'mensaje',
};

module.exports = EVENTO_WS;
