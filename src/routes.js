const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const CodenationController = require('../src/controllers/CodenationController');

const routes = express.Router();

routes.post('/proces', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        token: Joi.string().required().length(40),
    })
}), CodenationController.proces);

module.exports = routes;