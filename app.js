// app.js
console.log("Welcome to a sample express app!!!");
var express=require("express");
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



//404 error, route not found, this or app.get("*") at the end
app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404! - The page you requested was not found :(');
});




app.listen(port, function(){
  console.log('Our app is running on http://localhost:' + port);
} );
