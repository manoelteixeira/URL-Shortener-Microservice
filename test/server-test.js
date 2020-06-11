//test/server-test.js
const {assert} = require('chai');
const request = require('supertest');
const app = require('../server');
const config = require('../config');
const {
    dateSetUp,
    checkFileExists
} = require('../utils/utils');


const sqlite3 = require('sqlite3');
const { response } = require('express');
const databasePath = './database/database.sqlite';

describe('Database:',() => {
    it('database.sqlite file exist', () =>{
        const dbfile = checkFileExists(databasePath);
        assert.ok(dbfile);
    });
    it('database has url table', () => {
        const db = new sqlite3.Database(databasePath, (err) => {
            if(err) throw(err);
        });
        const urlQuery = "SELECT name FROM sqlite_master WHERE type='table' AND name='url';";
        db.get(urlQuery, (err, data) => {
            if(err) throw(err);
            else {
                assert.equal(data.name, 'url');
            }
        });
        db.close((err) => {
            if(err) throw(err);
        });
    });
});

describe('URL Shortener Server:', async() => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        const date =  dateSetUp();
        const responsePOST = await request(app)
                    .post('/api/shorturl/')
                    .type('json')
                    .send({
                        "url" : {
                            "originalURL": url
                        }
                    });
    
    describe('/', () => {
        it('it redirects to the correct url', async () => {
            const hash = responsePOST.body.hash;
            const restponseRedirect = await request(app).get(`/${hash}`).send(); 
            assert.equal(restponseRedirect.status, 301, 'HTTP Status Code does not match');
            assert.include(restponseRedirect.text, url);
        });
    });

    describe('api/shorturl/', () => {
        //console.log(response.body);
        describe('POST', () => {
            it('it responds with shortened url', () => {
                
                const shortUrl = responsePOST.body.shortendedURL;
                assert.equal(responsePOST.status, 201, 'HTTP Status Code does not match');
                assert.equal(responsePOST.body.originalURL, url, 'Original URL and URL received does not match.');
                assert.equal(responsePOST.body.creationDate, date, 'Creation Date does not match');
                assert.include(shortUrl, config.hostname, 'Shortened URL malformed');
                assert.include(shortUrl, responsePOST.body.hash, 'Ganerated hash does not match with shortened url');
            });

            it('it stores data on the database',() => {
                const db = new sqlite3.Database(databasePath, (err) => {
                    if(err) throw(err);
                });
                const query = `SELECT * FROM 'url' WHERE url.base_url = '${url}';`;
                db.get(query, (err, data) => {
                    if(err) throw(err);
                    else{
                        assert.equal(data.base_url, url, 'Stored URL does not match');
                        assert.equal(data.creation_date, date, 'Stored date does not match');
                    }
                });
                db.close((err) => {
                    if(err) throw(err);
                });
            });
        });

        
        //console.log(getResponse.body);

        describe('GET', () => {
            it('it responds with original url ', async () => {
                const hash = responsePOST.body.hash;
                const responseGET = await request(app)
                                            .get(`/api/shorturl/${hash}`)
                                            .send();

                assert.equal(responseGET.status, 200, 'HTTP Status Code does not match');
                assert.equal(responseGET.body.originalURL, url, 'Original URL and URL received does not match.');
                assert.equal(responseGET.body.creationDate, date, 'Creation Date does not match'); 
            });
        });
    });


});