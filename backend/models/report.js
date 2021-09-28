const mongoose = require('mongoose');


const reportSchema = new mongoose.Schema({
    identification: {
        type: Boolean,
        required: false
    },
    tag_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    media_id: {
        type: String,
        required: true
    },
    careless: {
        type: String,
        required: true 
    },
    attentive: {
        type: String,
        required: true 
    },
    no_face: {
        type: String,
        required: true
    },
    lecture_date: {
        type: String,
        required: true
    },
    tagName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    results: []

},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Report', reportSchema)