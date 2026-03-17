const lobbyRepositorio = require('../../infrastructure/database/lobby-repositorio');
const pokemonApiCliente = require('../../infrastructure/http/pokemon-api.cliente');
const { obtenerIo } = require('../../infrastructure/websocket/io-instancia');
const EVENTO_WS = require('../../infrastructure/websocket/events/evento.enum');

const ESTATUS_EN_BATALLA = 'in_battle';
const TOTAL_POKEMONS_POR_USUARIO = 3;

/**
 * Obtiene una cantidad de Pokemon aleatorios desde el listado (Fisher-Yates).
 * Extrae el array de listado.data y devuelve los IDs de los elegidos.
 * @param {{data?: Array<{id?: number}>}} listado - Respuesta de obtenerListado.
 * @param {number} cantidad - Cantidad de Pokemon a elegir.
 * @returns {number[]} Array de IDs de los Pokemon elegidos.
 */
const obtenerPokemonsAleatorios = (listado, cantidad) => {
  const resultado = [...listado]; // Copiamos para no modificar la original
  for (let i = resultado.length - 1; i > resultado.length - 1 - cantidad; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]]; // Intercambio (Swap)
  }
  return resultado.slice(-cantidad);
};

/**
 * Caso de uso: Inicia la batalla en un lobby.
 * Obtiene el lobby de Firestore, asigna Pokemon aleatorios a la batalla,
 * actualiza el estado del lobby y emite el evento BATTLE_START por Socket.IO.
 * @param {{idLobby: string}} parametros
 * @returns {Promise<{exito: boolean, datos: {idLobby: string, batalla: Object}}>}
 * @throws {Error} Si el lobby no existe o no tiene dos usuarios listos.
 */
const ejecutarIniciarBatalla = async ({ idLobby }) => {
  const lobby = await lobbyRepositorio.obtenerPorId(idLobby);
  let usuarios = lobby.usuarios ?? [];
  const listado = await pokemonApiCliente.obtenerListado();  
  const list_pokemons_rnd = obtenerPokemonsAleatorios(listado.data ?? listado['data'],TOTAL_POKEMONS_POR_USUARIO*2);
  const pokemons = await obtenerDetallePokemonsAleatorios(list_pokemons_rnd);
  let list_usuarios = [];
  usuarios.forEach(usuario => {
      let user = {
        id: usuario.id,
        username: usuario.username,
        pokemons: pokemons.slice(usuario.id == 1 ? 0 : TOTAL_POKEMONS_POR_USUARIO,usuario.id == 1 ? TOTAL_POKEMONS_POR_USUARIO : pokemons.length)
      };
      list_usuarios.push(user);
  });
  list_usuarios.forEach(usuario => {
    usuario.pokemons[0].estatus = 'active';
  });
  const batalla = {
    usuarios: list_usuarios,
    turno_actual: list_usuarios[0].pokemons[0].speed > list_usuarios[1].pokemons[0].speed ? list_usuarios[0].username : list_usuarios[1].username,
    estatus: ESTATUS_EN_BATALLA
  };
  await lobbyRepositorio.actualizar(idLobby, {
    estatus: ESTATUS_EN_BATALLA,
    batalla,
  });
  const payload = { idLobby, batalla };
  obtenerIo().emit(EVENTO_WS.BATTLE_START, payload);
};

/**
 * Obtiene el detalle de los Pokemon aleatorios desde el listado.
 * @param {{data?: Array<{id?: number}>}} listado - Respuesta de obtenerListado.
 * @returns {Promise<Array<{id?: number, nombre?: string, sprite?: string, sprite2?: string, estatus?: string}>>} Array de detalles de los Pokemon.
 */
const obtenerDetallePokemonsAleatorios = async (listado) => {
  return await Promise.all(listado.map(async (pokemon) => {
    const pokemon_detail = await pokemonApiCliente.obtenerPorId(pokemon.id);
    return { ...pokemon_detail.data, ...{estatus: 'pending',currentHP:pokemon_detail.data.hp}};
  }));
};

module.exports = ejecutarIniciarBatalla;
