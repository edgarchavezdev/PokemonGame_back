const ejecutarUnirseALobby = require('../../application/lobby/unirse-lobby.caso-uso');
const ejecutarMarcarUsuarioListo = require('../../application/lobby/marcar-usuario-listo.caso-uso');
const { obtenerIo } = require('../../infrastructure/websocket/io-instancia');
const EVENTO_WS = require('../../infrastructure/websocket/events/evento.enum');

/**
 * Controlador de Lobby.
 * Expone endpoints para unirse a un lobby de juego.
 */

/**
 * POST /api/lobby/join
 * Une a un usuario a un lobby existente o crea uno nuevo.
 * Emite el evento UNIRSE_LOBBY por WebSocket a todos los clientes conectados.
 */
const unirseALobby = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string' || !username.trim()) {
      const error = new Error('El campo username es requerido');
      error.statusCode = 400;
      return next(error);
    }
    const nombreUsuario = username.trim();
    const resultado = await ejecutarUnirseALobby({ nombreUsuario });
    const { idLobby } = resultado.datos;
    obtenerIo().emit(EVENTO_WS.UNIRSE_LOBBY, { idLobby, username: nombreUsuario,estatus: "waiting" });
    return res.json(resultado);
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/lobby/ready
 * Marca a un usuario como listo dentro de su lobby.
 * Emite el evento LISTO por WebSocket a todos los clientes conectados.
 */
const marcarListo = async (req, res, next) => {
  try {
    const { username, idLobby } = req.body;
    if (!username || typeof username !== 'string' || !username.trim()) {
      const error = new Error('El campo username es requerido');
      error.statusCode = 400;
      return next(error);
    }
    if (!idLobby || typeof idLobby !== 'string' || !idLobby.trim()) {
      const error = new Error('El campo idLobby es requerido');
      error.statusCode = 400;
      return next(error);
    }
    const resultado = await ejecutarMarcarUsuarioListo({
      nombreUsuario: username.trim(),
      idLobby: idLobby.trim(),
    });
    obtenerIo().emit(EVENTO_WS.LISTO, { idLobby: idLobby.trim(), username: username.trim() });
    return res.json(resultado);
  } catch (err) {
    return next(err);
  }
};

module.exports = { unirseALobby, marcarListo };
