'use strict';

var ManageSearchModule = require(process.cwd() + "/app/controllers/search_controller.js");

module.exports = function(app, yelp, db, passport) {
    
    var manageSearch = new ManageSearchModule(yelp, db);
    var location, username;
    
    app.route('/')
        .get(function(request, response) {
            response.sendFile(process.cwd() + '/public/index.html');
        });
        
    app.route('/lastSearch/:location')
        .get(function(request, response) {
            response.sendFile(process.cwd() + '/public/index.html');
        });
    
   app.route('/search')
        .post(function(request, response) {
            location = request.body['search'];
            manageSearch.search(request, response, location);
        });
        
    app.route('/searchdb')
        .get(function(request, response) {
            var url = request.query.url;
            manageSearch.updatePartecipants(request, response, url, username);
        });
        
    app.route('/auth/twitter')
        .get(passport.authenticate('twitter'));
    
    app.route('/auth/twitter/callback')
        .get(passport.authenticate('twitter', { failureRedirect: '/' , successRedirect: 'back'}));
        
    app.route('/profile')
        .get(function(request, response) {
            if (request.isAuthenticated()) {
                console.log(request.user.username);
                username = request.user.username;
                var result = {
                    username: username,
                    location: location
                };
                response.json(result);
            } else {
                console.log('Not authenticated.');
            }
        });
};
