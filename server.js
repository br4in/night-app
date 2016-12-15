var express = require("express"),
    routes = require("./app/routes/index.js"),
    path = require("path"),
    bodyParser = require("body-parser"),
    Yelp = require('yelp'),
    mongo = require("mongodb").MongoClient,
    passport = require("passport"),
    TwitterStrategy = require("passport-twitter"),
    session = require("express-session");

var app = express();

var url = 'mongodb://127.0.0.1/nightapp';

mongo.connect(url, function(error, db) {
    if (error) throw error;
    console.log('Successfully connected on port 27017');

    app.use(express.static(path.join(__dirname, '/public')));
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({secret: "-- ENTER CUSTOM SESSION SECRET --"}));
    app.use(passport.initialize());
    app.use(passport.session());
    
    var yelp = new Yelp({
    consumer_key: 'wrzqBjMtfEzXPbogvb9r-Q',
    consumer_secret: 'fBbexVBupYSxLrElf2_TRUbAx5w',
    token: 'weUD5754MlQ3iD5MDbOYF-sj6T-j0sDE',
    token_secret: 'pyusuRFFBmdn6Gg6xK8Yg7xY0dg',
    });
    
    passport.use(new TwitterStrategy({
        consumerKey: 'tKdpLBC8s1t1SiyfPLRXnMElz',
        consumerSecret: 'ZYURt6NSwJSDj4W7z3lATdDNdonvD0RCn2u5PanhGZeVmAgSOT',
        callbackURL: "https://night-app-br4in.c9users.io/auth/twitter/callback"
    },
    function(accessToken, token_secret, profile, done) {
        return done(null, profile);
        }
    ));
    
    passport.serializeUser(function(user, done) {
        // placeholder for custom user serialization
        // null is for errors
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        // placeholder for custom user deserialization.
        // maybe you are going to get the user from mongo by id?
        // null is for errors
        done(null, user);
    });

    routes(app, yelp, db, passport);

    app.listen('8080', function() {
        console.log('Server listening...');
    });
});

