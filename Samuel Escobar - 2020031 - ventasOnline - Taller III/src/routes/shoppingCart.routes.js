'use strict'

const ShopingCartController = require('../controllers/shoppingCart.controller');
const express = require('express');
const mdAuth = require('../services/authenticated');
const api = express.Router();

api.get('/testShoppingCart', mdAuth.ensureAuth, ShopingCartController.testShoppingCart);
api.post('/saveShoppingCart', mdAuth.ensureAuth, ShopingCartController.saveShoppingCart);
api.get('/seeMyShoppingCart', mdAuth.ensureAuth, ShopingCartController.seeMyShoppingCart);
api.get('/cleanShoppingCart', mdAuth.ensureAuth, ShopingCartController.cleanShoppingCart);

module.exports = api;