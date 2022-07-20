'use strict'
const mongoose = require("mongoose")

exports.init = ()=>{
    const uriMongo = "mongodb://127.0.0.1:27017/ventasOnline";
    mongoose.Promise = global.Promise;
    
    //Manejamos el ciclo de vida
    mongoose.connection.on('error', ()=>{
        console.log('MongoDB | could not connect to mongodb');
    });
    mongoose.connection.on('connecting', ()=>{
        console.log('MongoDB | try connecting');
    });
    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB | connected to mongodb');
    });
    mongoose.connection.once('open', ()=>{
        console.log('MongoDB | connected to database');
    });
    mongoose.connection.on('reconnected', ()=>{
        console.log('MongoDB | reconnected');
    });
    mongoose.connection.on('disconnected', ()=>{
        console.log('MongoDB | disconnect... Exiting...');
    });
    mongoose.connect(uriMongo, {
        useNewUrlParser: true,
        connectTimeoutMS: 2500,
        maxPoolSize: 50
    }).catch(err=> console.log(err));
}