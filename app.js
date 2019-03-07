// app.js

var express=require("express");
var app = express();
var bodyParser =  require("body-parser");
var mysql = require('./dbcon.js');
var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended:true}));

//use ejs as default
app.set("view engine","ejs")
//serve public directory
app.use(express.static("public"));


app.get("/home", function(req, res){
  res.render("home");
})

app.get("/", function(req, res){
  res.render("login",{errorMsg:""});
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



// lookupuser
// samplepwd
app.post("/checkcredentials",function(req,res){
  // console.log(req.body);
  mysql.pool.query('SELECT * FROM lookup_users WHERE username=? and pwd =?',
                    [req.body.inputUsername,req.body.inputPassword],
                    function(err, results, fields) {
                          if (err) {
                            next(err);
                            return;
                          }
                          if (results.length>0) {
                              res.render("successful-login");
                          } else {
                              res.render("login",{errorMsg:"Your login credenials were incorrect!!"});
                          }
                    }
  );

})



//404 error, route not found, this or app.get("*") at the end
app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404! - The page you requested was not found :(');
});





app.listen(port, function(){
  console.log('Our app is running on http://localhost:' + port);
} );
