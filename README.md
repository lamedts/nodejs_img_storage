s381f Project

# How To Run
```sh
npm start
```
OR
```bash
pm2 start {{startup script}} --name="{{appname}}" --watch
```

# Upload to Bluemix using CF
```bash
cf api https://api.ng.bluemix.net
cf login
cf push "cloudpj"
```

