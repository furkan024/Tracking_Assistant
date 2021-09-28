const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    pictures: [
        {
            type: Object,
            required: true,
        }
    ],
    role: {
        type: String,
        required: true
    }
    
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

