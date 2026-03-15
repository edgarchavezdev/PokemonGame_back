const { Router } = require('express');
const lobbyController = require('../controllers/lobby.controller');

const router = Router();

/** POST /api/lobby/join - Unirse o crear un lobby */
router.post('/join', lobbyController.unirseALobby);

/** POST /api/lobby/ready - Marcar usuario como listo en su lobby */
router.post('/ready', lobbyController.marcarListo);

module.exports = router;
