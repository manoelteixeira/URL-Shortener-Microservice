const confg = require('./config');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');
const url = require('url');


/**************************************************************
 *   generateHash(): create a random string with 7 characters  *
 *   and check in the data base to see if its unique.          *
 *   FUTURE IMPROVEMENTS:                                      *
 *   - Reduce the number of database acess                     *
 *   - Remove the recursion                                    *
 *   _ Improve string generation algorithm                     *
 **************************************************************/
const generateHash = () => {
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

/*************************************************************
 *  assembleShortURL(<string>): receieve a hash string  and  *
 *  uses the hostname from the config.js file to assmble     *
 *  the shortened string                                     *
 ************************************************************/
const assembleShortURL = (hash) => {
    return confg.hostname + '/' + hash;
};


/*************************************************************
 *  dateSetUp(): return an object containing the creation    *
 *  date (current date) and the expirarion date (one month)  *
 *  FUTURE IMPROVEMENTS:                                     *
 *  - Fix the algorithm in order to set the expirarion date  *
 *    exacly one month from the creation date (Currently it  *
 *    only increment the month by 1).                        *
 ************************************************************/
const dateSetUp = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const creationDate = `${day}/${month > 12 ? 0 : month}/${year}`;
    const expirationDate = `${day}/${month + 1 > 12 ? month + 1 : 1}/${year}`;
    return {
        creationDate: creationDate,
        expirationDate: expirationDate
    };
};

/*************************************************************
 *  validateURL(<string>): recieve a URL string and perform  *
 *  a DNS Resolve to see if the URL given is a valid URL and *
 *  if it leads to and existing web site. It returns true    *
 *  if the URL is valid or False otherwise                   *
 ************************************************************/
const validateURL = (urlString) => {
    const givenURL = url.parse(urlString);
    //console.log(givenURL);
    if (givenURL.protocol && givenURL.hostname) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    generateHash: generateHash,
    assembleShortURL: assembleShortURL,
    dateSetUp: dateSetUp,
    validateURL: validateURL
};