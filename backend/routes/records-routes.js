const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const recordsControllers = require('../controllers/records-controllers');


//router.use(checkAuth); // Auth Middleware

router.get('/', recordsControllers.getRecords);

router.get('/many', recordsControllers.getManyRecords);

router.get('/:rid', recordsControllers.getRecordById);


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

router.post('/',
    recordsControllers.createRecord
)

router.put('/:rid',
    [
        check('name')
            .not()
            .isEmpty(),
        check('tag_id')
            .not()
            .isEmpty()
    ]
    , recordsControllers.updateRecordById);

router.delete('/:rid', recordsControllers.deleteRecord);

module.exports = router;