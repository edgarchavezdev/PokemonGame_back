const axios = require('axios');
const { configuracionEntorno } = require('../config');

const TIMEOUT_MS = 10000;

const instanciaAxios = axios.create({
  baseURL: configuracionEntorno.pokemonApiUrl,
  timeout: TIMEOUT_MS,
});

/**
 * Cliente HTTP para consumir la API externa de Pokemon.
 * Centraliza las llamadas para facilitar cambios de URL o configuración.
 */
const pokemonApiCliente = {
  /**
   * Obtiene el listado completo de Pokemon.
   * @returns {Promise<{success: boolean, total: number, data: Array}>} Respuesta de la API externa.
   */
  obtenerListado: async () => {
    const { data } = await instanciaAxios.get('/list');
    return data;
  },
  /**
   * Obtiene el detalle de un Pokemon por su ID.
   * @param {number} id - Identificador del Pokemon.
   * @returns {Promise<{success: boolean, data: Object}>} Respuesta de la API externa.
   */
  obtenerPorId: async (id) => {
    const { data } = await instanciaAxios.get(`/list/${id}`);
    return data;
  },
};

module.exports = pokemonApiCliente;
