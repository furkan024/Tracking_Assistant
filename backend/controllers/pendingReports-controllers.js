const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const PendingReport = require('../models/pendingReport');
const Media = require('../models/media');
const Tag = require('../models/tag');
const User = require('../models/user');
const downloadFile = require('download-file');


const getPendingReports = async (req, res, next) => {
    let query = req.query;
    let sort = JSON.parse(query.sort);
    let filter = JSON.parse(query.filter);
    let pendingReports;
    try {
        pendingReports = await PendingReport.find(filter).sort([sort]);
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch pendingReports failed!', 500);
        return next(error);
    }

    const page = pendingReports.length / 10;
    let p = page <= 1 ? 1 : 2;

    res.setHeader('Content-Range', `pendingReports 0-${pendingReports.length}/${p}`)
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range')
    res.status(200).json(pendingReports.map(report => report.toObject({ getters: true })));
}


const getPendingReportsList = async (req, res, next) => {
    let pendingReports;
    try {
        pendingReports = await PendingReport.find();
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch pendingReports failed!', 500);
        return next(error);
    }

   
    res.status(200).json(pendingReports.map(report => report.toObject({ getters: true })));
}

const getPendingReportsFindOne = async (req, res, next) => {
    let pendingReport;
    try {
        pendingReport = await PendingReport.findOne().sort({ createdAt: -1 })
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch pending report  failed!', 500);
        return next(error);
    }

   
    res.status(200).json(pendingReport.toObject({ getters: true }));
}

const getManyPendingReports = async (req, res, next) => {
    let query = req.query;
    let filter = JSON.parse(query.filter);

    let pendingReports;
    try {
        pendingReports = await PendingReport.find({ _id: filter.id });
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch pending Reports failed!', 500);
        return next(error);
    }

    res.status(200).json(pendingReports.map(report => report.toObject({ getters: true })));
}

const getPendingReportById = async (req, res, next) => {
    const pendingReportId = req.params.rid;
    let pendingReport
    try {
        pendingReport = await PendingReport.findById(pendingReportId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a pending report!', 500);
        return next(error);
    }

    if (!pendingReport) {
        const error = new HttpError('Could not find a pending report for the provided id.', 404);
        return next(error);
    }
    res.json(pendingReport.toObject({ getters: true }));
}

const createPendingReport = async (req, res, next) => {

    const {media_id} = req.body;

 
    let media;
    try {
        media = await Media.findById(media_id);

    }catch (err) {
        const error = new HttpError('Something went wrong, fetch  media failed!', 500);
        return next(error);
    }


    let tagId = media.tag_id;
 
    let tag;
    try {
        tag = await Tag.findById(tagId);
    }catch (err) {
        const error = new HttpError('Something went wrong, fetch  tag failed!', 500);
        return next(error);
    }


    //fetch user data
    let user;
    try {
        user = await User.findOne({_id: media.user_id});
    } catch (err) {
        const error = new HttpError(
            'Fetching user failed',
            500
        );

        return next(error);
    }

    console.log(user.name)

    const createdPendingReport = new PendingReport({
        tag_id: tag._id ,
        user_id: media.user_id,
        media_id: media._id,
        lecture_date: media.lecture_date,
        tagName: tag.name,
        userName: user.name
    });
    
    
    try {
        await createdPendingReport.save();
    }
    catch (err) {
        console.log(err);
        const error = new HttpError('Creating pending report failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json(createdPendingReport.toObject({ getters: true }));

}

const getPendingReportsByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let pendingReports;
    try {
        pendingReports = await PendingReport.find({ user_id: userId });
    } catch (err) {
        const error = new HttpError('Fetching pending reports failed!, please try again', 500);
        return next(error);
    }


    if (!pendingReports || pendingReports.length === 0) {
        const error = new HttpError('Could not find a pending reports for the provided user id.', 404);
        return next(error);
    }

    res.json({ pendingReports: pendingReports.map(report => report.toObject({ getters: true })) });
}


const updatePendingReportById = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs, check your data', 422)
        );
    }

    const { attendance, record_id, user_id, cheater, careless, attentive } = req.body;
    const pendingReportId = req.params.rid;

    let pendingReport;
    try {
        pendingReport = await PendingReport.findById(pendingReportId);
    } catch (err) {
        const error = new HttpError('Fetching pending report failed, please try again', 500);
        return next(error);
    }

    pendingReport.record_id = record_id

    try {
        await pendingReport.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not updated pending report!', 500);
        return next(error);
    }

    res.status(200).json(pendingReport.toObject({ getters: true }));

}

const deletePendingReport = async (req, res, next) => {
    const pendingReportId = req.params.rid
    let pendingReport;
    try {
        pendingReport = await PendingReport.findById(pendingReportId).populate('user_id');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find to delete pending report!', 500);
        return next(error);
    }

    if (!pendingReport) {
        const error = new HttpError(
            'Could not find a pending report for that id',
            404
        );
        return next(error);
    }


    try {
        await pendingReport.remove();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not deleted the pending report!',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted pending report!' })

}



exports.getPendingReports = getPendingReports;
exports.getPendingReportsList = getPendingReportsList;
exports.getManyPendingReports = getManyPendingReports;
exports.getPendingReportById = getPendingReportById;
exports.getPendingReportsFindOne = getPendingReportsFindOne;
exports.createPendingReport = createPendingReport;
exports.getPendingReportsByUserId = getPendingReportsByUserId;
exports.updatePendingReportById = updatePendingReportById;
exports.deletePendingReport = deletePendingReport;