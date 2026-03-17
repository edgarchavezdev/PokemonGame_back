const ejecutarAtaque = require('../../../application/battle/ejecutar-ataque.caso-uso');

/**
 * Maneja el evento attack recibido por WebSocket.
 * Delega en el caso de uso que controla la lógica de batalla.
 * @param {import('socket.io').Socket} socket - Socket del cliente que emitió el evento.
 * @param {Object} datos - Payload del ataque (idLobby, username, etc.).
 */
const manejarAttack = async (socket, datos) => {
  try {
    const payload = datos ?? {};
    await ejecutarAtaque(payload);
  } catch (err) {
    console.error(`[WS] Error en attack (socket ${socket.id}):`, err.message);
    socket.emit('error', { mensaje: err.message });
  }
};

module.exports = manejarAttack;
