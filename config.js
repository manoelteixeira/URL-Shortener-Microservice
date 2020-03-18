/******************************************************************
 * This file is used do set the host name and port of the service *
 *****************************************************************/

module.exports = {
    hostname: `localhost:${process.env.PORT || 4001}`,
    PORT: process.env.PORT || 4001
};