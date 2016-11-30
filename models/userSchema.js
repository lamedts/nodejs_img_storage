/* jshint node: true */

var mongoose    = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;

module.exports = mongoose.Schema({
    userid : { type: String, required: true },
    password: String
});
