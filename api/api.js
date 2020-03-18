const express = require('express');
const apiRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

const {
    generateHash,
    assembleShortURL,
    dateSetUp,
    validateURL,
} = require('./../utils');

//Validate hash
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
        console.log(url);
    });
});

// REDIRECT To the original URL
apiRouter.get('/:hash', (req, res, next) => {
    const baseURL = req.url.base_url;
    res.redirect(baseURL);
});

// GET - Retrieve the original url 
apiRouter.get('/api/shorturl/:hash', (req, res, next) => {
    const url = {
        originalURL: req.url.base_url,
        creationDate: req.url.creation_date,
        expirationDate: req.url.expiration_date
    };

    res.status(200).json({
        url: url
    });
});


// POST - Create a new short url
apiRouter.post('/api/shorturl/', (req, res, next) => {
    const originalURL = req.body.url.originalURL;
    if (validateURL(originalURL)) {
        const query = 'INSERT INTO `url`(base_url, hash, creation_date, expiration_date) ' +
            'VALUES($baseURL, $hash, $creationDate, $expirationDate);';
        const date = dateSetUp();
        const queryValues = {
            $baseURL: originalURL,
            $hash: generateHash(),
            $creationDate: date.creationDate,
            $expirationDate: date.expirationDate
        };
        db.run(query, queryValues, function (error) {
            if (error) {
                next(error);
            } else {
                db.get(`SELECT * FROM url WHERE url.id = '${this.lastID}'`, (error, url) => {
                    if (error) {
                        next(error);
                    } else {
                        const shortURL = assembleShortURL(url.hash);
                        res.status(201).json({
                            shortendedURL: shortURL
                        });
                    }
                });
            }
        });

    } else {
        res.sendStatus(400);
    }
});

module.exports = apiRouter;