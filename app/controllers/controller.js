/* global $ */

$(document).ready(function() {
    var width = $(window).width();
    
    //animate search bar
    $('#search-bar').focus(function() {
        $('#search-bar').css({'top': '0'});
        if (width > 400) {
            $('#search-bar').css({'margin-top': '180px'});
        } else {
            $('#search-bar').css({'margin-top': '130px'});
        }
        
    });
    
    $('#search-bar').blur(function() {
        if ($('#results-div').hasOwnProperty('display') === 'none') {
            $('#search-bar').css({'top': '50%'});
            $('#search-bar').css({'margin-top': 'inherit'});
        } else {
            
        }
        
    });
    
    $('#search-form').submit(function(event) {
        event.preventDefault();
        $('#search-bar').blur();
        var data = {
            search: $('#search-bar').val()
        };
        $.post('https://night-app-br4in.c9users.io/search', data, function(result) {
            displayResult(result);
        });
    });
    
    function displayResult(result) {
        $('#results-div').empty();
            var total = result.total;
            
        for (var i = 1; i < total; i++) {
            var business = {};
            business.name = result.businesses[i]['name'];
            business.image = result.businesses[i]['image_url'];
            business.review = result.businesses[i]['snippet_text'];
            
            var resultDiv = `
            <div id="result-div">
                <div id="title">
                    <h1>`+business.name+`</h1>
                </div>
                <div id="image">
                    <img id="profile-img" src="`+business.image+`">
                </div>
                <div id="review-div">
                    <p id="description">`+business.review+`</p>
                </div>
                <div id="info-div">
                    <img id="stars-img" src="https://s3-media2.fl.yelpcdn.com/assets/2/www/img/99493c12711e/ico/stars/v1/stars_4_half.png">
                    <div id="join-div">
                        <button>I'm going</button>
                        <div id="join-count"><span id="count">5</span><span>going</span></div>
                    </div>
                </div>
            </div>`;
            
            $('#results-div').append(resultDiv);
        }
    }
    
    
    
    
});