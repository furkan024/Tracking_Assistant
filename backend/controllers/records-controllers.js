const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Record = require('../models/record');
const User = require('../models/user');
const fs = require('fs'); 




const getRecords = async (req, res, next) => {
    let query = req.query;
    let sort = JSON.parse(query.sort);
    let filter = JSON.parse(query.filter);
    let records;
    try {
        records = await Record.find(filter).sort([sort]);
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch records failed!', 500);
        return next(error);
    }
    const page = records.length / 10;
    let p = page <= 1 ? 1 : 2;
   
    res.setHeader('Content-Range', `records 0-${records.length}/${p}`)
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range')
    //res.setHeader('X-Total-Count', '319');
    //res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(records.map(record => record.toObject({ getters: true })));
}

const getManyRecords = async (req, res, next) => {
    let query = req.query;
    let filter = JSON.parse(query.filter);
    let records;
    try {
        records = await Record.find({_id: filter.id});
    } catch(err) {
        const error = new HttpError('Something went wrong, fetch records failed!', 500);
        return next(error);
    }

   
    
    res.status(200).json(records.map(record => record.toObject({ getters: true })));
}


const getRecordById = async (req, res, next) => {
    const recordId = req.params.rid;
    let record
    try {
        record = await Record.findById(recordId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a record!', 500);
        return next(error);
    }

    if (!record) {
        const error = new HttpError('Could not find a record for the provided id.', 404);
        return next(error);
    }
    res.json(record.toObject({ getters: true }));
}



const createRecord = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }

    const { name, description, tag_id, user_id, medias } = req.body;
    
        
    const createdRecord = new Record({
        name,
        description,
        medias,
        tag_id,
        user_id
    })

   
    try {
        await createdRecord.save();
    }
    catch (err) {
        console.log(err);
        const error = new HttpError('Creating record failed, please try again.', 500);
        return next(error);
    }
    
    
    res.status(201).json(createdRecord.toObject({ getters: true }));
}

const updateRecordById = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs, check your data', 422)
        );
    }

    const { name, description, tag_id, user_id, medias } = req.body;
    const recordId = req.params.rid;

    let record;
    try {
        record = await Record.findById(recordId);
    } catch (err) {
        const error = new HttpError('Fetching records failed, please try again', 500);
        return next(error);
    }

    record.name = name;
    record.description = description;
    record.tag_id = tag_id;
    record.user_id = user_id;
    record.medias = medias;

    try {
        await record.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not updated record!', 500);
        return next(error);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/video')
    res.status(200).json(record.toObject({ getters: true }));

}

const deleteRecord = async (req, res, next) => {
    const recordId = req.params.rid
    let record;
    try {
        record = await Record.findById(recordId).populate('creator');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find to delete record!', 500);
        return next(error);
    }

    if (!record) {
        const error = new HttpError(
            'Could not find a record for that id',
            404
        );
        return next(error);
    }


    try {
        await record.remove();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not deleted the record!',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted Record!' })

}


exports.getRecords = getRecords;
exports.getManyRecords = getManyRecords;
exports.getRecordById = getRecordById;
exports.createRecord = createRecord;
exports.updateRecordById = updateRecordById;
exports.deleteRecord = deleteRecord