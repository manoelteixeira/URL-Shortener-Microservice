// test/database-test.js
const sqlite3 = require('sqlite3');
const {assert} = require('chai');

const {
    checkDatabase,
    databaseSchema
} = require('../database/database');

const {
    checkFileExists,
    deleteFile
} = require('../utils/utils')


describe('Database : ', () => {
    describe('database.sqlite file setup: ', () => {
        const db = new sqlite3.Database('./database/database.sqlite');
        
        it('Setup a new database.sqlite if file is not found', () =>{
            assert.ok(checkFileExists('./database/database.sqlite'));
        });
        
        it("database.sqlite have table 'url'", () => {
            const query = "SELECT name FROM sqlite_master WHERE type='table' AND name='url';";
            db.get(query, (err, row) => {
                if(err){
                    console.error(err);
                }
                assert.equal(row.name, 'url');
            });
        });
        
        it("'url' table has the corret fields", () =>{
            const query = "PRAGMA table_info('url');";
            db.all(query, (err, rows) => {
                if(err){
                    console.error(err);
                }
                const expectedSchema = JSON.stringify(databaseSchema);
                acctualSchema = JSON.stringify(rows);
                assert.equal(acctualSchema, expectedSchema);
            });
        });
    });
});