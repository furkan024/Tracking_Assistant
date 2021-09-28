const express = require('express');
const HttpError = require('../models/http-error');
const router = express.Router();
const usersControllers = require('../controllers/users-controllers');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');


router.post('/login',
    [
        check('email')
            .normalizeEmail()
            .isEmail(),

        check('password')
            .isLength({ min: 5 })
    ]
    , usersControllers.login
);

//router.use(checkAuth); // Auth Middleware

router.post('/',
    
    [
        check('name')
            .not()
            .isEmpty(),

        check('email')
            .normalizeEmail()
            .isEmail(),

        check('password')
            .isLength({ min: 5 })
    ]
    , usersControllers.signup
);


router.get('/', usersControllers.getUsers);

router.get('/many', usersControllers.getManyUsers);

router.get('/:uid', usersControllers.getUserById);

router.put('/:uid',
    //fileUpload.array('pictures'),
    [
        check('name')
            .not()
            .isEmpty(),

        check('email')
            .normalizeEmail()
            .isEmail(),

        check('password')
            .isLength({ min: 5 })
    ],
    usersControllers.updateUser
);

router.delete('/:uid', usersControllers.deleteUser);


module.exports = router;