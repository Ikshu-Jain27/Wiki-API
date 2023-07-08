//requiring all the modules we had installed
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");
const { title } = require("process");

//new app instant created using express
const app = express();

//set the view engine to use EJS as our templating engine
app.set ("view engine", "ejs");

//use body-parser to pass our requests 
app.use(bodyParser.urlencoded({extended: true}));

//using public directory to store static files
app.use(express.static("public"));

//connect to database using mongoose
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
   title: String,
   content: String
};

const Article = mongoose.model ("Article", articleSchema);

// const articlesInit = [
//    {
//    //   _id: ObjectId("63c20bb06ae25f852d7d4801"),
//      title: 'REST',
//      content: "REST is short for REpresentational State Transfer. It's an architectural style for designing APIs."
//    },
//    {
//    //   _id: ObjectId("63c20bb06ae25f852d7d4802"),
//      title: 'API',
//      content: 'API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer.'
//    },
//    {
//    //   _id: ObjectId("63c20bb06ae25f852d7d4803"),
//      title: 'Bootstrap',
//      content: 'This is a framework developed by Twitter that contains pre-made front-end templates for web design'
//    },
//    {
//    //   _id: ObjectId("63c20bb06ae25f852d7d4804"),
//      title: 'DOM',
//      content: 'The Document Object Model is like an API for interacting with our HTML'
//    }
//  ]

//  Article.insertMany(articlesInit, function(err) {
//    if (err) {
//       console.log("err");
//    } else {
//       console.log("Successfully inserted the initial data.");
//    }
//  });

//  app.get("/articles", function(req, res) {
//    Article.find(function(err, foundArticles) {
//       if (!err) {
//          res.send(foundArticles);
//       } else {
//          res.send (err);
//       }
      
//    });
//  });

//  app.post("/articles", function(req, res) {

//    const newArticle = new Article ({
//       title: req.body.title,
//       content: req.body.content
//    });
//    newArticle.save(function (err) {
//       if (!err) {
//          res.send("Successfully added a new article.")
//       } else {
//          res.send(err);
//       }
//    });
//  });

//  app.delete("/articles", function (req, res) {
//    Article.deleteMany(function(err) {
//       if (!err) {
//          res.send("Successfully deleted all the documents.");
//       } else {
//          res.send(err);
//       }
//    });
//  });

////////////////////////////////////////////// REQUEST TARGETING ALL ARTICLES ///////////////////////////////////////////

 app.route("/articles")
   .get(function (req, res) {
      Article.find(function(err, foundArticles) {
         if (!err) {
            res.send(foundArticles);
         } else {
            res.send (err);
         }
         
      });
   }) //no semicolon as we don't want it to end since we have other chained methods as well

   .post(function(req, res) {
      const newArticle = new Article ({
         title: req.body.title,
         content: req.body.content
      });
      newArticle.save(function (err) {
         if (!err) {
            res.send("Successfully added a new article.")
         } else {
            res.send(err);
         }
      });
   })

   .delete(function(req, res) {
      Article.deleteMany(function(err) {
         if (!err) {
            res.send("Successfully deleted all the documents.");
         } else {
            res.send(err);
         }
      });
   });

///////////////////////////////////////// REQUEST TARGETING A SPECIFIC ARTICLE ///////////////////////////////////////////

 app.route("/articles/:articleTitle")
   .get (function (req, res) {
      Article.findOne({title: req.params.articleTitle}, function (err, foundArticle) {
         if (foundArticle) {
            res.send(foundArticle);
         } else {
            res.send("No article matching that title was found.");
         } 
      });
         
   })

   .put (function (req, res) {
      Article.updateOne(
         {title: req.params.articleTitle},
         {title: req.body.title, content: req.body.content},
         // {overwrite: true},
         function (err) {
            if (!err) {
               res.send("Successfully updated the article.");
            } else {
               res.send (err);
            }
         }
      )
   })

   .patch (function(req, res) {
      Article.updateOne(
         {title: req.params.articleTitle},
         {$set: req.body},
         function(err) {
            if(!err) {
               res.send("Successfully updated the article.");
            } else {
               res.send (err);
            }
         }
      );
   })

   .delete (function(req, res) {
      Article.deleteOne(
         {title: req.params.articleTitle},
         function (err) {
            if (!err) {
               res.send ("Successfully deleted the corresponding article.");
            } else {
               res.send (err);
            }
         }
      );
   });

 app.listen(3000, function() {
   console.log("Successfully started on port 3000.");
 });