const ejecutarObtenerListadoPokemon = require('../../application/pokemon/obtener-listado-pokemon.caso-uso');
const ejecutarObtenerDetallePokemon = require('../../application/pokemon/obtener-detalle-pokemon.caso-uso');

/**
 * Controlador de Pokemon.
 * Expone endpoints para listar Pokemon y obtener su detalle.
 */
const obtenerListado = async (_req, res, next) => {
  try {
    const resultado = await ejecutarObtenerListadoPokemon();
    return res.json(resultado);
  } catch (err) {
    const error = new Error('No se pudo obtener el listado de Pokemon desde la API externa');
    error.statusCode = 502;
    return next(error);
  }
};

const obtenerDetalle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idNumerico = Number(id);
    if (Number.isNaN(idNumerico) || idNumerico <= 0) {
      const error = new Error('El ID del Pokemon debe ser un número positivo');
      error.statusCode = 400;
      return next(error);
    }
    const resultado = await ejecutarObtenerDetallePokemon(idNumerico);
    return res.json(resultado);
  } catch (err) {
    const error = new Error(`No se pudo obtener el detalle del Pokemon con ID ${req.params.id}`);
    error.statusCode = 502;
    return next(error);
  }
};

module.exports = {
  obtenerListado,
  obtenerDetalle,
};
