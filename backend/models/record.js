const mongoose = require('mongoose');


const recordSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        min: 3
    },
    description: {
        type: String
    },
    tag_id: {
        type: String,
        required: false
    },
    user_id :{
        type: String,
        ref:'User'
    },
    medias: []
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Record', recordSchema)