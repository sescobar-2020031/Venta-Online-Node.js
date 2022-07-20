'use strict'

const express = require('express');
const api = express.Router();
const catController = require('../controllers/category.controller');
const mdAuth = require('../services/authenticated');


api.get('/test', [mdAuth.ensureAuth, mdAuth.isAdmin],catController.test);
api.post('/saveCategory', [mdAuth.ensureAuth, mdAuth.isAdmin], catController.saveCategory);
api.put('/updateCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], catController.updateCategory);
api.delete('/deleteCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], catController.deleteCategory);
api.get('/getCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], catController.getCategory);
api.get('/getCategorys', mdAuth.ensureAuth, catController.getCategorys);
api.post('/searchCategoryByName', mdAuth.ensureAuth, catController.searchCategoryByName);


module.exports = api;