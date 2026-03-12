const http = require('http');
const { configuracionEntorno } = require('./infrastructure/config');
const crearApp = require('./infrastructure/server/app');
const inicializarWebSocket = require('./infrastructure/websocket');

const app = crearApp();
const servidorHttp = http.createServer(app);

inicializarWebSocket(servidorHttp, configuracionEntorno.rutaWebSocket);

servidorHttp.listen(configuracionEntorno.puerto, () => {
  console.log(`[SERVER] Servidor corriendo en http://localhost:${configuracionEntorno.puerto}`);
  console.log(`[SERVER] Entorno: ${configuracionEntorno.entorno}`);
  console.log(`[SERVER] Ruta WebSocket: ${configuracionEntorno.rutaWebSocket}`);
});
