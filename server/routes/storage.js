const { Router } = require('express');

const router = Router();
const controller = require('../controllers/storageController');

router.get('/storage/programs', controller.get_programs);

router.get('/storage/programs/:id', controller.get_programs);

router.post('/storage/programs', controller.post_programs);

// ___________________________________________

router.get('/storage/components', controller.get_components);

router.get('/storage/components/:id', controller.get_components);

router.post('/storage/components', controller.post_components);

// ___________________________________________

router.get('/storage/columns', controller.get_columns);

router.get('/storage/columns/:id', controller.get_columns);

router.post('/storage/columns', controller.post_columns);

// ___________________________________________

module.exports = router;
