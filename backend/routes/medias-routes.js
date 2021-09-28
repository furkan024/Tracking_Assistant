const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const mediasControllers = require('../controllers/medias-controllers');


//router.use(checkAuth); // Auth Middleware

router.get('/', mediasControllers.getMedias);

router.get('/many', mediasControllers.getManyMedias);

router.get('/:mid', mediasControllers.getMediaById);


/* Record check field
[
        check('name')
            .not()
            .isEmpty(),
        check('tag_id')
            .not()
            .isEmpty()

    ]
    , 
*/

router.post('/:uid',
    mediasControllers.createMedia
)

router.put('/:mid', mediasControllers.updateMediaById);

router.delete('/:mid', mediasControllers.deleteMedia);

module.exports = router;