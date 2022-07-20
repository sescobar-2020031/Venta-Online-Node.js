'use strict'

const jwt = require('jwt-simple');
const key = 'CualquierDato';

exports.ensureAuth = (req,res,next) => {
    if(!req.headers.authorization) return res.status(403).send({message: 'The request does not containt the authentication header'});
    try{
        let token = req.headers.authorization.replace(/['"]+/g,"");
        var payload = jwt.decode(token,key);
    }catch(err){
        console.log(err);
        return res.status(400).send({message: 'Token is not valid or expired'})
    }
    req.user = payload;
    next();
}

exports.isAdmin = async (req,res,next) => {
    try{
        if(req.user.role === 'ADMIN') return next();
        return res.status(401).send({message: 'User unauthorized'});
    }catch(err){
        console.log(err);
        return err;
    }
}