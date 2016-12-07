'use strict';
function manageSearch(yelp) {
    
    this.search = function (request, response, location) {
        // See http://www.yelp.com/developers/documentation/v2/search_api
        yelp.search({ term: 'bars', location: location })
        .then(function (data) {
            console.log(data);
            response.json(data);
        })
        .catch(function (err) {
            console.error(err);
        });
    };
    
    
    this.searchBusiness = function (request, response) {
        // See http://www.yelp.com/developers/documentation/v2/business
        yelp.business('yelp-san-francisco')
        .then(console.log)
        .catch(console.error);
    };

    
    this.phoneSearch = function (request, response) {
        yelp.phoneSearch({ phone: '+15555555555' })
        .then(console.log)
        .catch(console.error);
    };

    

    // // A callback based API is also available:
    // yelp.business('yelp-san-francisco', function(err, data) {
    // if (err) return console.log(err);
    //  console.log(data);
    // });
}

module.exports = manageSearch;