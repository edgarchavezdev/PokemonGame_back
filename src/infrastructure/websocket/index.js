const { Server } = require('socket.io');
const { configuracionCors } = require('../config');
const manejarConexion = require('./handlers/conexion.handler');
const { establecerIo } = require('./io-instancia');

/**
 * Inicializa el servidor de WebSocket (Socket.IO) sobre un servidor HTTP.
 * Almacena la instancia en el singleton para uso desde otros módulos.
 * @param {import('http').Server} servidorHttp - Servidor HTTP base.
 * @param {string} ruta - Ruta en la que escucha el WebSocket.
 * @returns {import('socket.io').Server} Instancia de Socket.IO.
 */
const inicializarWebSocket = (servidorHttp, ruta = '/ws') => {
  const io = new Server(servidorHttp, {
    path: ruta,
    cors: configuracionCors,
  });
  establecerIo(io);
  io.on('connection', manejarConexion);
  console.log(`[WS] WebSocket inicializado en ruta: ${ruta}`);
  return io;
};

module.exports = inicializarWebSocket;
