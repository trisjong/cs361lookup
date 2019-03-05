// app.js
console.log("Welcome to a sample express app!!!");
var express=require("express");
var mysql = require('./dbcon.js');
var app = express();
var port = process.env.PORT || 3000;


//use ejs as default
app.set("view engine","ejs")



//serve public directory
app.use(express.static("public"));


app.get("/home", function(req, res){
  res.render("home");
})

app.get("/", function(req, res){
  res.render("login");
})


app.get('/get-users', function(req, res) {
  var content = {};
  mysql.pool.query('SELECT * FROM lookup_users', function(err, results, fields) {
      if (err) {
        next(err);
        return;
      }
      //content.results = JSON.stringify(results);
      //console.log(typeof results);
      // content.results = results;
      // res.send(content);
      obj = {print: results};

      res.render('users', obj)
  });
});


//404 error, route not found, this or app.get("*") at the end
app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404! - The page you requested was not found :(');
});




app.listen(port, function(){
  console.log('Our app is running on http://localhost:' + port);
} );
