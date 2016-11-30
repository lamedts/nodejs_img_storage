/* jshint node: true */

'use strict';

var cfenv    = require('cfenv');
var	mongoose = require('mongoose');

const mongodbURL = 'mongodb://user:password@ds139327.mlab.com:39327/s381f';
const googleAPI  = 'AIzaSyB0x_kZswl9GZGHNhvIrBdDdhMjw9_P-YA';
const port       = 8099 || cfenv.getAppEnv().port
const appEnv     = cfenv.getAppEnv();
const rest_db    = 'cloudpj_restaurants';
const user_db    = 'cloudpj_users';

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
