// database/database.js

const sqlite3 = require('sqlite3');
const databasePath = './database/database.sqlite';


const {
    checkFileExists
} = require('../utils/utils');

 

// This script will initialize a sqlite3 database and it will create a table to hold the url information

const setupDatabase = () => {
    
    const db = new sqlite3.Database(databasePath);
    db.serialize(() => {
        db.run('DROP TABLE IF EXISTS `url`;');
    
        db.run(
            'CREATE TABLE IF NOT EXISTS `url`(' +
            '`id` INTEGER NOT NULL, ' +
            '`base_url` TEXT NOT NULL, ' +
            '`hash` TEXT UNIQUE NOT NULL, ' +
            '`creation_date` TEXT NOT NULL, ' +
            'PRIMARY KEY(`id`) );');
    });
};


const  databaseSchema = [
    {"cid":0,"name":"id","type":"INTEGER","notnull":1,"dflt_value":null,"pk":1},
    {"cid":1,"name":"base_url","type":"TEXT","notnull":1,"dflt_value":null,"pk":0},
    {"cid":2,"name":"hash","type":"TEXT","notnull":1,"dflt_value":null,"pk":0},
    {"cid":3,"name":"creation_date","type":"TEXT","notnull":1,"dflt_value":null,"pk":0}
];

const checkDatabase = async () => {
    if(checkFileExists('./database/database.sqlite')){
        const db = new sqlite3.Database(databasePath);
        //Check if table url exists
        const query = "SELECT name FROM sqlite_master WHERE type='table' AND name='url';";
        db.get(query,(err, row) => {
            //Check if table url exists
            if(err){
                console.error(err);
            }else{
                if(row){
                    const query = "PRAGMA table_info('url');";
                    db.all(query, (err, data) => {
                        if(JSON.stringify(databaseSchema) !== JSON.stringify(data)){
                            setupDatabase();
                        }else{
                            console.log('Database OK.');
                        }
                    });
                }else{ 
                    // url table is not setup
                    setupDatabase();
                    
                }
            }
        });
    }else {
        //database file not found
       console.log('Setting up new database');
        setupDatabase();
    }
};



module.exports = {
    databaseSchema: databaseSchema,
    setupDatabase: setupDatabase,
    checkDatabase: checkDatabase
};

