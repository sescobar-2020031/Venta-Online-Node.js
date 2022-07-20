'use strict'

const User = require('../models/user.model');
const Product = require('../models/product.model');
const bcrypt = require('bcrypt-nodejs');
const res = require('express/lib/response');



exports.validateData = (data)=>{
    let keys = Object.keys(data),msg='';
    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '')continue;
        msg += `The param ${key} is required\n`;
    }
    return msg.trim();
}

exports.searchUser = (username)=>{
    try{
        let exist = User.findOne({username: username}).lean();
        return exist;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.encrypt = (password) =>{
     try{
        return bcrypt.hashSync(password);
     }catch(err){
         console.log(err);
         return err;
     }
}

exports.checkPassword = async(password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPermission = async(userId,sub)=>{
    try{
        if(userId!==sub)return false;
        return true;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async(user)=>{
    try{
        if(user.password || Object.entries(user).length === 0 || user.role) return false;
        return true;
    }catch(err){
        console.log(err);
        return err;
    }
}
