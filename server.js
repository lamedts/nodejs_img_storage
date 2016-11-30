/* jshint node: true */
'use strict';

var express    = require('express');
var app        = express();
var session    = require('cookie-session');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

var	CONST     = require('./const');
var	apiRoute  = require('./controller/apiRoute');
var	dbHandler = require('./controller/dbHandler');
var	userRoute = require('./controller/userRoute');

var SECRETKEY1 = '3uglq*x*T*aokX4Q';
var SECRETKEY2 = 'L0@8YmL8M*gb_YRl';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname +  '/public'));
app.use(fileUpload());
app.set('trust proxy', 1);
app.use(session({
	name: 'session',
	keys: [SECRETKEY1,SECRETKEY2],
	maxAge: 15 * 60 * 1000
}));
app.use(function(req, res, next){
	console.log('Incoming request: %s from %s', req.path, req.ip);
	next();
});


app.use('/api' , apiRoute);
app.use('/user', userRoute);

app.get('/',function(req,res) {
	res.redirect('/user');
});

app.get('/list', isAuthenticated, function(req, res){
	var query = {};
    if(req.query){
        if(req.query.cuisine)
            query.cuisine = req.query.cuisine;
        if(req.query.borough)
            query.borough = req.query.borough;
        if(req.query.name)
            query.name = new RegExp(req.query.name, 'i');
    }
	dbHandler.getDocs(query, 'list', function(value, cuisine, borough){
		res.render("item_list", {
			restaurant: value,
			criteria: JSON.stringify(query),
			noDocs: value.length,
			user: req.session.userid,
            cuisine:cuisine,
            borough: borough
		});
	});
});

app.get('/item/create', isAuthenticated, function(req, res){
	res.render("item_create", {action: "Create", orgJson: null});
});

app.get('/resp', function(req, res){
	res.render("resp", req.session.resp);
});

app.get('/item/:id', isAuthenticated, function(req, res){
	dbHandler.getDoc(req.params.id, 'read', function(value){
		var imgSrc = "";
		if(value.img.data !== null){
			imgSrc = 'data:' + value.img.contentType + ';base64,';
			imgSrc += new Buffer(value.img.data,'base64');
		}
		req.session.rate = value.rating;
		res.render("item", {info: value, imgSrc: imgSrc});
	});
});

app.get('/item/:id/:name/rate', isAuthenticated, function(req, res){
	res.render("item_rate", {name: req.params.name});
});

app.post('/item/:id/:action', isAuthenticated, function(req, res){
	var passJson = {};
	var resJson = {};
	var found = false;
	if(req.params.action == 'rate'){
		req.session.rate.forEach(function(value){
			if(value.by == req.session.userid)
				found = true;
		});
		if(!found){
			passJson = req.body;
			passJson.by = req.session.userid;
		}else{
			resJson.status = false;
			resJson.words = "Can't do second rating";
			resJson.backUrl = '/item/' + req.params.id;
			req.session.resp = resJson;
			return res.redirect('/resp');
		}
	}else if(req.params.action == 'edit'){
		passJson = {
			address : {
		        zipcode: req.body.zipcode,
		        building: req.body.building,
		        coord: {
		            lat: req.body.lat,
					lon: req.body.lon
		        }
		    },
		    borough: req.body.borough,
		    cuisine: req.body.cuisine,
		    name: req.body.name,
		};
		if (!req.body.filename) {
			console.log("empty");
	        passJson.img = {};
	    }else if(req.files.imgFile.name && req.files.imgFile.name != req.body.oldname){
	    	console.log("change");
			if(req.files.imgFile.mimetype.indexOf('pdf') > -1){
				console.log(req.files.imgFile.mimetype);
			}else{
		    	passJson.img = {
			    	data: new Buffer(req.files.imgFile.data).toString('base64'),
			    	contentType: req.files.imgFile.mimetype,
			    	filename: req.files.imgFile.name
		    	};
			}
	    }else{
	    	console.log("noo change");
	    }

	}
	dbHandler.updateDoc(req.params.id, req.session.userid, passJson, req.params.action, function(value){
		var resJson = {};
		if(value === false){
			resJson.status = false;
			resJson.words = "Action Fail, click back to go back.<br>Maybe you are not the owner";
			resJson.backUrl = '/item/' + req.params.id;
		}else{
			resJson.status = true;
			resJson.words = "Action  Success, click back to item page";
			resJson.backUrl = '/item/' + req.params.id;
		}
		req.session.resp = resJson;
		res.redirect('/resp');
	});
});

app.get('/item/:id/delete', isAuthenticated, function(req, res){
	dbHandler.delDoc(req.params.id, req.session.userid, function(value){
		var resJson = {};
		if(value === false){
			resJson.status = false;
			resJson.words = "Fail to delete, click back to go back.<br>Maybe you are not the owner";
			resJson.backUrl = '/item/' + req.params.id;
		}else{
			resJson.status = true;
			resJson.words = "Success to delete, click back to list page";
			resJson.backUrl = '/list';
		}
		req.session.resp = resJson;
		res.redirect('/resp');
	});
});

app.get('/item/:id/edit', isAuthenticated, function(req, res){
	dbHandler.getDoc(req.params.id, 'edit', function(value){
		res.render("item_create", {action: "Edit", orgJson: value});
	});
});

function isAuthenticated(req, res, next) {
    if (req.session.authenticated)
        return next();
    res.redirect('/');
}

app.listen(CONST.appEnv.port || 8099, '0.0.0.0', function(){
	console.log("Serving at port: " + CONST.appEnv.port);
});
