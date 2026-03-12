const { Router } = require('express');
const pokemonController = require('../controllers/pokemon.controller');

const router = Router();

/** GET /api/pokemon - Obtener listado de Pokemon */
router.get('/', pokemonController.obtenerListado);

/** GET /api/pokemon/:id - Obtener detalle de un Pokemon */
router.get('/:id', pokemonController.obtenerDetalle);

module.exports = router;
