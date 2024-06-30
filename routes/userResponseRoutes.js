const express = require('express');
const userController = require('../controllers/userController');
const fitSageController = require('../controllers/fitsageController');

const router = express.Router();

router.post('/submitUserResponse', userController.submitUserResponse);

router.post('/interactWithAi', fitSageController.FitSageInteractWithAi);

module.exports = router;
