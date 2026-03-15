const { Router } = require('express');
const healthRoutes = require('./health.routes');
const pokemonRoutes = require('./pokemon.routes');
const lobbyRoutes = require('./lobby.routes');

/**
 * Registra todas las rutas de la API bajo el prefijo /api.
 * Agregar nuevas rutas aquí conforme crezca el proyecto.
 */
const crearEnrutadorPrincipal = () => {
  const router = Router();
  router.use('/health', healthRoutes);
  router.use('/pokemon', pokemonRoutes);
  router.use('/lobby', lobbyRoutes);
  return router;
};

module.exports = crearEnrutadorPrincipal;
