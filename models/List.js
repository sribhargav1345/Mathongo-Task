const mongoose = require('mongoose');
const { Schema } = mongoose;

const ListSchema = new Schema({
    title: {
        type: String
    },
    customProperties: [{
        title: String,
        fallback: String
    }]
});

module.exports = mongoose.model('Lists', ListSchema);