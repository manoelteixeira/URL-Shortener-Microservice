//test/server-test.js
const {assert} = require('chai');
const request = require('supertest');
const app = require('../server');
const config = require('../config');
const {
    dateSetUp,
    deleteFile
} = require('../utils/utils');



describe('/', () => {
    describe('api/shorturl/', () => {
        const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        describe('POST', () => {
            it('respond with shortened url', async () => {
                const response = await request(app)
                    .post('/api/shorturl/')
                    .type('json')
                    .send({
                        "url" : {
                            "originalURL": url
                        }
                    });
                    const date =  dateSetUp();
                    const shortUrl = response.body.shortendedURL;
                    assert.equal(response.status, 201, 'HTTP Status Code does not match');
                    assert.equal(response.body.originalURL, url, 'Original URL and URL received does not match.');
                    assert.equal(response.body.creationDate, date, 'Creation Date does not match');
                    assert.include(shortUrl, config.hostname, 'Shortened URL malformed');
            });
        });
    });
});