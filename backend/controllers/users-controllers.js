const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const getUsers = async (req, res, next) => {
    let query = req.query;
    let filter = JSON.parse(query.filter);
    let sort = JSON.parse(query.sort);
    

    let users;
    try {
        users = await User.find(filter, '-password').sort([sort]); // find users without passwords;
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch users failed!', 500);
        return next(error);
    }

    const page = users.length / 10;
    let p = page <= 1 ? 1 : 2;
   
    res.setHeader('Content-Range', `users 0-${users.length}/${p}`)
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range')
    res.json(users.map(user => user.toObject({ getters: true })));
}

const getManyUsers = async (req, res, next) => {
    let query = req.query;
    let filter = JSON.parse(query.filter);
    
    let users;
    try {
        users = await User.find({_id: filter.id});
    } catch(err) {
        const error = new HttpError('Something wen wrong, fetch users failed!', 500);
        return next(error);
    }
    
    res.status(200).json(users.map(user => user.toObject({ getters: true })));
}

const getUserById = async (req, res, next) => {
    const userId = req.params.uid;
    let user
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a user!', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find a user for the provided id.', 404);
        return next(error);
    }
    res.json(user.toObject({ getters: true }));
}

const updateUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    }

    const {name, email, password, pictures, role } = req.body;

    const userId = req.params.uid;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError('Fetching user failed, please try again', 500);
        return next(error);
    }

    user.name = name;
    user.email = email;
    user.password = password;
    user.pictures = pictures;
    user.role = role;
    

    try {
        await user.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not updated user!', 500);
        return next(error);
    }

    res.status(201).json(user.toObject({ getters: true }));



}

const login = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs, check your data', 422);
    }

    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );

        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }

    let isValidPassword = false;

    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch(err){
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again. ',
             500
        )
        return next(error);
    }

    if(!isValidPassword){
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({
            userId: existingUser.id, 
            email: existingUser.email, 
            name: existingUser.name,
        }, 'supersecret_dont_share', {
            expiresIn: '4h'
        });
    } catch(err) {
        const error = new HttpError(
            'Logging in failed, please try again.',
            500
        );
        return next(error);
    }

    res.json({
        userId: existingUser.id, 
        email: existingUser.email, 
        name: existingUser.name, 
        pictures: existingUser.pictures, 
        token: token,
        role: existingUser.role
    });
}

const signup = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs, check your data', 422)
        );
    }

    const { name, email, password, pictures, role } = req.body;
    //const file = req.file;
   

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );

        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        );
        return next(error);
    }

    let hashedPassword;
    try{
    hashedPassword = await bcrypt.hash(password, 12);
    }catch(err){
        const error = new HttpError('Could not create user, try again.', 500);
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        pictures,
        role
    });

    try {
        await createdUser.save();
    }
    catch (err) {
        console.log(err);
        const error = new HttpError(
            'Creating user failed, please try again.',
            500
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({
            userId: createdUser.id, 
            email: createdUser.email, 
            name: createdUser.name
        }, 'supersecret_dont_share', {
            expiresIn: '4h'
        });
    } catch(err) {
        const error = new HttpError(
            'Creating user failed, please try again.',
            500
        );
        return next(error);
    }



    res.status(201).json({
        userId: createdUser.id, 
        email: createdUser.email, 
        name: createdUser.name, 
        pictures: createdUser.pictures, 
        role: createdUser.role 
    });
}

const deleteUser = async (req, res, next) => {
    const userId = req.params.uid
    let user;
    try {
        user = await User.findById(userId)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find to delete user!', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            'Could not find a user for that id',
            404
        );
        return next(error);
    }


    try {
        await user.remove();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not deleted the user!',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'User Deleted!' })

}

exports.getUsers = getUsers;
exports.getManyUsers = getManyUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.signup = signup;
exports.login = login;