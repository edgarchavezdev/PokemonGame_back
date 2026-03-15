/** @type {import('socket.io').Server | null} */
let instanciaIo = null;

/**
 * Almacena la instancia activa de Socket.IO.
 * @param {import('socket.io').Server} io
 */
const establecerIo = (io) => {
  instanciaIo = io;
};

/**
 * Obtiene la instancia activa de Socket.IO.
 * @returns {import('socket.io').Server} Instancia de Socket.IO.
 * @throws {Error} Si no ha sido inicializada.
 */
const obtenerIo = () => {
  if (!instanciaIo) {
    throw new Error('[WS] La instancia de Socket.IO no ha sido inicializada.');
  }
  return instanciaIo;
};

module.exports = { establecerIo, obtenerIo };
