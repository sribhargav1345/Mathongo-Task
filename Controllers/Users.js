const express = require('express');
const router = express.Router();

const multer = require('multer');
const csv = require('csv-parser');

const fs = require('fs');
const mongoose = require('mongoose');

const User = require('../models/User');
const List = require('../models/List');

const upload = multer({ dest: 'uploads/' });

router.post('/users/upload/:listId', upload.single('file'), async (req, res) => {

    const { listId } = req.params;
    const filePath = req.file.path;

    if (!mongoose.Types.ObjectId.isValid(listId)) {

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Failed to delete uploaded file:', err);
            }
        });
        return res.status(400).json({ error: 'Invalid list ID' });
    }

    try {
        const list = await List.findById(listId);

        if (!list) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Failed to delete uploaded file:', err);
                }
            });
            return res.status(404).json({ error: 'List not found' });
        }

        const users = [];
        const errors = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    
                    const cleanedRow = {};
                    for (let key in row) {
                        const trimmedKey = key.trim();
                        cleanedRow[trimmedKey] = row[key];
                    }

                    console.log(cleanedRow);

                    const user = { name: cleanedRow.name, email: cleanedRow.email, customProperties: {} };

                    list.customProperties.forEach(prop => {
                        user.customProperties[prop.title] = cleanedRow[prop.title] || prop.fallback;
                    });
                    
                    // If there is some additional rows of users, I am going to store that
                    Object.keys(cleanedRow).forEach(key => {
                        if (key !== 'name' && key !== 'email' && !user.customProperties.hasOwnProperty(key)) {
                            user.customProperties[key] = cleanedRow[key];
                        }
                    });

                    users.push(user);
                })
                .on('end', resolve)
                .on('error', reject);
        });

        for (let user of users) {
            try {
                const existingUser = await User.findOne({ email: user.email });         // Checking to ensure no duplicated allowed here.
                if (existingUser) {
                    throw new Error('Email already exists');
                }
                await User.create(user);

            } catch (err) {
                console.log(user, err.message);
                errors.push({ user, error: err.message });
            }
        }

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Failed to delete uploaded file:', err);
            }
        });

        // The below is for debugging
        // for (let err of errors) {
        //     console.log(err);
        // }

        res.status(201).json({
            added: users.length - errors.length,
            errors: errors.length,
            total: await User.countDocuments()
        });

    } catch (err) {
        console.error('Error processing upload:', err);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Failed to delete uploaded file:', err);
            }
        });
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
