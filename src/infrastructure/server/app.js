const express = require('express');
const cors = require('cors');
const { configuracionCors } = require('../config');
const loggerMiddleware = require('../../presentation/middlewares/logger.middleware');
const notFoundMiddleware = require('../../presentation/middlewares/not-found.middleware');
const errorHandlerMiddleware = require('../../presentation/middlewares/error-handler.middleware');
const crearEnrutadorPrincipal = require('../../presentation/routes');

/**
 * Crea y configura la instancia de Express.
 * @returns {express.Application} Aplicación Express configurada.
 */
const crearApp = () => {
  const app = express();
  app.use(cors(configuracionCors));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(loggerMiddleware);
  app.use('/api', crearEnrutadorPrincipal());
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);
  return app;
};

module.exports = crearApp;
