const pokemonApiCliente = require('../../infrastructure/http/pokemon-api.cliente');

/**
 * Caso de uso: obtener el detalle de un Pokemon por su ID.
 * @param {number} id - Identificador del Pokemon.
 * @returns {Promise<{exito: boolean, datos: Object}>} Detalle formateado.
 */
const ejecutarObtenerDetallePokemon = async (id) => {
  const respuesta = await pokemonApiCliente.obtenerPorId(id);
  return {
    exito: respuesta.success,
    datos: respuesta.data,
  };
};

module.exports = ejecutarObtenerDetallePokemon;
