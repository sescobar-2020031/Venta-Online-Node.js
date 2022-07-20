'use strict'

const { validateData, searchUser, encrypt, checkPassword, checkPermission, checkUpdate } = require('../utils/validate');
const jwt = require('../services/jwt');
const User = require('../models/user.model');
const Bill = require('../models/bill.model');

exports.test = (req, res) => {
    return res.send({ messague: 'The funtion test in User is running' });
}

exports.register = async (req, res) => {
    try {
        let params = req.body;
        let data = { //asigna los parametros obligatorios
            name: params.name,
            username: params.username,
            password: params.password,
            role: 'CLIENT',
        };
        const msg = validateData(data);
        if (!msg) {
            let userExist = await searchUser(params.username);
            if (!userExist) {
                data.surname = params.surname;
                data.email = params.email;
                data.phone = params.phone;
                data.password = await encrypt(params.password);
                let user = new User(data);
                await user.save();
                return res.send({ message: 'User created successfully' });
            } return res.status(400).send({ message: 'Username already in use, choose another username' });
        } return res.status(400).send(msg);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.registerForAdmins = async (req, res) => {
    try {
        let params = req.body;
        let data = { //asigna los parametros obligatorios
            name: params.name,
            username: params.username,
            password: params.password,
            role: params.role
        };
        const msg = validateData(data);
        if (!msg) {
            if (data.role === 'CLIENT' || data.role === 'ADMIN')
            {
                let userExist = await searchUser(params.username);
                if (!userExist) {
                    data.surname = params.surname;
                    data.email = params.email;
                    data.phone = params.phone;
                    data.password = await encrypt(params.password);
                    let user = new User(data);
                    await user.save();
                    return res.send({ message: 'User created successfully' });
                } return res.status(400).send({ message: 'Username already in use, choose another username' });
            }return res.status(400).send({ message: 'Unrecognized role' });
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.login = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            password: params.password,
            username: params.username
        }
        let msg = validateData(data);
        if (!msg) {
            let userExist = await searchUser(params.username);
            if (userExist && await checkPassword(params.password, userExist.password)) {
                const token = await jwt.createToken(userExist);
                const userBills = await Bill.find({user: userExist._id}).populate('products.product').lean();
                if(userBills.length === 0) return res.send({ token, message: 'Login Successfully and you have not created bills'});
                return res.send({ token, message: 'Login Successfully', userBills})
            } return res.status(400).send({ message: 'Username or password incorrect' })
        } return res.status(400).send(msg);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.update = async (req, res) => {
    try {
        const clientId = req.params.id;
        const params = req.body;
        const userId = req.user.sub;
        if (clientId !== userId) {
            const checkAdmin = await User.findOne({ _id: userId });
            if (!checkAdmin || checkAdmin.role !== 'ADMIN') return res.status(401).send({ message: 'Acction unauthorized you are not a ADMIN' });
            const checkUser = await User.findOne({ _id: clientId });
            if (!checkUser || checkUser.role !== 'CLIENT') return res.status(401).send({ message: 'Acction unauthorized can not update a ADMIN' });
            const updateClient = await User.findOneAndUpdate({ _id: clientId }, params, {new:true}).lean();
            if (!updateClient) return res.status(404).send({ message: 'User not found' });
            updateClient.password = undefined;
            updateClient.role = undefined;
            return res.send({ message: 'Client updated', updateClient});
        } else {
            const userUpdated = await User.findOneAndUpdate({ _id: userId }, params, {new: true}).lean();
            if (!userUpdated) return res.status(404).send({ message: 'User not found' });
            return res.send({message: 'Account updated', userUpdated});
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.delete = async (req, res) => {
    try {
        const clientId = req.params.id;
        const userId = req.user.sub;
        if (clientId !== userId) {
            const checkAdmin = await User.findOne({ _id: userId });
            if (!checkAdmin || checkAdmin.role !== 'ADMIN') return res.status(401).send({ message: 'Acction unauthorized you are not a ADMIN' });
            const checkUser = await User.findOne({ _id: clientId });
            if (!checkUser || checkUser.role !== 'CLIENT') return res.status(401).send({ message: 'Acction unauthorized can not deleted a ADMIN' });
            const deleteClient = await User.findOneAndDelete({ _id: clientId });
            if (!deleteClient) return res.status(404).send({ message: 'User not found' });
            deleteClient.password = undefined;
            deleteClient.role = undefined;
            return res.send({ deleteClient, message: 'Client deleted' });
        } else {
             const userDeleted = await User.findOneAndDelete({ _id: userId });
            if (!userDeleted) return res.status(400).send({ message: 'User not found or already deleted' });
            return res.send({ userDeleted, message: 'Account deleted' });
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

