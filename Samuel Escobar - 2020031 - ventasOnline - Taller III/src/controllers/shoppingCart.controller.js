'use strict'

const ShoppingCart = require('../models/shoppingCart.model');
const Product = require('../models/product.model');
const { validateData } = require('../utils/validate');

exports.testShoppingCart = (req, res)=>{
    return res.send({message: 'Function testCart is running'});
}

exports.saveShoppingCart = async(req, res)=>{
    try{
        const params = req.body;
        const userId = req.user.sub;
        const data = {
            product: params.product,
            quantity: params.quantity
        };
        const msg = validateData(data);
        if(!msg){
            const findProduct = await Product.findOne({_id: data.product});
            if(data.quantity > findProduct.stock) return res.send({message: 'The stock is insufficient for the requested quantity'});
            {
                const checkCart = await ShoppingCart.findOne({userId});
                if(!checkCart){
                    data.user = userId;
                    data.subTotal = (findProduct.price * data.quantity);
                    data.total = (data.subTotal);
                    const shoppingCart = new ShoppingCart(data);
                    await shoppingCart.save();
                    const shoppingCartId = await ShoppingCart.findOne({user: userId});
                    const pushCart = await ShoppingCart.findOneAndUpdate({_id: shoppingCartId._id}, 
                        {$push: {products: data}}, {new: true}).populate('products.product').lean();
                    return res.send({message: 'Product add to cart', pushCart});
                }else{
                    const shoppingCartId = await ShoppingCart.findOne({user: userId});
                    data.subTotal = (findProduct.price*data.quantity);
                    data.total = (data.subTotal + shoppingCartId.total);
                    const pushCart = await ShoppingCart.findOneAndUpdate({_id: shoppingCartId._id}, 
                        {$push: {products: data}, total: data.total}, {new: true}).populate('products.product').lean();
                    return res.send({message: 'Product add to cart', pushCart});
                }
            }
        }return res.status(400).send(msg);
    }catch (err) {
        console.log(err);
        return err;
    }
}

exports.seeMyShoppingCart = async(req, res)=>{
    try{
        const userId = req.user.sub;
        const cartPreview = await ShoppingCart.findOne({user: userId}).populate('products.product').lean();
        if(cartPreview === null) return res.status(400).send({message: 'Your cart is empty'});
        return res.send({cartPreview});
    }catch (err) {
        console.log(err);
        return err;
    }
}

exports.cleanShoppingCart = async(req, res)=>{
    try{
        const userId = req.user.sub;
        const cleanCart = await ShoppingCart.findOneAndRemove({user: userId}).lean();
        if(cleanCart === null) return res.status(400).send({message: 'Your cart is empty'});
        return res.send({message: 'The products on your cart has been removed'});
    }catch (err) {
        console.log(err);
        return err;
    }
}