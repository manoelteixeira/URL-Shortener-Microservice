// database/database.js

const sqlite3 = require('sqlite3');
const databasePath = './database/database.sqlite';


const {
    checkFileExists
} = require('../utils/utils');


// db.serialize(() => {
//     db.run('DROP TABLE IF EXISTS `url`;');
//     db.run(
//         'CREATE TABLE IF NOT EXISTS `url`(' +
//         '`id` INTEGER NOT NULL, ' +
//         '`base_url` TEXT NOT NULL, ' +
//         '`hash` TEXT UNIQUE NOT NULL, ' +
//         '`creation_date` TEXT NOT NULL, ' +
//         'PRIMARY KEY(`id`) );');
// });


const createTabe = (database) => {
    database.serialize(function(){
        database.run('DROP TABLE IF EXISTS `url`;');
        database.run(
            'CREATE TABLE IF NOT EXISTS `url`(' +
            '`id` INTEGER NOT NULL, ' +
            '`base_url` TEXT NOT NULL, ' +
            '`hash` TEXT UNIQUE NOT NULL, ' +
            '`creation_date` TEXT NOT NULL, ' +
            'PRIMARY KEY(`id`) );');
    });
};

const setupDatabase = () => {
    
    if(!checkFileExists(databasePath)){
        //Database file don't exist
        const db = new sqlite3.Database(databasePath,(err) => {
            if(err){
                console.log('OPS!! Something went wrong!');
                console.error(err);
            }
        });
        createTabe(db);
        db.close((err) => {
            if(err){
                console.log('OPS!! Something went wrong!');
                console.error(err);
            }
        });

    }else{
        //Database file exist
        
        const db = new sqlite3.Database(databasePath,(err) => {
            if(err){
                console.log('OPS!! Something went wrong!');
                console.error(err);
            }
        });

        const urlTableQuery = "SELECT name FROM sqlite_master WHERE type='table' AND name='url';";
        db.get(urlTableQuery, (err, data) => {
            if(err){
                console.error(err);
                //throw err;
            }else if(!data || data.name !== 'url'){
                createTabe(db);
            }
            db.close((err) => {
            if(err){
                console.log('OPS!! Something went wrong!');
                console.error(err);
            }
        });
        });
    }
};







module.exports = {
    createTabe: createTabe,
    setupDatabase: setupDatabase
};

