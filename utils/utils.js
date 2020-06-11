// utils/utils.js
const fs = require('fs');
const sqlite3 = require('sqlite3');
const url = require('url');
const confg = require('../config');


const checkFileExists = (path) => {
    try{
        fs.accessSync(path, fs.constants.F_OK | fs.constants.W_OK);
        return true;
    }catch(err){
        return false;
    }
};

const deleteFile = (path) =>{
    if(checkFileExists(path)){
        console.log(`Deleting file: ${path}`);
        fs.unlinkSync(path);
    }else{
        console.log(`file: ${path} does not exist`);
    }
};


const generateHash = () => {
    const databasePath = './database/database.sqlite';
    const db = new sqlite3.Database(databasePath);

    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let hash = '';
    for (let i = 0; i < 7; i++) {
        let randomIndex = Math.floor(Math.random() * Math.floor(chars.length));
        hash += chars[randomIndex];
    }
    const query = `SELECT * FROM url WHERE url.hash = '${hash}';`;
    db.get(query, (error, url) => {
        if (error) {
            console.log(error);
        }
        if (url) {
            generateHash();
        }
    });
    return hash;
};


const assembleShortURL = (hash) => {
    return confg.hostname + '/' + hash;
};


const dateSetUp = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return  `${day}/${month > 12 ? 0 : month}/${year}`;    
};


const validateURL = (urlString) => {
    const givenURL = url.parse(urlString);
    //console.log(givenURL);
    if (givenURL.protocol && givenURL.hostname) {
        return true;
    } else {
        return false;
    }
};

const assembleDatabaseEntry = (originalURL) => {
    return {
        baseURL: originalURL,
        hash: generateHash(),
        creationDate: dateSetUp()
    };
};


module.exports = {
    checkFileExists: checkFileExists,
    deleteFile: deleteFile,
    generateHash: generateHash,
    assembleShortURL: assembleShortURL,
    dateSetUp: dateSetUp,
    validateURL: validateURL,
    assembleDatabaseEntry: assembleDatabaseEntry
};