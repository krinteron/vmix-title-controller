const { Router } = require('express');

const router = Router();
const controller = require('../controllers/titlesController');

router.get('/vmix-store', controller.get_vmix_store);

module.exports = router;
