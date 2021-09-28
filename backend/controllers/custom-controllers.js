const PythonShell = require('python-shell').PythonShell;
const HttpError = require('../models/http-error');
const Report = require('../models/report');
const User = require('../models/user');

let options = {
    
    scriptPath: `${__dirname}/../FaceTracker/`
  };

const getReportScript = async (req, res, next) => {
    PythonShell.run('main.py', options, function (err) {
        if (err) throw err;
        res.send('finished');
      }); 
}


const getTotalLessonReport = async (req, res, next) => {
    const lessonId = req.params.lid;
    console.log(lessonId)
    
    let reports;
    try {
        reports = await Report.find({tag_id: lessonId})
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch reports failed!', 500);
        return next(error);
    }
    
    const reportLength = reports.length;
    const attentiveValue = reports.map(i => parseFloat(i.attentive));
    const carelessValue = reports.map(i => parseFloat(i.careless));
    const noFaceValue = reports.map(i => parseFloat(i.no_face));


    const totalAttentive = attentiveValue.reduce((a, b) => a + b, 0);
    const totalCareless = carelessValue.reduce((a, b) => a + b, 0);
    const totalNoFace = noFaceValue.reduce((a, b) => a + b, 0);

    const attentive = totalAttentive/reportLength;
    const careless = totalCareless/reportLength;
    const noFace = totalNoFace/reportLength;

    console.log(attentive + careless + noFace)

    const totalLessonReport = {attentive: attentive, careless: careless, no_face: noFace}
   
   
    res.status(200).json(totalLessonReport);
}

const getLectureDate = async (req, res, next) => {
  const lessonId = req.params.lid;
  console.log(lessonId)
  
  let reports;
  try {
      reports = await Report.find({tag_id: lessonId})
  } catch (err) {
      const error = new HttpError('Something went wrong, fetch reports failed!', 500);
      return next(error);
  }
  
  const lectureDateList = reports.map(i => i.lecture_date);
 
  
  res.status(200).json(lectureDateList);
}

const getUser = async (req, res, next) => {
  const lessonId = req.params.lid.split('+')[0];
  const lectureDate = req.params.lid.split('+')[1];
  console.log(lessonId)
  
  let reports;
  try {
      reports = await Report.find({tag_id: lessonId, lecture_date: lectureDate})
  } catch (err) {
      const error = new HttpError('Something went wrong, fetch reports failed!', 500);
      return next(error);
  }
  
  const userList = reports.map(i => i.user_id);
 
  let users;
    try {
        users = await User.find({_id: userList});
    } catch(err) {
        const error = new HttpError('Something wen wrong, fetch users failed!', 500);
        return next(error);
  }

  

  res.status(200).json(users.map(user => user.toObject({ getters: true })));
}


const getReport = async (req, res, next) => {
  const lessonId = req.params.lid.split('+')[0];
  const lectureDate = req.params.lid.split('+')[1];
  const userId = req.params.lid.split('+')[2];
  console.log('lessonIdasdasdas',lessonId, lectureDate, userId)
  
  let report;
  try {
      report = await Report.findOne({tag_id: lessonId, lecture_date: lectureDate, user_id: userId})
  } catch (err) {
      const error = new HttpError('Something went wrong, fetch reports failed!', 500);
      return next(error);
  }

  console.log('report',report)
  

  res.status(200).json(report);
}

exports.getReportScript = getReportScript;
exports.getTotalLessonReport = getTotalLessonReport;
exports.getLectureDate = getLectureDate;
exports.getUser = getUser;
exports.getReport = getReport;