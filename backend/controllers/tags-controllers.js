const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Tag = require('../models/tag');



const getTags = async (req, res, next) => {
    let query = req.query;
    let filter = JSON.parse(query.filter);
    let sort = JSON.parse(query.sort);
    
    let tags;
    try {
        tags = await Tag.find(filter).sort([sort])
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch tags failed!', 500);
        return next(error);
    }

    const page = tags.length / 10;
    let p = page <= 1 ? 1 : 2;
   
    res.setHeader('Content-Range', `tags 0-${tags.length}/${p}`)
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range')
    res.status(200).json(tags.map(tag => tag.toObject({ getters: true })));
}

const getTagList = async ( req, res, next) => {
    let tags;
    try {
        tags = await Tag.find();
    } catch (err) {
        const error = new HttpError('Something went wrong, fetch tags failed!', 500);
        return next(error);
    }
    res.status(200).json(tags.map(tag => tag.toObject({ getters: true })));
}

const getManyTags = async (req, res, next) => {
    let query = req.query;
    let filter = JSON.parse(query.filter);
    let tags;
    try {
        tags = await Tag.find({_id: filter.id});
    } catch(err) {
        const error = new HttpError('Something wen wrong, fetch tags failed!', 500);
        return next(error);
    }

  
    res.status(200).json(tags.map(tag => tag.toObject({ getters: true })));
}

const getTagById = async (req, res, next) => {
    const tagId = req.params.tid;
    let tag
    try {
        tag = await Tag.findById(tagId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a tag!', 500);
        return next(error);
    }

    if (!tag) {
        const error = new HttpError('Could not find a tag for the provided id.', 404);
        return next(error);
    }
    res.json(tag.toObject({ getters: true }));
}

const createTag = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }

    const { name, description, user_id, participants } = req.body;

    const createdTag = new Tag({
        name,
        description,
        user_id,
        participants
    });

   

    try {
        await createdTag.save();
    }
    catch (err) {
        console.log(err);
        const error = new HttpError('Creating tag failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json(createdTag.toObject({ getters: true }));
}

const getTagsByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let tags;
    try {
        tags = await Tag.find({ user_id: userId });
    } catch (err) {
        const error = new HttpError('Fetching tags failed!, please try again', 500);
        return next(error);
    }


    if (!tags || tags.length === 0) {
        const error = new HttpError('Could not find a tags for the provided user id.', 404);
        return next(error);
    }

    res.json({ tags: tags.map(tag => tag.toObject({ getters: true })) });
}


const updateTagById = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs, check your data', 422)
        );
    }

    const { name, description, participants } = req.body;
    const tagId = req.params.tid;

    let tag;
    try {
        tag = await Tag.findById(tagId);
    } catch (err) {
        const error = new HttpError('Fetching tags failed, please try again', 500);
        return next(error);
    }
    
    tag.name = name;
    tag.description = description;
    tag.participants = participants;

    try {
        await tag.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not updated tag!', 500);
        return next(error);
    }

    res.status(200).json(tag.toObject({ getters: true }));

}

const deleteTag = async (req, res, next) => {
    const tagId = req.params.tid
    let tag;
    try {
        tag = await Tag.findById(tagId).populate('user_id');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find to delete tag!', 500);
        return next(error);
    }

    if (!tag) {
        const error = new HttpError(
            'Could not find a tag for that id',
            404
        );
        return next(error);
    }


    try {
        await tag.remove();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not deleted the tag!',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted Tag!' })

}

exports.getTags = getTags;
exports.getTagList = getTagList;
exports.getManyTags = getManyTags;
exports.getTagById = getTagById;
exports.createTag = createTag;
exports.getTagsByUserId = getTagsByUserId;
exports.updateTagById = updateTagById;
exports.deleteTag = deleteTag;