const mongoose = require('mongoose');
const { Schema } = mongoose;

const unsubscribeSchema = Schema({
    listId:{
        type: mongoose.Schema.Types.ObjectId
    },
    email: {
        type: String
    }
});

module.exports = mongoose.model('Unsubscribe', unsubscribeSchema);