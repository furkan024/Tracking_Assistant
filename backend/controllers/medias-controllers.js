const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Media = require('../models/media');
const User = require('../models/user');
const fs = require('fs'); 



const getMedias = async (req, res, next) => {
    let query = req.query;
    let sort = JSON.parse(query.sort);
    let filter = JSON.parse(query.filter);
    
    let user;
    try {
        user = await User.findById(filter.user_id)
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch medias failed!', 500);
        return next(error);
    }
    

    let medias;
    try {
        medias = await Media.find(user.role === 'student' ? filter : {}).sort([sort]);
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch medias failed!', 500);
        return next(error);
    }
    const page = medias.length / 10;
    let p = page <= 1 ? 1 : 2;
   
    res.setHeader('Content-Range', `medias 0-${medias.length}/${p}`)
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range')
    //res.setHeader('X-Total-Count', '319');
    //res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(medias.map(media => media.toObject({ getters: true })));
}

const getManyMedias = async (req, res, next) => {
    let query = req.query;
    let filter = JSON.parse(query.filter);
    let medias;
    try {
        medias = await Media.find({_id: filter.id});
    } catch(err) {
        const error = new HttpError('Something went wrong, fetch medias failed!', 500);
        return next(error);
    }

   
    
    res.status(200).json(medias.map(media => media.toObject({ getters: true })));
}

const getMediaById = async (req, res, next) => {
    const mediaId = req.params.mid;
    let media
    try {
        media = await Media.findById(mediaId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a media!', 500);
        return next(error);
    }

    if (!media) {
        const error = new HttpError('Could not find a media for the provided id.', 404);
        return next(error);
    }
    res.json(media.toObject({ getters: true }));
}

const createMedia = async (req, res, next) => {
    const errors = validationResult(req);
    const userId = req.params.uid;

    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }

    
    const file = req.file;
    
    
        
    const createdMedia = new Media({
        name: file.originalname,
        encoding: file.encoding,
        type: file.mimetype,
        filename: file.filename,
        path: file.path,
        size: file.size,
        user_id: userId
    })

    
   
    try {
        await createdMedia.save();
    }
    catch (err) {
        console.log(err);
        const error = new HttpError('Creating media failed, please try again.', 500);
        return next(error);
    }
    
    
    res.status(201).json(createdMedia.toObject({ getters: true }));
}

const updateMediaById = async (req, res, next) => {
    const { tag_id, lecture_date} = req.body;
    const mediaId = req.params.mid;
    console.log('lecture_date',lecture_date)
    let media;
    try {
        media = await Media.findById(mediaId);
    } catch (err) {
        const error = new HttpError('Fetching media failed, please try again', 500);
        return next(error);
    }

    
    media.tag_id = tag_id;
    media.lecture_date = lecture_date;
    

    try {
        await media.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not updated media!', 500);
        return next(error);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/video')
    res.status(200).json(media.toObject({ getters: true }));

}

const deleteMedia = async (req, res, next) => {
    const mediaId = req.params.mid
    let media;
    try {
        media = await Media.findById(mediaId).populate('creator');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find to delete media!', 500);
        return next(error);
    }

    if (!media) {
        const error = new HttpError(
            'Could not find a media for that id',
            404
        );
        return next(error);
    }


    try {
        await media.remove();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not deleted the media!',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted media!' })

}


exports.getMedias = getMedias;
exports.getManyMedias = getManyMedias;
exports.getMediaById = getMediaById;
exports.createMedia = createMedia;
exports.updateMediaById = updateMediaById;
exports.deleteMedia = deleteMedia