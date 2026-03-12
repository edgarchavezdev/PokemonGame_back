const { Server } = require('socket.io');
const { configuracionCors } = require('../config');
const manejarConexion = require('./handlers/conexion.handler');

/**
 * Inicializa el servidor de WebSocket (Socket.IO) sobre un servidor HTTP.
 * @param {import('http').Server} servidorHttp - Servidor HTTP base.
 * @param {string} ruta - Ruta en la que escucha el WebSocket.
 * @returns {import('socket.io').Server} Instancia de Socket.IO.
 */
const inicializarWebSocket = (servidorHttp, ruta = '/ws') => {
  const io = new Server(servidorHttp, {
    path: ruta,
    cors: configuracionCors,
  });
  io.on('connection', manejarConexion);
  console.log(`[WS] WebSocket inicializado en ruta: ${ruta}`);
  return io;
};

module.exports = inicializarWebSocket;
