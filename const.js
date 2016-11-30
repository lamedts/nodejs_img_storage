/* jshint node: true */

'use strict';

var cfenv    = require('cfenv');
var	mongoose = require('mongoose');

const mongodbURL = '';
const googleAPI  = '';
const port       = 8099 || cfenv.getAppEnv().port
const appEnv     = cfenv.getAppEnv();
const rest_db    = '';
const user_db    = '';

mongoose.Promise = global.Promise;
mongoose.connect(mongodbURL);

module.exports = {
	mongodbURL,
	googleAPI,
	port,
	appEnv,
	rest_db,
	user_db
};
