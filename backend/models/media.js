const mongoose = require('mongoose');


const mediaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        min: 3
    },
    encoding: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    filename :{
        type: String,
        required: false
    },
    path: {
        type: String,
        required: false
    },
    size: {
        type: Number,
        required: false
    },
    tag_id: {
        type: String,
        required: false
    },
    lecture_date: {
        type: String,
        required: false
    },
    user_id: {
        type: String,
        required: false
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Media', mediaSchema)