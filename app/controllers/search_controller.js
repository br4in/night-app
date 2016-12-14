var async = require("async");
'use strict';

var partecipants = [];
var lastLocation;
function manageSearch(yelp, db) {
    var collection = db.collection('bars');
    
    this.search = function(request, response, location) {
        lastLocation = location;
        // See http://www.yelp.com/developers/documentation/v2/search_api
        yelp.search({ term: 'bars', location: location })
        .then(function (data) {
            partecipants = [];
            getPartecipants(collection, data, function(data) {
                
                for (var i = 0; i < data.businesses.length; i++) {
                    var barName = data.businesses[i]['name'];
                    for (var x = 0; x < partecipants.length; x++) {
                        if (partecipants[x][barName] !== undefined) {
                            data.businesses[i]['partecipants'] = partecipants[x][barName].length;
                        }
                    }
                }
                console.log('sent');
                response.json(data);
            });
        })
        .catch(function (err) {
            console.error(err);
        });
    };
    
    this.updatePartecipants = function(request, response, url, username) {
        isInDb(request, response, collection, url, username);
    };
}

function getPartecipants(collection, data, myCallback) {
    async.forEach(Object.keys(data.businesses), function(key, callback) {
        var url = data.businesses[key]['url'];
        url = url.substr(0, url.indexOf('&'));
        var cursor = collection.find({url: url}).limit(1);
        cursor.each(function(err, item) {
            if (err) {
                callback(err);
            }
            if (item !== null) {
                var bar = {};
                bar[data.businesses[key]['name']] = item.partecipants;
                partecipants.push(bar);
            } else {
                callback();
            }
        });
    }, function(err) {
        if (err) throw err;
        console.log('done');
        myCallback(data);
    });
}

function isInDb(request, response, collection, url, username) {
    collection.find({
        url: url
    }).toArray(function (error, docs) {
        if (error) throw error;
        if (docs.length === 0) {
            // add it to db
            var bar = {
                url: url,
                partecipants: [username]
            };
            addBar(collection, url, bar, response);
        } else {
            console.log('bar exist');
            var index = docs[0]['partecipants'].indexOf(username);
            if (index !== -1) {
                console.log('remove partecipant');
                collection.update(
                    {url: url},
                    {$pull: { partecipants: { $in: [username]}}
                });
                response.json('partecipant added to bar');
            } else {
                console.log('add partecipant');
                collection.update(
                    {url: url},
                    {$push: {partecipants: username}
                });
                response.json('partecipant removed from bar');
            }
        }
    });
}

function addBar(collection, url, bar, response) {
    collection.insert(bar, function(error, data) {
        if (error) throw error;
        console.log(data);
        response.json('bar added to db');
    });
}

function getAllBars(collection) {
    collection.find({}).toArray(function (error, result) {
        if (error) throw error;
        console.log('all bars');
        console.log(result);
    });
}


module.exports = manageSearch;