'use strict'

const billController = require('../controllers/bill.controller');
const express = require('express');
const mdAuth = require('../services/authenticated');
const api = express.Router();

api.get('/saveBill', mdAuth.ensureAuth, billController.saveBill);
api.get('/seeMyBills', mdAuth.ensureAuth, billController.seeMyBills);
api.get('/SeeBillsByUser/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], billController.SeeBillsByUser);
api.get('/SeeBill/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], billController.SeeBill);

module.exports = api;