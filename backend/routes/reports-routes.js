const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const reportsControllers = require('../controllers/reports-controllers');

//router.use(checkAuth); // Auth Middleware

router.get('/', reportsControllers.getReports);

router.get('/many', reportsControllers.getManyReports);

router.get('/:rid', reportsControllers.getReportById);

router.get('/user/:uid', reportsControllers.getReportsByUserId);


router.post('/',
   
    reportsControllers.createReport
)


router.put('/:rid',
  
reportsControllers.updateReportById);


router.delete('/:rid', reportsControllers.deleteReport);

module.exports = router;