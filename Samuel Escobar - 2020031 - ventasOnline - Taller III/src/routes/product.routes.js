'use strict'

const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();
const productController = require('../controllers/product.controller');

api.get('/test', [mdAuth.ensureAuth,mdAuth.isAdmin], productController.test);
api.post('/saveProduct', [mdAuth.ensureAuth,mdAuth.isAdmin], productController.saveProduct);
api.put('/updateProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.updateProduct);
api.delete('/deleteProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.deleteProduct);
api.get('/getProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.getProduct);
api.get('/getProducts', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.getProducts);
api.get('/getProductsSoldOut', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.productsSoldOut);
api.get('/getProductsMostSold', mdAuth.ensureAuth, productController.productsmostsold);
api.post('/searchProductByName', mdAuth.ensureAuth, productController.searchProductByName);
api.post('/searchProductByCategory/:id', mdAuth.ensureAuth, productController.searchProductByCategory);

module.exports = api;