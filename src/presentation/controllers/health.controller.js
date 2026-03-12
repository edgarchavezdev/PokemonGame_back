/**
 * Controlador de salud del servicio.
 * Permite verificar que el servidor está activo.
 */
const obtenerEstado = (_req, res) => {
  res.json({
    exito: true,
    datos: {
      estado: 'activo',
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = {
  obtenerEstado,
};
