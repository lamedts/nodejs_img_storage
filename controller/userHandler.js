/* jshint node: true */

'use strict';

var CONST      = require('../const');
var	mongoose   = require('mongoose');
var	userSchema = require('../models/userSchema');
var	user       = mongoose.model(CONST.user_db, userSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

user.remove({}).exec()
	.then(function(){
		var newItem = new user({userid: 'demo', password: ''});
		newItem.save().then(function(item){
			console.log("inital db");
		}, function(err) {
			return console.log(err);
		});
	});

module.exports = {
	getUser: function(userInfo, callback){
		user.find(userInfo).exec()
			.then(function(item){
				if(item.length === 1){
					callback(item[0]);
				}else{
					callback(false);
				}
			});
	},
	delUser: function(userid, callback){
		user.find(userid).exec()
			.then(function(item){
				if(item.length === 1){
					item[0].remove();
					callback(item[0]);
				}else{
					callback(false);
				}
			});
	},
	saveUser: function(userid, newJson, callback){
		var newItem = new user(newJson);
		user.find(userid).exec()
			.then(function(item){
				if(item.length === 0){
					newItem.save().then(function( item){
						return callback(item);
					}, function(err) {
					    return callback(false, "no requied field");
				  	});
				}else{
					return callback(false, "exists");
				}
			});
	},
	updateUser: function(userid, userInfo, callback){
		user.findOne(userid).exec()
			.then(function(item){
				if(userInfo.userid)
					item.userid = userInfo.userid;
				if(userInfo.password)
					item.password = userInfo.password;
				item.save().then(function( item){
					return callback(item);
				}, function(err) {
					return callback(false, "no requied field");
				});
			});
	}
};
