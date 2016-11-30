/* jshint node: true */
'use strict';

var express = require('express');
var router  = express.Router();

var packageInfo = require('../package.json');
var	userHandler = require('./userHandler');
var users       = [
	{userid: 'demo', password: ''}
];

router.get('/', function(req, res){
	res.redirect('/user/login');
});

router.get('/login', function(req, res){
	if (req.session.authenticated)
		return res.redirect('/list');
	res.render('login');
});

router.post('/login',function(req,res) {
	userHandler.getUser({userid: req.body.userid, password: req.body.password}, function(value){
		if(value !== false){
			req.session.authenticated = true;
			req.session.userid = value.userid;
	        res.redirect('/list');
	    }else{
	        var resJson = {};
	        resJson.status = false;
	    	resJson.words = "Username or password is not correct";
	    	resJson.backUrl = '/';
	    	req.session.resp = resJson;
	        res.redirect('/resp');
	    }
	});
});

router.get('/logout',function(req,res) {
	req.session = null;
	res.redirect('/user/login');
});

router.get('/mgt/:action', function(req,res) {
	if(req.params.action == 'add'){
		res.render('usersMgt_create', {action: "Reg User", edit: false});
	}else if(req.params.action == 'edit'){
		res.render('usersMgt_create', {action: "Edit User Info", edit: true, userid: req.session.userid});
	}else if(req.params.action == 'del'){
		userHandler.delUser({userid: req.session.userid}, function(value){
			var resJson = {};
			if(value === false){
				resJson.status = false;
				resJson.words = "del failed";
				resJson.backUrl = '/user/login';
			}else{
				resJson.status = true;
				resJson.words = "del ok";
				resJson.backUrl = '/user/login';
			}
			req.session.userid = null;
	        req.session.authenticated = false;
			req.session.resp = resJson;
			res.redirect('/resp');
		});
    }
});

router.post('/mgt/:action', function(req,res) {

    var resJson = {};

	if(req.params.action == 'add'){
		userHandler.saveUser({userid: req.body.userid}, {userid: req.body.userid, password: req.body.password}, function(value, err_str){
			if(value === false){
				resJson.status = false;
	            resJson.words = err_str;
	            resJson.backUrl = '/';
			}else{
				resJson.status = true;
	            resJson.words = '"' + value.userid + "\" added to system";
	            resJson.backUrl = '/';
			}
			req.session.resp = resJson;
		    res.redirect('/resp');
		});
	}else if(req.params.action == 'edit'){
		var newInfo = {};
		if (req.session.userid != req.body.userid)
			newInfo.userid = req.body.userid;
		if (req.body.password !== null)
			newInfo.password = req.body.password;
		userHandler.updateUser({userid: req.session.userid}, newInfo, function(value, err_str){
			if(value === false){
				resJson.status = false;
				resJson.words = err_str;
				resJson.backUrl = '/';
			}else{
				resJson.status = true;
				resJson.words = "edit OK";
				resJson.backUrl = '/';
			}
			req.session.resp = resJson;
			res.redirect('/resp');
		});
	}

});

module.exports = router;
