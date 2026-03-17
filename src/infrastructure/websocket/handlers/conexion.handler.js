const EVENTO_WS = require('../events/evento.enum');
const manejarAttack = require('./attack.handler');

/**
 * Maneja el ciclo de vida de una conexión WebSocket individual.
 * @param {import('socket.io').Socket} socket - Instancia del socket conectado.
 */
const manejarConexion = (socket) => {
  console.log(`[WS] Cliente conectado: ${socket.id}`);
  socket.on(EVENTO_WS.MENSAJE, (datos) => {
    console.log(`[WS] Mensaje de ${socket.id}:`, datos);
    socket.emit(EVENTO_WS.MENSAJE, { recibido: true, datos });
  });
  socket.on(EVENTO_WS.DESCONEXION, (razon) => {
    console.log(`[WS] Cliente desconectado: ${socket.id} - Razón: ${razon}`);
  });
  socket.on(EVENTO_WS.ERROR, (err) => {
    console.error(`[WS] Error en socket ${socket.id}:`, err.message);
  });
  socket.on(EVENTO_WS.ATTACK, (datos) => {
    manejarAttack(socket, datos ?? {});
  });
};

module.exports = manejarConexion;
