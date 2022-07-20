'use strict'

const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    date: {type: Date, default: Date.now()},
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    products: [{
        product: {type: mongoose.Schema.ObjectId, ref: 'Product'},
        quantity: Number,
        subTotal: Number
    }],
    total: Number
});

module.exports = mongoose.model('Bill', billSchema);