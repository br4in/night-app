'use strict';

var ManageSearchModule = require(process.cwd() + "/app/controllers/search_controller.js");

module.exports = function(app, yelp) {
    
    var manageSearch = new ManageSearchModule(yelp);
    var location;
    
    app.route('/')
        .get(function(request, response) {
            response.sendFile(process.cwd() + '/public/index.html');
        });
    
   app.route('/search')
        .post(function(request, response) {
            location = request.body['search'];
            manageSearch.search(request, response, location);
        });
        
    
};
