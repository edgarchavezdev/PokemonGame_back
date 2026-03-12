/**
 * Middleware que registra cada petición HTTP entrante.
 * Imprime método, URL y timestamp en consola.
 */
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = loggerMiddleware;
