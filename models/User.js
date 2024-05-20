const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    customProperties: {
        type: Map, 
        required: true
    }
});

module.exports = mongoose.model('Users', UserSchema);