const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const pendingReportsControllers = require('../controllers/pendingReports-controllers');

//router.use(checkAuth); // Auth Middleware

router.get('/', pendingReportsControllers.getPendingReports);

router.get('/list', pendingReportsControllers.getPendingReportsList);

router.get('/one', pendingReportsControllers.getPendingReportsFindOne);

router.get('/many', pendingReportsControllers.getManyPendingReports);

router.get('/:rid', pendingReportsControllers.getPendingReportById);

router.get('/user/:uid', pendingReportsControllers.getPendingReportsByUserId);




router.post('/',
   
    pendingReportsControllers.createPendingReport
)


router.put('/:rid',
  
pendingReportsControllers.updatePendingReportById);


router.delete('/:rid', pendingReportsControllers.deletePendingReport);

module.exports = router;