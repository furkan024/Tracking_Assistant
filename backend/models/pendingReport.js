const mongoose = require('mongoose');


const pendingReportSchema = new mongoose.Schema({
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
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('PendingReport', pendingReportSchema)