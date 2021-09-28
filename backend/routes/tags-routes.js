const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const tagsControllers = require('../controllers/tags-controllers');

//router.use(checkAuth); // Auth Middleware

router.get('/', tagsControllers.getTags);

router.get('/list', tagsControllers.getTagList);

router.get('/many', tagsControllers.getManyTags);

router.get('/:tid', tagsControllers.getTagById);

router.get('/user/:uid', tagsControllers.getTagsByUserId);


router.post('/',
    [
        check('name')
            .not()
            .isEmpty(),

    ]
    , tagsControllers.createTag
)


router.put('/:tid',
    [
        check('name')
            .not()
            .isEmpty()
    ], 
tagsControllers.updateTagById);


router.delete('/:tid', tagsControllers.deleteTag);

module.exports = router;