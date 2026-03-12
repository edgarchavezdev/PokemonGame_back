/**
 * Middleware global para manejo de errores.
 * Captura excepciones no controladas y responde con formato JSON.
 */
const errorHandlerMiddleware = (err, req, res, _next) => {
  const codigoEstado = err.statusCode || 500;
  const mensaje = err.message || 'Error interno del servidor';
  console.error(`[ERROR] ${codigoEstado} - ${mensaje}`, err.stack);
  res.status(codigoEstado).json({
    exito: false,
    error: {
      mensaje,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

module.exports = errorHandlerMiddleware;
