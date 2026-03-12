const configuracionEntorno = require('./env.config');
const configuracionCors = require('./cors.config');
const { configuracionFirebase, validarConfiguracionFirebase } = require('./firebase.config');

module.exports = {
  configuracionEntorno,
  configuracionCors,
  configuracionFirebase,
  validarConfiguracionFirebase,
};
