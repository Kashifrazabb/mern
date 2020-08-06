import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const Auth = mongoose.model('auth');

export const signup = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(422).json({ message: 'Please input all fields', status: 'Unprocessable Entity' })
    Auth.findOne({ email })
        .then(selectedUser => {
            if (selectedUser) return res.status(422).json({ message: 'User already exists with the same email', status: 'Unprocessable Entity' })
            bcryptjs.hash(password, 10)
                .then(bcryptedPassword => {
                    Auth.create({ name, email, password: bcryptedPassword })
                        .then(() => res.send(`Hi ${name}, you have been successfully registered`))
                        .catch(err => res.send(`Error while saving : ${err}`))
                })
                .catch(err => res.send(`Error while hashing the password : ${err}`))
        })
        .catch(err => res.send(`Error while processing your information with database : ${err}`))
}

export const signin = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(422).json({ message: 'Please input all fields', status: 'Unprocessable Entity' })
    Auth.findOne({ email })
        .then(selectedUser => {
            if (!selectedUser) return res.status(422).json({ message: 'Invalid username or password', status: 'Unprocessable Entity' })
            bcryptjs.compare(password, selectedUser.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(422).json({ message: 'Invalid username or password', status: 'Unprocessable Entity' })
                    const token = jwt.sign({ _id: selectedUser._id }, process.env.JWTSECRET)
                    res.json({ token })
                })
                .catch(err => res.send(`Error while matching the password : ${err}`))
        })
        .catch(err => res.send(`Error while getting your information from database : ${err}`))
}

export const requireLogin = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: 'You must be logged in', status: 'Unauthorized' })
    const token = authorization.replace('Bearer ', '')
    jwt.verify(token, process.env.JWTSECRET, (err, payload) => {
        if (err) return res.status(401).json({ message: 'You must be logged in', status: 'Unauthorized' })
        const { _id } = payload;
        Auth.findById(_id)
            .then(selectedUser => {
                req.userData = selectedUser;
                next()
            })
    })
}