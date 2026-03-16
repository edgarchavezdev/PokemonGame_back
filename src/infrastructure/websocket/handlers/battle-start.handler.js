const ejecutarIniciarBatalla = require('../../../application/battle/iniciar-batalla.caso-uso');

/**
 * Maneja el evento battle_start recibido por WebSocket.
 * Delega en el caso de uso que accede a Firestore, API de Pokemon y Socket.IO.
 * @param {import('socket.io').Socket} socket - Socket del cliente que emitió el evento.
 * @param {Object} datos - Payload enviado por el cliente (debe incluir idLobby).
 */
const manejarBattleStart = async (socket, datos) => {
  try {
    const idLobby = datos?.idLobby ?? datos?.id;
    if (!idLobby) {
      socket.emit('error', { mensaje: 'idLobby es requerido para iniciar la batalla.' });
      return;
    }
    await ejecutarIniciarBatalla({ idLobby: String(idLobby) });
  } catch (err) {
    console.error(`[WS] Error en battle_start (socket ${socket.id}):`, err.message);
    socket.emit('error', { mensaje: err.message });
  }
};

module.exports = manejarBattleStart;
