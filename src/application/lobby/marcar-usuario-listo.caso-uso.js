const lobbyRepositorio = require('../../infrastructure/database/lobby-repositorio');
const ejecutarRegistrarEventoLobby = require('./registrar-evento-lobby.caso-uso');

const ESTATUS_LISTO = 'listo';
const LOBBY_ESTATUS_BATTLING = 'battling';

/**
 * Busca al usuario dentro del array de usuarios del lobby y actualiza su estatus a "listo".
 * @param {Array<{id: number, username: string, estatus: string}>} usuarios
 * @param {string} nombreUsuario
 * @returns {{usuarios: Array, encontrado: boolean}} Array actualizado e indicador si fue encontrado.
 */
const actualizarEstatusUsuario = (usuarios, nombreUsuario) => {
  let encontrado = false;
  const usuariosActualizados = usuarios.map((usuario) => {
    if (usuario.username !== nombreUsuario) {
      return usuario;
    }
    encontrado = true;
    return { ...usuario, estatus: ESTATUS_LISTO };
  });
  return { usuarios: usuariosActualizados, encontrado };
};

/**
 * Caso de uso: Marca a un usuario dentro de un lobby como "listo".
 * @param {{nombreUsuario: string, idLobby: string}} parametros
 * @returns {Promise<{exito: boolean, datos: {idLobby: string, username: string}}>}
 * @throws {Error} Si el lobby no existe o el usuario no pertenece a él.
 */
const ejecutarMarcarUsuarioListo = async ({ nombreUsuario, idLobby }) => {
  const lobby = await lobbyRepositorio.obtenerPorId(idLobby);
  if (!lobby) {
    const error = new Error(`No se encontró el lobby con id: ${idLobby}`);
    error.statusCode = 404;
    throw error;
  }
  const { usuarios, encontrado } = actualizarEstatusUsuario(lobby.usuarios ?? [], nombreUsuario);
  if (!encontrado) {
    const error = new Error(`El usuario "${nombreUsuario}" no pertenece al lobby "${idLobby}"`);
    error.statusCode = 404;
    throw error;
  }
  const lobbyReady = usuarios.filter(usuario => usuario.estatus === ESTATUS_LISTO).length === 2;

  const estatusLobby = lobbyReady ? LOBBY_ESTATUS_BATTLING : lobby.estatus;
  await lobbyRepositorio.actualizar(idLobby, { usuarios, estatus: estatusLobby });
  await ejecutarRegistrarEventoLobby({ idLobby, tipo: 'ready', datos: { username: nombreUsuario, lobbyReady } });
  return { exito: true, datos: { idLobby, username: nombreUsuario, lobbyReady } };
};

module.exports = ejecutarMarcarUsuarioListo;
