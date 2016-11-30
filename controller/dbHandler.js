/* jshint node: true */

'use strict';

var CONST            = require('../const');
var	mongoose         = require('mongoose');
var	restaurantSchema = require('../models/restaurantSchema');
var	restaurant       = mongoose.model(CONST.rest_db, restaurantSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = {
	getDocs: function(query, from, callback){
		var projection    = '';
        var borough = [];
        var cuisine = [];

		if(from == 'api')
			projection = '-img.data';
        else
			projection = {_id: 1, name: 1 };
        restaurant.find().distinct('borough').exec()
			.then(function(items){
				borough = items;
                restaurant.find().distinct('cuisine').exec()
                    .then(function(items2){
                        cuisine = items2;
                        restaurant.find(query).select(projection).exec()
                            .then(function(items3){
                                callback(items3, cuisine, borough);
                            });
                    });
			});


	},
	getDoc: function(id, action, callback){
		console.log(id)
		var projection = '';
		if(action == 'edit')
			projection = '-img.data';
		restaurant.findById(id).select(projection).exec()
			.then(function(item){
				console.log(item);
				callback(item);
			});
	},
	delDoc: function(id, user, callback){
		restaurant.findById(id).exec()
			.then(function(item){
				if(item.by == user){
					item.remove();
					callback(item);
				}else{
					callback(false);
				}
			});
	},
	saveDoc: function(newJson, callback){
		var newRest = new restaurant(newJson);
		console.log(newJson)
		newRest.save(function(err, item){
			if (err){
				console.log(err);
				return callback(false);
			}else{
				return callback(item.id);
			}
		});
	},
	updateDoc: function(id, user, newJson, action, callback){
		//console.log(id, newJson, action, user);
		restaurant.findById(id).exec()
			.then(function(item){
				if(action == 'rate'){
					item.rating.push(newJson);
					item.save();
				}else if(action == 'edit' && user == item.by){
					item.update({$set: newJson}, function(err, item){
						console.log(err);
					});
					item.save();
				}else{
					return callback(false);
				}
				return callback(item);
			});
	}
};
