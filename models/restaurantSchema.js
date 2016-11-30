/* jshint node: true */

var mongoose    = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;

module.exports = mongoose.Schema({
    address : {
        street: String,
        zipcode: String,
        building: String,
        coord: {
            lat: String,
            lon: String
        }
    },
    borough: String,
    cuisine: String,
    rating: [
        {
            date: { type: Date, default: Date.now },
            by: String,
            score: {
                type: Number,
                min: 1,
                max: 10
            }
        }
    ],
    name: { type: String, required: true },
    restaurant_id: String,
    by: String,
    created_at: { type: Date, default: Date.now },
    img:{
        data: Buffer,
        contentType: String,
        filename: String
    }
});

var userSchema = mongoose.Schema({
    userid : String,
    password: String
});
