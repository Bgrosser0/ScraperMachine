var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var logger = require("morgan");

var PORT = process.env.PORT || 8080;

var app = express();

// var databaseUrl = "onionScraper";
// var collections = ["onionScrapes"];

// Require all models
var db = require("./models");

//include the models
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//     console.log("Database Error:", error);
// })

app.use(logger("dev"));
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/Onionsan")

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.

// =================================================
// DO THE THING!!!
// =================================================

// =================================================
// DO THE THING!!!
// =================================================

app.get("/scrape", function(req, res) {
  
  // =====================================================
  
  
  // First, tell the console what server.js is doing
  console.log("\n***********************************\n" +
              "Grabbing every Title, Summary and Link\n" +
              "from The Onion:" +
              "\n***********************************\n");
  
  // Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
  request("https://www.theonion.com", function(error, response, html) {
  
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);
  

  
    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $(".headline").each(function(i, element) {

            // An empty array to save the data that we'll scrape
    var result = {};
  
      // Save the text of the element in a "title" variable
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.summary = $(this).parent().next().find("p").text();
  
      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have

// =========================================================================
// HOW I GET THE INFO INSERTED INTO THE DB (NO CURRENT THINGS BEING CREATED)
// =========================================================================

    // if (title && link && summary) {
  
    //   db.onionScrapes.insert({"title": title, "link": link, "summary": summary});
  
    // }


      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
    res.send("Onion Layers Scraped.")  
  });
});

// =================================================================================

app.get("/saved", function(req, res) {
    res.render("saved")
})

// =================================================================================

app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    })
});

// ==================================================================================

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
          res.json(dbArticle);
      })
      .catch(function(err) {
          res.json(err);
      })
})



// ==================================================================================

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
          return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
          res.json(dbArticle);
      })
      .catch(function(err) {
          res.json(err);
      });
});

// =================================================
// SEEMS TO BE WORKING?
// =================================================

app.delete("/articles/:id", function(req, res) {
    db.Note.update(req.body.text)
      .then(function(dbNote) {
          return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id });
      })
      .then(function(dbArticle) {
          res.json(dbArticle);
      })
      .catch(function(err) {
          res.json(err);
      })
})


// =================================================

  app.listen(PORT, function () {
    console.log("App now listening at localhost:" + PORT);
  });

