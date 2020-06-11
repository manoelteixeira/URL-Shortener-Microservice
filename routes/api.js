// routes/api.js

const express = require('express');
const apiRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database/database.sqlite');

const {
    validateURL,
    assembleDatabaseEntry,
    assembleShortURL
} = require('../utils/utils');

apiRouter.param('hash', (req, res, next, hash) => {
    db.get(`SELECT * FROM url WHERE url.hash = '${hash}';`, (error, url) => {
        if (error) {
            next(error);
        } else if (url) {
            req.url = url;
            next();
        } else {
            res.sendStatus(404);
        }
        //console.log(url);
    });
});

// REDIRECT To the original URL
apiRouter.get('/:hash', (req, res, next) => {
    const baseURL = req.url.base_url;
    res.redirect(301, baseURL);
});


// POST - Create a new short url
apiRouter.post('/api/shorturl/', (req, res, next) => {
    const originalURL = req.body.url.originalURL;
    
    if (validateURL(originalURL)) {
        const query = 'INSERT INTO `url`(base_url, hash, creation_date) ' +
            'VALUES($baseURL, $hash, $creationDate);';
        
        const databaseEntry = assembleDatabaseEntry(originalURL);
        //console.log(databaseEntry);
        
        const queryValues = {
            $baseURL: databaseEntry.baseURL,
            $hash: databaseEntry.hash,
            $creationDate: databaseEntry.creationDate
        };
        db.run(query, queryValues, function (error) {
            if (error) {
                console.error(error);
                next(error);
            } else {
                db.get(`SELECT * FROM url WHERE url.id = '${this.lastID}'`, (error, url) => {
                    if (error) {
                        next(error);
                        console.error(error);
                    } else {
                        const shortURL = assembleShortURL(url.hash);
                        res.status(201).json({
                            originalURL: url.base_url,
                            hash: url.hash,
                            shortendedURL: shortURL,
                            creationDate: url.creation_date
                        });
                    }
                });
            }
        });

    } else {
        res.sendStatus(400);
    }
});


apiRouter.get('/api/shorturl/:hash', (req, res, next) => {
    res.status(200).json({
        'originalURL': req.url.base_url,
        'creationDate': req.url.creation_date,
    });
});


module.exports = apiRouter;