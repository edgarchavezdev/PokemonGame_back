const { obtenerFirestore } = require('../../infrastructure/database');

/**
 * Controlador de salud del servicio.
 * Permite verificar que el servidor y Firestore están activos.
 */
const obtenerEstado = async (_req, res) => {
  let estadoFirestore = 'desconectado';
  try {
    const db = obtenerFirestore();
    await db.listCollections();
    estadoFirestore = 'conectado';
  } catch (err) {
    estadoFirestore = `error: ${err.message}`;
  }
  res.json({
    exito: true,
    datos: {
      estado: 'activo',
      firestore: estadoFirestore,
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = {
  obtenerEstado,
};
