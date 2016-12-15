/* global $ */

$(document).ready(function() {
    var width = $(window).width();
    var username, isLogged = false;
    var lastSearch;
    
    //init
    getUserInfo();
    
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
        lastSearch = $('#search-bar').val();
        if ($('#search-bar').val() === '') {
            alert('You need to enter your location.');
        } else {
            $("#results-div").css({'display': 'block'}); 
            $('#search-bar').blur();
            var data = {
                search: lastSearch
            };
            $.post('https://night-app-br4in.c9users.io/search', data, function(result) {
                displayResult(result);
            });
            $(this)[0].reset();
        }
    });
    
    $('#results-div').on('click', 'button', function() {
        if (isLogged) {
            var url = $(this).attr('href');
            $.getJSON('https://night-app-br4in.c9users.io/searchdb?url=' + url, function(result) {
                console.log(result);
            });
        } else {
            window.location.href = 'https://night-app-br4in.c9users.io/auth/twitter';
        }
    });
    
    function displayResult(result) {
        $('#results-div').empty();
            var total = result.total;
            
        for (var i = 0; i < total; i++) {
            var business = {};
            business.name = result.businesses[i]['name'];
            business.rating = result.businesses[i]['rating_img_url'];
            business.url = result.businesses[i]['url'];
            
            if (result.businesses[i]['image_url'] === undefined) {
                business.image = '/img/img-not-found.png';
            } else {
                business.image = result.businesses[i]['image_url'];
            }
            
            if (result.businesses[i]['snippet_text'] === undefined) {
                business.review = 'There are no review...';
            } else {
                business.review = result.businesses[i]['snippet_text'];
            }
            
            if (result.businesses[i]['partecipants'] === undefined) {
                business.partecipants = 0;
            } else {
                business.partecipants = result.businesses[i]['partecipants'];
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
                        <button href="`+business.url+`" id="join-btn">I'm going</button>
                        <div id="join-count"><span id="count">`+business.partecipants+`</span><span>going</span></div>
                    </div>
                </div>
            </div>`;
            
            $('#results-div').append(resultDiv);
        }
    }
    
    function getUserInfo() {
        $.getJSON("https://night-app-br4in.c9users.io/profile", function(result) {
            console.log(result.username + result.location + ' getinfo');
            if (result !== undefined) {
                username = result.username;
                isLogged = true;
                $("#results-div").css({'display': 'block'});
                $('#search-bar').css({'top': '0'});
                if (width > 400) {
                    $('#search-bar').css({'margin-top': '180px'});
                } else {
                    $('#search-bar').css({'margin-top': '130px'});
                }
                var data = {
                    search: result.location
                };
                $.post('https://night-app-br4in.c9users.io/search', data, function(result) {
                    displayResult(result);
                });
            }
        });
    }
  
});