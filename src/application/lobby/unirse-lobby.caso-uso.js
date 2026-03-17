const lobbyRepositorio = require('../../infrastructure/database/lobby-repositorio');
const ejecutarRegistrarEventoLobby = require('./registrar-evento-lobby.caso-uso');

const ESTATUS_ESPERANDO = 'waiting';
const ESTATUS_COMPLETO = 'complete';
const LONGITUD_NOMBRE = 4;
const CARACTERES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Genera un nombre aleatorio de 4 caracteres alfanuméricos.
 * @returns {string} Nombre aleatorio.
 */
const generarNombreAleatorio = () => {
  let nombre = '';
  for (let i = 0; i < LONGITUD_NOMBRE; i++) {
    nombre += CARACTERES.charAt(Math.floor(Math.random() * CARACTERES.length));
  }
  return nombre;
};

/**
 * Obtiene el lobby más reciente en estado "waiting" o crea uno nuevo.
 * @returns {Promise<{id: string, estatus: string, usuario1: string|null, usuario2: string|null}>}
 */
const obtenerOCrearLobby = async () => {
  const lobbyReciente = await lobbyRepositorio.obtenerMasReciente();
  if (lobbyReciente && lobbyReciente.estatus === ESTATUS_ESPERANDO) {
    return lobbyReciente;
  }
  const nombre = generarNombreAleatorio();
  await lobbyRepositorio.crearConId(nombre, {
    estatus: ESTATUS_ESPERANDO,
    usuario1: null,
    usuario2: null,
    usuarios: [],
    eventos: [],
  });
  return { id: nombre, estatus: ESTATUS_ESPERANDO, usuario1: null, usuario2: null,usuarios:[],eventos:[] };
};

/**
 * Asigna el usuario al primer campo vacío (usuario1 o usuario2) del lobby.
 * @param {{id: string, usuario1: string|null, usuario2: string|null}} lobby
 * @param {string} nombreUsuario
 * @returns {Promise<void>}
 */
const asignarUsuarioEnLobby = async (lobby, nombreUsuario) => {
  const camposActualizar = {
    estatus: lobby.estatus,
    usuarios: lobby.usuarios
  };
  if(lobby.usuarios.length < 2) {
    camposActualizar.usuarios.push({  id: lobby.usuarios.length + 1, username: nombreUsuario, estatus: ESTATUS_ESPERANDO });
  }
  if(camposActualizar.usuarios.length == 2) {
    camposActualizar.estatus = ESTATUS_COMPLETO;
  }else{
    camposActualizar.estatus = ESTATUS_ESPERANDO;
  }
  
  await lobbyRepositorio.actualizar(lobby.id, camposActualizar);
};

/**
 * Caso de uso: Une a un usuario a un lobby existente en estado "waiting"
 * o crea uno nuevo si no existe ninguno disponible.
 * @param {{nombreUsuario: string}} parametros
 * @returns {Promise<{exito: boolean, datos: {idLobby: string}}>}
 */
const ejecutarUnirseALobby = async ({ nombreUsuario }) => {
  const lobby = await obtenerOCrearLobby();
  await asignarUsuarioEnLobby(lobby, nombreUsuario);
  await ejecutarRegistrarEventoLobby({ idLobby: lobby.id, tipo: 'join', datos: { username: nombreUsuario } });
  return { exito: true, datos: { idLobby: lobby.id, usuarios: lobby.usuarios } };
};

module.exports = ejecutarUnirseALobby;
