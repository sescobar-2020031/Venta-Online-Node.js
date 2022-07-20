'use strict'

const { validateData, checkUpdate } = require("../utils/validate");
const Category = require('../models/category.model');
const Product = require('../models/product.model');

exports.test = (req, res) => {
    res.send({ message: 'The funtion test is running in category' });
}

exports.saveCategory = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name
        }
        const msg = validateData(data);
        if (!msg) {
            data.description = params.description;
            const categoryExist = await Category.findOne({ name: { $regex: data.name, $options: 'i' } }).lean();
            if (!categoryExist) {
                const category = new Category(data);
                await category.save();
                return res.send({ message: 'Category created successfully' });
            } return res.status(404).send({ message: 'Category already exists' });
        } return res.status(400).send(msg);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const params = req.body;
        const categoryId = req.params.id;
        const checkData = await checkUpdate(params);
        if (checkData === false) return res.status(400).send({ message: 'Missing Data' });
        {
            const defaultCategory = await Category.findOne({ name: { $regex: 'Default', $options: 'i' } });
            if (defaultCategory.id !== categoryId) {
                const updateCategory = await Category.findOneAndUpdate({ _id: categoryId }, params, { new: true }).lean();
                if (!updateCategory) return res.status(404).send({ message: 'Category not found' });
                return res.send({ message: 'Category updated', updateCategory });
            } return res.status(400).send({ message: 'The default category cannot be updated' });
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const defaultCategory = await Category.findOne({ name: { $regex: 'Default', $options: 'i' } });
        if (defaultCategory.id !== categoryId) {
            const deleteCategory = await Category.findOneAndDelete({_id: categoryId });
            if (!deleteCategory) return res.status(404).send({ message: 'Category not found or already deleted' });
            {
                const productDefault = await Product.updateMany({category: categoryId}, {category: defaultCategory.id}, {new:true});
                return res.send({ message: 'Category deleted', deleteCategory });
            }
        } return res.status(400).send({ message: 'The default category cannot be deleted' });
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.getCategory = async (req,res) => {
    try{
        const categoryId = req.params.id;
        const showCategory = await Category.findOne({_id: categoryId});
        if(!showCategory) return res.status(404).send({message:'Category not found'});
        return res.send(showCategory);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getCategorys = async (req,res) => {
    try{
        const categorys = await Category.find();
        if(categorys.length === 0) return res.status(404).send({message: 'Categorys not found'});
        return res.send({categorys});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchCategoryByName = async (req,res) =>{
    try{
        const params = req.body;
        if(params.name){
            const categoryExist = await Category.find({name: {$regex: params.name, $options: 'i'}});
            if(categoryExist.length === 0) return res.status(404).send({message: 'Category not found'});
            return res.send({categoryExist});
        }return res.status(400).send({message: 'The param name is required'});
    }catch(err){
        console.log(err);
        return err;
    }
}