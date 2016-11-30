# Nodejs Image Storage
A nodejs application can store image and some data.
* materializecss
* ejs
* mongodb

# How To Run
```bash
$ npm start
# OR using pm2
$ npm install pm2 -g
$ pm2 start {{startup script}} --name="{{appname}}" --watch
# OR using nodemon
$ npm install nodemon -g
$ nodemon
```

# Upload to Cloud
#### For Bluemix
Make sure you have [CloudFoundry Cli](https://console.ng.bluemix.net/docs/starters/install_cli.html) installed.
```bash
$ cf api https://api.ng.bluemix.net
$ cf login
$ cf push {{appname}}
```
#### For Heroku
Make sure you have [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.
```bash
$ heroku create
$ git push heroku master
$ heroku open
```
# One Click to deploy
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy)
<!--
[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://hub.jazz.net/git/lame/eventapp)
-->
# Checklist
* 
