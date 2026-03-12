const { Router } = require('express');
const healthRoutes = require('./health.routes');

/**
 * Registra todas las rutas de la API bajo el prefijo /api.
 * Agregar nuevas rutas aquí conforme crezca el proyecto.
 */
const crearEnrutadorPrincipal = () => {
  const router = Router();
  router.use('/health', healthRoutes);
  return router;
};

module.exports = crearEnrutadorPrincipal;
