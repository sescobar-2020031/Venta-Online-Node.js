'use strict'

const userController = require('../controllers/user.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/test', [mdAuth.ensureAuth,mdAuth.isAdmin] ,userController.test);
api.post('/register', userController.register);
api.post('/RegisterForAdmins', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.registerForAdmins);
api.post('/login', userController.login);
api.put('/update/:id', mdAuth.ensureAuth , userController.update);
api.delete('/delete/:id', mdAuth.ensureAuth , userController.delete);

module.exports = api;
