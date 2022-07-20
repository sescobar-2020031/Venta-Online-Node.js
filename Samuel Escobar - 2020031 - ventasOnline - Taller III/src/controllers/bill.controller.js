'use strict'

const Bill = require('../models/bill.model');
const ShoppingCart = require('../models/shoppingCart.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const { checkUpdate } = require('../utils/validate');

exports.saveBill = async(req, res)=>{
    try{
        const userId = req.user.sub;
        const findCart = await ShoppingCart.findOne({user: userId}).populate('products.product').lean();
        if(findCart === null) return res.status(400).send({message: 'Your cart is empty'});
        {
            for(let cart of findCart.products){
                const productId = await Product.findOne({_id: cart.product._id}).lean(); 
                const quantity = cart.quantity;
                const data = {
                    stock: productId.stock,
                    sales: productId.sales 
                };
                data.stock = (productId.stock - quantity);
                data.sales = (productId.sales + quantity); 
                await Product.findOneAndUpdate({_id: cart.product._id}, data, {new: true}).lean();
            }
            const bill = new Bill(findCart);
            await bill.save();
            await ShoppingCart.findOneAndRemove({user: userId});
            return res.send({message: 'Bill created successfully', bill});
        }
    }catch (err) {
        console.log(err);
        return err;
    }
}

exports.seeMyBills = async(req,res)=>{
    try{
        const userId = req.user.sub;
        const viewBill = await Bill.find({user: userId}).populate('products.product').lean();
        if(viewBill.length === 0) return res.status(400).send({message: 'You have not created bills'});
        return res.send({viewBill});
    }catch (err) {
        console.log(err);
        return err;
    }
}

exports.SeeBillsByUser = async(req, res)=>{
    try{
        const userId = req.params.id;
        const SeeBillUser = await Bill.find({user: userId}).populate('products.product').lean();
        if(SeeBillUser.length === 0) return res.status(400).send({message: 'This user has no bills'});
        return res.send({SeeBillUser});
    }catch (err) {
        console.log(err);
        return err;
    }
}

exports.SeeBill = async(req, res)=>{
    try{
        const billId = req.params.id;
        const SeeBill = await Bill.find({_id: billId}).populate('products.product').lean();
        if(SeeBill.length === 0) return res.status(404).send({message: 'Bill not found'});
        return res.send({SeeBill});
    }catch (err) {
        console.log(err);
        return err;
    }
}
