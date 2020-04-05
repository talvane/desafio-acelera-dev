const express = require('express');
const CodenationController = require('../src/controllers/CodenationController');

const routes = express.Router();

routes.post('/proces', CodenationController.proces);

module.exports = routes;