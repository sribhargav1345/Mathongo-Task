const express = require('express');
const router = express.Router();

const Unsubscribe = require('../models/Unsubscribe');

router.post('/unsubscibe/:listId', async (req, res) => {

    const { listId } = req.params;
    const { email } = req.body;

    const unsubscribe = new Unsubscribe({ listId, email });
    await unsubscribe.save();
    
    res.status(201).json({ message: 'Unsubscribed successfully' });
});

module.exports = router;
