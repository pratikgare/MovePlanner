
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!


    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr+", "+cityStr;

    $greeting.text('So you want to live at '+address+'?');

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';

    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    /*
        What is CORS and why are we using it?
CORS works around the same-origin policy. The same-origin policy was implemented by web browsers to prevent malicious scripts from untrusted domains from running on a website. In other words, it ensures sure that scripts from one website can't insert themselves into another.

For example, the same-origin policy keeps the bad guys’ JavaScript from somehow running on your bank’s website and stealing your information.

Over time, developers realized that this policy was too strict, and often got in the way of legitimate use-cases. There are many reasons to serve content from multiple domain origins, and so developers found a way around it.

Developers that maintain server-side APIs can enable CORS on their servers to disable the same-origin policy. CORS is a relatively recent feature added to browsers. When certain headers are returned by the the server, the browser will allow the cross-domain request to occur.

For APIs that don't support CORS, you may need to use another method. The other way around the same-origin policy is JSON-P. JSON-P is a unique trick to allow cross-domain requests. Many APIs allow you to provide a callback function name, and they will generate a JavaScript file that passes the data into that function when it gets run in your browser.

This isn't the simplest thing to implement cleanly, but if you're using jQuery to create your AJAX requests, using JSON-P is as simple as adding an extra property to the options object that you pass into the AJAX method. You'll be doing this very soon, and I promise it's not as scary as it sounds. :)

The nitty gritty of JSON-P
Your application loads up a script from the other domain using a simple <script> tag. Once the script has been received, that code gets run by your browser. All the code does is build the data object you requested as a simple JavaScript object, and runs the callback function (that you told the server to use) with the object (your data) as a parameter.

You’ll need to refer to the documentation for any data API’s you want to use, and figure out if the API supports CORS or if you need to use JSON-P.

    */ 


    //NYtimes AJAX request

    //API key : 7f7e9a06c6b346dca36e822b07a0754c  

    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=7f7e9a06c6b346dca36e822b07a0754c';

    $.getJSON(nytimesUrl, function(data){
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        
        articles = data.response.docs;

        for(var i=0; i<articles.length; i++){
            var article = articles[i];
            $nytElem.append(
                '<li class="article">'+
                    '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                    '<p>' + article.snippet + '</p>'+
                '</li>'); 
        };
    });


    //Wikipedia AJAX request

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+cityStr+'&format=json&callback=wikiCallback';


    // var wikiRequestTimeout = setTimeOut(function(){
    //     $wikiElem.text("Failed to get wiki resources..");
    // }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response){
            var articleList = response[1];

            for(var i=0; i<articleList.length; i++){
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/'+articleStr;
                $wikiElem.append('<li><a href="'+url+'">'+articleStr+'</a></li>');
            };  

            //clearTimeout(wikiRequestTimeout);
        }
    });



    return false;
};

$('#form-container').submit(loadData);
