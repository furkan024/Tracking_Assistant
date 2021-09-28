const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Report = require('../models/report');
const PendingReport = require('../models/pendingReport');
const Media = require('../models/media');
const Tag = require('../models/tag');
const User = require('../models/user');
const downloadFile = require('download-file');
const { deletePendingReport } = require('./pendingReports-controllers');


const getReports = async (req, res, next) => {
    let query = req.query;
    let sort = JSON.parse(query.sort);
    let filter = JSON.parse(query.filter);
    let reports;
    try {
        reports = await Report.find(filter).sort([sort]);
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch reports failed!', 500);
        return next(error);
    }

    const page = reports.length / 10;
    let p = page <= 1 ? 1 : 2;

    res.setHeader('Content-Range', `reports 0-${reports.length}/${p}`)
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range')
    res.status(200).json(reports.map(report => report.toObject({ getters: true })));
}

const getManyReports = async (req, res, next) => {
    let query = req.query;
    let filter = JSON.parse(query.filter);

    let reports;
    try {
        reports = await Report.find({ _id: filter.id });
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch reports failed!', 500);
        return next(error);
    }

    res.status(200).json(reports.map(report => report.toObject({ getters: true })));
}

const getReportById = async (req, res, next) => {
    const reportId = req.params.rid;
    let report
    try {
        report = await Report.findById(reportId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a report!', 500);
        return next(error);
    }

    if (!report) {
        const error = new HttpError('Could not find a report for the provided id.', 404);
        return next(error);
    }
    res.json(report.toObject({ getters: true }));
}

const createReport = async (req, res, next) => {

    const {tag_id, user_id,  media_id, identification, attentive, careless, no_face, lecture_date, results} = req.body;

    let tag;
    let user;
    try {
        tag = await Tag.findById(tag_id);
        user = await User.findById(user_id);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a tag!', 500);
        return next(error);
    }

    if (!tag) {
        const error = new HttpError('Could not find a tag for the provided id.', 404);
        return next(error);
    }



    const createdReport = new Report({
        tag_id,
        user_id,
        media_id,
        identification,
        attentive,
        careless,
        no_face,
        lecture_date,
        tagName: tag.name,
        userName: user.name,
        results
    });
    
    
    
    try {
        await createdReport.save();
    }
    catch (err) {
        console.log(err);
        const error = new HttpError('Creating report failed, please try again.', 500);
        return next(error);
    }

  
    // Delete pending report after report created

    let pendingReport;
    try {
        pendingReport = await PendingReport.findOne({media_id: media_id})
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

    res.status(201).json(createdReport.toObject({ getters: true }));

}

const getReportsByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let reports;
    try {
        reports = await Report.find({ user_id: userId });
    } catch (err) {
        const error = new HttpError('Fetching reports failed!, please try again', 500);
        return next(error);
    }


    if (!reports || reports.length === 0) {
        const error = new HttpError('Could not find a reports for the provided user id.', 404);
        return next(error);
    }

    res.json({ reports: reports.map(report => report.toObject({ getters: true })) });
}


const updateReportById = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs, check your data', 422)
        );
    }

    const { attendance, record_id, user_id, cheater, careless, attentive } = req.body;
    const reportId = req.params.rid;

    let report;
    try {
        report = await Report.findById(reportId);
    } catch (err) {
        const error = new HttpError('Fetching reports failed, please try again', 500);
        return next(error);
    }

    report.record_id = record_id

    try {
        await report.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not updated report!', 500);
        return next(error);
    }

    res.status(200).json(report.toObject({ getters: true }));

}

const deleteReport = async (req, res, next) => {
    const reportId = req.params.rid
    let report;
    try {
        report = await Report.findById(reportId).populate('user_id');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find to delete report!', 500);
        return next(error);
    }

    if (!report) {
        const error = new HttpError(
            'Could not find a report for that id',
            404
        );
        return next(error);
    }


    try {
        await report.remove();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not deleted the report!',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted report!' })

}




exports.getReports = getReports;
exports.getManyReports = getManyReports;
exports.getReportById = getReportById;
exports.createReport = createReport;
exports.getReportsByUserId = getReportsByUserId;
exports.updateReportById = updateReportById;
exports.deleteReport = deleteReport;