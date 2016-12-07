var express = require("express"),
    routes = require("./app/routes/index.js"),
    path = require("path"),
    bodyParser = require("body-parser"),
    Yelp = require('yelp');

var app = express();

var yelp = new Yelp({
  consumer_key: 'wrzqBjMtfEzXPbogvb9r-Q',
  consumer_secret: 'fBbexVBupYSxLrElf2_TRUbAx5w',
  token: 'weUD5754MlQ3iD5MDbOYF-sj6T-j0sDE',
  token_secret: 'pyusuRFFBmdn6Gg6xK8Yg7xY0dg',
});

app.use(express.static(path.join(__dirname, '/public')));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use(bodyParser.urlencoded({ extended: false }));

routes(app, yelp);

app.listen('8080', function() {
    console.log('Server listening...');
});