require('dotenv').config();

/** Configuración del entorno cargada desde variables de entorno */
const configuracionEntorno = {
  puerto: parseInt(process.env.PORT, 10) || 3000,
  entorno: process.env.NODE_ENV || 'development',
  rutaWebSocket: process.env.WS_PATH || '/ws',
  esProduccion: process.env.NODE_ENV === 'production',
  esDesarrollo: process.env.NODE_ENV === 'development',
};

module.exports = configuracionEntorno;
