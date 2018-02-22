var cheerio = require('cheerio');
var request = require('request');
var fs      = require('fs');
var uuidv1  = require('uuid/v1');

var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    hostname = process.env.HOSTNAME || 'localhost',
    port = parseInt(process.env.PORT, 10) || 3003,
    publicDir = process.argv[2] || __dirname + '/public';

//Show homepage
app.get("/", function (req, res) {
  res.redirect("/index.html");
});

//Search page
app.get("/search/", function (req, res) {
  res.redirect("/search.html");
}); 


//Search API for AJAX
app.get('/search/:keyword', function(req, res) {
    var keyword = req.params.keyword;
    var url = 'https://www.flipkart.com/search?q='+keyword+'';
    console.log("url",url);
        var fileName = "flipkart"+uuidv1()+".txt";
        fs.open(fileName, 'w', function (err, file) {
          if (err) throw err;
          console.log('Saved!');
        });

        request({
            method: 'GET',
            url: url
        }, function(err, response, body) {
            if (err) return console.error(err);
            // console.log("response",response)
            console.log("body",typeof body);
            var $ = cheerio.load(body);

            fs.writeFile('scrapeFlipkartPage.html', body.toString(), function (err) {
              if (err) throw err;
              console.log('Saved!');
            });

            console.log("$('div._3yI_5w')",$('div._3yI_5w').html());
            console.log("$('div._2-gKeQ')",$('div._2-gKeQ').html());

            if($('div._3yI_5w').html()!==null){
              $('div._31eJXZ').each(function( index ) {
                  var flipkartProductName  = $(this).find('a._2cLu-l').attr('title')?$(this).find('a._2cLu-l').attr('title').trim():'';
                  var flipkartProductURL   = $(this).find('a.Zhf2z-').attr('href')?$(this).find('a.Zhf2z-').attr('href').trim():'';
                  var flipkartProductPrice = $(this).find('div._1vC4OE').text()?$(this).find('div._1vC4OE').text().trim():'';
                  console.log("Title: " + flipkartProductName);
                  console.log("flipkartProductURL: " + flipkartProductURL);
                  console.log("flipkartProductPrice: " + flipkartProductPrice);
                  fs.appendFileSync(fileName, 'Title: '+flipkartProductName + '\n URL: \n' +'https://www.flipkart.com'+ flipkartProductURL + '\n Price:\n '+ flipkartProductPrice + '\n\n\n');
              });
            }else if($('div._2-gKeQ').html()!==null){
                $('div._2-gKeQ').each(function( index ) {
                  var flipkartProductName  = $(this).find('div._3wU53n').text()?$(this).find('div._3wU53n').text().trim():'';
                  var flipkartProductURL   = $(this).find('a._1UoZlX').attr('href')?$(this).find('a._1UoZlX').attr('href').trim():'';
                  var flipkartProductPrice = $(this).find('div._1vC4OE').text()?$(this).find('div._1vC4OE').text().trim():'';
                  console.log("Title: " + flipkartProductName);
                  console.log("flipkartProductURL: " + flipkartProductURL);
                  console.log("flipkartProductPrice: " + flipkartProductPrice);
                  fs.appendFileSync(fileName, 'Title: '+flipkartProductName + '\n URL: \n' +'https://www.flipkart.com'+ flipkartProductURL + '\n Price:\n '+ flipkartProductPrice + '\n\n\n');
              });
            }


            // _2-gKeQ

            // results-table
        });
});


app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(publicDir));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

console.log("Server showing %s listening at http://%s:%s", publicDir, hostname, port);
app.listen(port);
