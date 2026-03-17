const lobbyRepositorio = require('../../infrastructure/database/lobby-repositorio');
const { obtenerIo } = require('../../infrastructure/websocket/io-instancia');
const EVENTO_WS = require('../../infrastructure/websocket/events/evento.enum');

/**
 * Construye un payload seguro para emitir por Socket.IO (solo datos serializables a JSON).
 * Evita undefined, referencias circulares y objetos que provocan parse error en el cliente.
 * @param {Object} obj - Objeto con datos a enviar.
 * @returns {Object} Copia plana serializable.
 */
const payloadSerializable = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Caso de uso: Procesa un ataque en una batalla.
 * Tienes acceso a:
 * - lobbyRepositorio (Firestore): obtenerPorId, actualizar, etc.
 * - obtenerIo(): instancia de Socket.IO para emitir (ej. ATTACK_RESULT a sala idLobby).
 *
 * @param {Object} parametros - Datos del ataque enviados por el cliente.
 * @param {string} [parametros.idLobby] - ID del lobby/batalla.
 * @param {string} [parametros.username] - Usuario que ataca.
 * @param {*} [parametros...] - Resto de campos que envíe el cliente.
 * @returns {Promise<Object>} Resultado del ataque (lo que quieras devolver/emitir).
 */
const ejecutarAtaque = async (datos) => {
  const { idLobby, username, atacante, defensor} = datos;
  const lobby = await lobbyRepositorio.obtenerPorId(idLobby);
  const io = obtenerIo();

  let datos_battalla = lobby.batalla ?? [];

  const user_atacante = datos_battalla.usuarios.find(usuario => usuario.username === username);
  const user_defensor = datos_battalla.usuarios.find(usuario => usuario.username !== username);
  
  
  const pokemon_atacante = user_atacante.pokemons.find(pokemon => pokemon.name === atacante.name);
  const pokemon_defensor = user_defensor.pokemons.find(pokemon => pokemon.name === defensor.name);
  
  
  let damage = (parseInt(pokemon_atacante.attack) - parseInt(pokemon_defensor.defense)) < 0 ? 1 : (parseInt(pokemon_atacante.attack) - parseInt(pokemon_defensor.defense))
  let currentHP_defensor = parseInt(pokemon_defensor.currentHP) - damage;
  if (currentHP_defensor <= 0) {
    currentHP_defensor = 0;
    pokemon_defensor.estatus = 'defeated';
  }
  pokemon_defensor.currentHP = currentHP_defensor;
  datos_battalla.usuarios = datos_battalla.usuarios.map(usuario => usuario.username === username ? { ...usuario, pokemons: usuario.pokemons.map(pokemon => pokemon.name === defensor.name ? { ...pokemon, currentHP: currentHP_defensor } : pokemon) } : usuario);
  await lobbyRepositorio.actualizar(idLobby, { batalla: datos_battalla });

  let mensaje = `${atacante.name} ha atacado a ${defensor.name} y le ha infligido ${damage} puntos de daño.`;
  io.emit(EVENTO_WS.ATTACK_RESULT, payloadSerializable({ idLobby, mensaje, username, atacante: atacante.name, defensor: { username: user_defensor.username, name: defensor.name, currentHP: currentHP_defensor } }));

  await new Promise(resolve => setTimeout(resolve, 2000));

  if(pokemon_defensor.estatus === 'defeated') {
      let count_defeated = user_defensor.pokemons.filter(pokemon => pokemon.estatus === 'defeated').length;
      if(count_defeated === user_defensor.pokemons.length) {
        //se gana la batalla
        let mensaje = `La batalla ha terminado y ha ganado ${user_atacante.username}`;
        io.emit(EVENTO_WS.BATTLE_RESULT, payloadSerializable({ idLobby, mensaje, username }));
      }else{
        let next_pokemon = user_defensor.pokemons.filter(pokemon => pokemon.estatus === 'pending')[0];
        next_pokemon.estatus = 'active';
        datos_battalla.usuarios = datos_battalla.usuarios.map(usuario => usuario.username === user_defensor.username ? { ...usuario, pokemons: usuario.pokemons.map(pokemon => pokemon.name === next_pokemon.name ? { ...pokemon, estatus: 'active' } : pokemon) } : usuario);
        await lobbyRepositorio.actualizar(idLobby, { batalla: datos_battalla });
        
        io.emit(EVENTO_WS.POKEMON_CHANGE, payloadSerializable({ idLobby, username: user_defensor.username ?? '', new_pokemon: next_pokemon.name ?? '', old_pokemon: defensor.name ?? '' }));
        mensaje = `Es el turno de ${user_defensor.username}`;
        io.emit(EVENTO_WS.TURN_CHANGE, payloadSerializable({ idLobby, mensaje ,username: user_defensor.username ?? ''}));
      }
  }else{
    mensaje = `Es el turno de ${user_defensor.username}`;
    io.emit(EVENTO_WS.TURN_CHANGE, payloadSerializable({ idLobby, mensaje, username: user_defensor.username ?? '' }));
  }

};

module.exports = ejecutarAtaque;
