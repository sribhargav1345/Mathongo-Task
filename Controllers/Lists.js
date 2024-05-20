const express = require('express');
const router = express.Router();


// Creating a list is successfull

const List = require('../models/List');

router.post('/lists', async (req, res) => {
    try{
        const { title, customProperties } = req.body;

        const list = new List({ title, customProperties });

        await list.save();
        
        res.status(201).json(list);
    }
    catch(err){
        res.status(400).json({ message: err.message })
    }
});

module.exports = router;
