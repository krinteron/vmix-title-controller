const { Router } = require('express');

const router = Router();
const controller = require('../controllers/statusController');

router.get('/status', controller.get_status);

module.exports = router;
