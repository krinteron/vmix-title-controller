const { Router } = require('express');

const router = Router();
const controller = require('../controllers/titlesController');

router.get('/titles', controller.get_titles);

router.post('/titles', controller.post_titles);

module.exports = router;
