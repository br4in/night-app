'use strict';

var ManageSearchModule = require(process.cwd() + "/app/controllers/search_controller.js");

module.exports = function(app, yelp, db) {
    
    var manageSearch = new ManageSearchModule(yelp, db);
    var location, username = 'br4in';
    
    app.route('/')
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
            console.log(url);
            manageSearch.updatePartecipants(request, response, url, username);
        });
        
};
