const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const customControllers = require('../controllers/custom-controllers');


//router.use(checkAuth); // Auth Middleware

router.get('/', customControllers.getReportScript);

router.get('/:lid', customControllers.getTotalLessonReport);

router.get('/lectureDate/:lid', customControllers.getLectureDate);

router.get('/user/:lid', customControllers.getUser);

router.get('/report/:lid', customControllers.getReport);


module.exports = router;