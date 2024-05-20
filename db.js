const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoDB = async () => {

    const USERNAME = process.env.DB_USERNAME;
    const PASSWORD = process.env.DB_PASSWORD;

    const mongoURL = `mongodb+srv://${USERNAME}:${PASSWORD}@mathongo.boqsaz3.mongodb.net/?retryWrites=true&w=majority&appName=Mathongo`;

    try {
        await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    }
    catch (error) {
      console.error('MongoDB connection error:', error);
    }
};

module.exports = mongoDB();