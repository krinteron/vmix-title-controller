const { Router } = require('express');

const router = Router();
const controller = require('../controllers/titlesController');

router.get('/vmix-store', controller.get_vmix_store);

router.post('/vmix-host', controller.set_vmix_host);

module.exports = router;
