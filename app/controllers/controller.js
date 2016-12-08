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
        if ($("#results-div").css('display') === 'none' ) {
            $('#search-bar').css({'top': '50%'});
            $('#search-bar').css({'margin-top': 'inherit'});
        }
    });
    
    $('#search-form').submit(function(event) {
        event.preventDefault();
        
        if ($('#search-bar').val() === '') {
            alert('You need to enter your location.');
        } else {
            $("#results-div").css({'display': 'block'}); 
            $('#search-bar').blur();
            var data = {
                search: $('#search-bar').val()
            };
            $.post('https://night-app-br4in.c9users.io/search', data, function(result) {
                displayResult(result);
            });
            $(this)[0].reset();
        }
    });
    
    function displayResult(result) {
        $('#results-div').empty();
            var total = result.total;
            
        for (var i = 1; i < total; i++) {
            var business = {};
            business.name = result.businesses[i]['name'];
            business.image = result.businesses[i]['image_url'];
            business.review = result.businesses[i]['snippet_text'];
            business.rating = result.businesses[i]['rating_img_url'];
            business.url = result.businesses[i]['url'];
            
            if (business.image === undefined) {
                business.image = '/img/img-not-found.png';
            }
            if (business.review === undefined) {
                business.review = 'There are no review...';
            }
            
            var resultDiv = `
            <div id="result-div">
                <a href="`+business.url+`">
                <div id="title">
                    <h1>`+business.name+`</h1>
                </div>
                <div id="image">
                    <img id="profile-img" src="`+business.image+`">
                </div></a>
                <div id="review-div">
                    <p id="description">`+business.review+`</p>
                </div>
                <div id="info-div">
                    <img id="stars-img" src="`+business.rating+`">
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