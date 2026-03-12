const { Router } = require('express');
const healthController = require('../controllers/health.controller');

const router = Router();

/** GET /api/health - Verificar estado del servicio */
router.get('/', healthController.obtenerEstado);

module.exports = router;
