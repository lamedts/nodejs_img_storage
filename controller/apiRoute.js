/* jshint node: true */
'use strict';

var express = require('express');
var router  = express.Router();

var packageInfo = require('../package.json');
var	dbHandler   = require('./dbHandler');

router.get('/', function(req, res){
	res.json(packageInfo);
});

router.post('/create', function(req, res){
	var resJson = {};
	var	newJson = {};
	if(req.body.from == 'form'){
		newJson = {
			address : {
		        zipcode  : req.body.zipcode,
		        building : req.body.building,
		        coord    : []
		    },
		    borough : req.body.borough,
		    cuisine : req.body.cuisine,
		    name    : req.body.name,
		    by      : req.session.id,
		    img     : {}
		};
		if(req.body.lat !== ''){
			newJson.address.coord = {
	            lat: req.body.lat,
				lon: req.body.lon
	        };
		}
		if (!req.files.imgFile.name) {
	        newJson.img = {
	        	data     : null,
		    	contentType : null,
		    	filename    : null
		    };
	    }else{
	    	newJson.img = {
		    	data: new Buffer(req.files.imgFile.data).toString('base64'),
		    	contentType: req.files.imgFile.mimetype,
		    	filename: req.files.imgFile.name
	    	};
	    }

		dbHandler.saveDoc(newJson, function(value){
			if(value === false){
				resJson.status  = false;
				resJson.words   = "Fail to create, click back to reinput";
				resJson.backUrl = '/item/create';
			}else{
				resJson.status  = true;
				resJson.words   = "Success to create, click back to the new item page.<br> The new Item id is: " + value;
				resJson._id     = value;
				resJson.backUrl = '/item/' + value;
			}
			req.session.resp = resJson;
			res.redirect('../resp');
		});
	}else{
		dbHandler.saveDoc(newJson, function(value){
			if(value === false){
				resJson.status = "failed";
			}else{
				resJson.status = "ok";
				resJson._id    = value;
			}
			res.json(resJson);
		});
	}
});

router.post('/test', function(req, res){
	var resJson = {};
	var	newJson = {};
	dbHandler.saveDoc(newJson, function(value){
		if(value === false){
			resJson.status = "failed";
		}else{
			resJson.status = "ok";
			resJson._id    = value;
		}
		res.json(resJson);
	});
});

router.get('/read', function(req, res){
	var resJson = {"read": "all"};
	dbHandler.getDocs({}, 'api', function(value){
		res.json(value);
	});
});

router.get('/read/*', function(req, res){

	var urlParams 		= req.params['0'].replace(/\/$/, '').split('/'),
		readQuery 		= {},
		resJson			= {},
		errorQueryJson	= {"Response": "Please make a correct query"};

	if( urlParams.length !== 0 && urlParams.length % 2 === 0){
		for (var i = 0; i < urlParams.length; i++){
			if(i % 2 === 0 && urlParams[i].match(/name|borough|cuisine/)){
				readQuery[urlParams[i]] = urlParams[++i].replace(/\+/, ' ');
				resJson = readQuery;
			}else{
				return res.json({});
			}
		}
	}else{
		return res.json({});
	}
	dbHandler.getDocs(resJson, 'api', function(value){
		res.json(value);
	});
});

module.exports = router;
