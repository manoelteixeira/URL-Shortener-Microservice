const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

// This script will initialize a sqlite3 database and it will create a table to hold the url information

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS `url`;');

    db.run(
        'CREATE TABLE IF NOT EXISTS `url`(' +
        '`id` INTEGER NOT NULL, ' +
        '`base_url` TEXT NOT NULL, ' +
        '`hash` TEXT UNIQUE NOT NULL, ' +
        '`creation_date` TEXT NOT NULL, ' +
        '`expiration_date` TEXT NOT NULL, ' +
        'PRIMARY KEY(`id`) );');
});