const mongoose = require('mongoose');


const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3
    },
    description: {
        type: String,
    },
    user_id :{
        type: String,
        required: true
    },
    participants: []
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Tag', tagSchema)