const lobbyRepositorio = require('../../infrastructure/database/lobby-repositorio');

/**
 * Caso de uso: Registra un evento en el array "eventos" del documento del lobby.
 * Cada item de la colección lobby tendrá su historial en lobby.eventos.
 *
 * @param {Object} parametros
 * @param {string} parametros.idLobby - ID del lobby.
 * @param {string} parametros.tipo - Tipo de evento (ej. 'join', 'ready', 'battle_start', 'attack', 'pokemon_change', 'battle_result').
 * @param {Object} [parametros.datos] - Datos del evento (objeto serializable).
 * @returns {Promise<{exito: boolean, idLobby: string}>}
 */
const ejecutarRegistrarEventoLobby = async ({ idLobby, tipo, datos = {} }) => {
  const evento = { tipo, datos };
  await lobbyRepositorio.agregarEvento(idLobby, evento);
  return { exito: true, idLobby };
};

module.exports = ejecutarRegistrarEventoLobby;
