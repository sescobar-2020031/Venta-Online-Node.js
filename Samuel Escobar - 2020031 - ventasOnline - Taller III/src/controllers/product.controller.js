'use strict'
 
const {validateData, checkUpdate} = require('../utils/validate');
const Category = require('../models/category.model');
const Product = require('../models/product.model');

exports.test = (req,res) => {
    try{
        return res.send({message: 'The funtion test is running in product'});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.saveProduct = async (req,res) =>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            price: params.price,
            stock: params.stock,
            sales: 0,
            category: params.category
        }
        const msg = validateData(data);
        if(!msg){
            data.description = params.description;
            data.brand = params.brand;
            const categoryExist = await Category.findOne({_id: data.category}).lean();
            if(!categoryExist)return res.status(404).send({message: 'Category not found'});
            {
                const saveProduct = new Product(data);
                await saveProduct.save();
                return res.send({message:'Product created successfully', saveProduct})
            }
        }return res.status(400).send(msg)
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.updateProduct = async(req,res) =>{
    try{
        const productId = req.params.id;
        const params = req.body;
        const checkData = await checkUpdate(params);
        if(checkData===false) return res.status(400).send({message: 'Missing data'});
        {
            const updateProduct = await Product.findOneAndUpdate({_id: productId}, params, {new: true}).
                populate('category').lean();
            if(!updateProduct) return res.status(404).send({message:'Product not found'});
            return res.send({message: 'Update Product', updateProduct});
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteProduct = async(req,res) =>{
    try{
        const productId = req.params.id;
        const deleteProduct = await Product.findOneAndDelete({_id: productId});
        if(!deleteProduct) return res.status(404).send({message: 'Product not found or already deleted'});
        return res.send({message: 'Product deleted', deleteProduct})
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getProduct = async (req,res)=>{
    try{
        const productId = req.params.id;
        const showProduct = await Product.findOne({_id:productId}).populate('category').lean();
        if(!showProduct) return res.status(404).send({message: 'Product not found'});
        return res.send({showProduct})
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getProducts = async (req,res)=>{
    try{
        const showProducts = await Product.find().populate('category').lean();
        if(showProducts.length === 0) return res.status(400).send({message: 'There are no products'});
        return res.send({showProducts})
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.productsSoldOut = async (req,res) => {
    try{
        const productsSoldOut = await Product.find({stock: 0}).populate('category').lean();
        if(productsSoldOut.length === 0) return res.status(400).send({message: 'There are no expired products'});
        return res.send({productsSoldOut})
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.productsmostsold  = async (req,res) => {
    try{
        const productsmostsold = await Product.find().sort({sales: -1}).populate('category').lean();
        const productssold = [];
        for(let productmostsold of productsmostsold){
            if(productmostsold.sales !== 0){
                productssold.push(productmostsold);
            }
        }
        if(productssold.length === 0) return res.status(400).send({message: 'There are no products sold'});
        return res.send({productssold});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchProductByName = async (req,res) => {
    try{
        const params = req.body;
        if(params.name){
            const searchProduct = await Product.find({name:{$regex: params.name, $options: 'i'}})
                .populate('category').lean();
            if(searchProduct.length === 0) return res.status(404).send({message: 'Product not found'});
            return res.send(searchProduct);
        }return res.status(400).send({message:'The param name is required'})
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchProductByCategory = async (req,res)=>{
    try{
        const categoryId = req.params.id;
            const searchProducts = await Product.find({category: categoryId}).populate('category').lean();
            if(searchProducts.length === 0) return res.status(404).send({message: 'Products not found'});
            return res.send(searchProducts);
    }catch(err){
        console.log(err);
        return err;
    }
}