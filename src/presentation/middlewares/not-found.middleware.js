/**
 * Middleware para rutas no encontradas (404).
 */
const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    exito: false,
    error: {
      mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    },
  });
};

module.exports = notFoundMiddleware;
