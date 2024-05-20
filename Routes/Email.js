const express = require('express');
const router = express.Router();

const nodemailer = require('nodemailer');

const User = require('../models/User');
const List = require('../models/List');
const Unsubscribe = require('../models/Unsubscribe');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

router.post('/email/send/:listId', async (req, res) => {

    const { listId } = req.params;
    const { subject, body } = req.body;

    const list = await List.findById(listId);

    if (!list) {
        return res.status(404).json({ error: 'List not found' });
    }

    const users = await User.find();
    const unsubscribedEmails = await Unsubscribe.find({ listId }).select('email');

    const emails = users.filter(user => !unsubscribedEmails.includes(user.email))
        .map(user => {

            let emailBody = body;
            list.customProperties.forEach(prop => {
                emailBody = emailBody.replace(`[${prop.title}]`, user.customProperties[prop.title] || prop.fallback);
            });

            return {
                to: user.email,
                subject,
                text: emailBody
            };
        });

    for (let email of emails) {
        await transporter.sendMail(email);
    }

    res.status(200).json({ message: 'Emails sent successfully' });
});

module.exports = router;
