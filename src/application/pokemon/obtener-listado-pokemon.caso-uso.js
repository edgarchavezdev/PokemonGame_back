const pokemonApiCliente = require('../../infrastructure/http/pokemon-api.cliente');

/**
 * Caso de uso: obtener el listado de Pokemon desde la API externa.
 * @returns {Promise<{exito: boolean, total: number, datos: Array}>} Listado formateado.
 */
const ejecutarObtenerListadoPokemon = async () => {
  const respuesta = await pokemonApiCliente.obtenerListado();
  return {
    exito: respuesta.success,
    total: respuesta.total,
    datos: respuesta.data,
  };
};

module.exports = ejecutarObtenerListadoPokemon;
