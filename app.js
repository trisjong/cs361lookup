// app.js

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require('./dbcon.js');
var port = process.env.PORT || 8619;
app.use(bodyParser.urlencoded({ extended: true }));

//use ejs as default
app.set("view engine", "ejs")
//serve public directory
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("login", { showMsg: "" });
})

app.get("/home", function (req, res) {
  var act = ""
  if (req.query.action === "showSurvey") {
    act = "showSurveyPrompt"
  } else {
    act = "noSurveyPrompt"
  }

  mysql.pool.query('SELECT name,image,description,location FROM plants ORDER BY RAND() LIMIT 1', function(err, results,fields){
    if(err){
      next(err);
      return;
    }
    /*console.log(results);
    console.log("name: "+results[0].name);
    console.log("img: "+results[0].image);
    console.log("desc: "+results[0].description);
    console.log("loc: "+results[0].location);*/
    res.render("home", { showSurveyPrompt: act, name: results[0].name, image: results[0].image, description: results[0].description, location: results[0].location });
  })

})

app.get("/updateUsername", function (req, res) {
  res.render("updateUsername");
})

app.get("/updatePassword", function (req, res) {
  res.render("updatePassword");
})

app.get("/createUser", function (req, res) {
  res.render("createUser", { showMsg: "" });
})

app.get("/survey", function (req, res) {
  res.render("survey");
})




app.get('/get-users', function (req, res) {
  var content = {};
  mysql.pool.query('SELECT * FROM lookup_users', function (err, results, fields) {
    if (err) {
      next(err);
      return;
    }
    //content.results = JSON.stringify(results);
    //console.log(typeof results);
    // content.results = results;
    // res.send(content);
    obj = { print: results };

    res.render('users', obj)
  });
});



// lookupuser
// samplepwd
app.post("/checkcredentials", function (req, res) {
  // console.log(req.body);
  mysql.pool.query('SELECT * FROM lookup_users WHERE username=? and pwd =?',
    [req.body.inputUsername, req.body.inputPassword],
    function (err, results, fields) {
      if (err) {
        next(err);
        return;
      }
      if (results.length > 0) {
        res.render("successful-login");
      } else {
        res.render("login", { showMsg: "Your login credenials were incorrect!!" });
      }
    }
  );

})

app.post("/submitSurvey", function (req, res) {
	var context = {};
	//inserts survey result data into the table
	mysql.pool.query('INSERT INTO survey_data (question1,question2) VALUES (?,?)',
		[req.body.question1, req.body.question2]
	);
	//shows the home page
	mysql.pool.query('SELECT name,image,description,location FROM plants ORDER BY RAND() LIMIT 1', function(err, results,fields){
		if(err){
		next(err);
		return;
		}
		/*console.log(results);
		console.log("name: "+results[0].name);
		console.log("img: "+results[0].image);
		console.log("desc: "+results[0].description);
		console.log("loc: "+results[0].location);*/
		res.render("home", { showSurveyPrompt: "noSurveyPrompt", name: results[0].name, image: results[0].image, description: results[0].description, location: results[0].location });
	})
	
})

//ensure fields have valid input
//check to make sure username isn't duplicated
//insert new user into database
app.post("/createUser", function (req, res) {
  // console.log(req.body);
  var context = {};
  //checks to see if confirm password field matches the initial password field
  if (req.body.confirmPassword != req.body.inputPassword) {
    context.results = "Error! The two password fields do not match";
    res.render("createUser", { showMsg: context.results });
    return;
  }
  //checks to make sure no fields are blank
  if (req.body.inputUsername == "" || req.body.inputPassword == "" || req.body.zipcode == "" || req.body.inputEmail == "" || req.body.confirmPassword == "") {
    context.results = "Error! There was at least one field left blank";
    res.render("createUser", { showMsg: context.results });
    return;
  }
  mysql.pool.query('INSERT INTO lookup_users (username,pwd,zipcode,email) VALUES (?,?,?,?)',
    [req.body.inputUsername, req.body.inputPassword, req.body.zipcode, req.body.inputEmail],
    function (err, results, fields) {
      if (err) {
        context.results = "Error!!!!";
        res.render("login", { showMsg: context.results });
        return;
      }
      context.results = "You have successfully created an account!";
      res.render("login", { showMsg: context.results });

    }
  );

})


// lookupuser
// samplepwd
//will be given a password and email combo
app.post("/updateUsername", function (req, res) {
  // console.log(req.body);
  var context = {};
  mysql.pool.query('SELECT * FROM lookup_users WHERE email=? and pwd =?',
    [req.body.inputEmail, req.body.inputPassword],
    function (err, results, fields) {
      if (err) {
        next(err);
        return;
      }

      if (results.length == 1) {
        var curVals = results[0];
        mysql.pool.query("UPDATE lookup_users SET username=? WHERE id=? ",
          [req.body.inputNewUsername, curVals.id],
          function (err, result) {
            if (err) {
              next(err);
              return;
            }
          }
        );
        context.results = "Your username was updated to " + req.body.inputNewUsername;
        res.render("login", { showMsg: context.results });
      } else {
        context.results = "Error!!!!";
        res.render("login", { showMsg: context.results });
      }
    }
  );

})







// lookupuser
// samplepwd
//will be given a username and email combo
app.post("/updatePassword", function (req, res) {
  // console.log(req.body);
  var context = {};
  mysql.pool.query('SELECT * FROM lookup_users WHERE email=? and username =?',
    [req.body.inputEmail, req.body.inputUsername],
    function (err, results, fields) {
      if (err) {
        next(err);
        return;
      }
      if (results.length == 1) {
        var curVals = results[0];
        mysql.pool.query("UPDATE lookup_users SET pwd=? WHERE id=? ",
          [req.body.inputNewPassword, curVals.id],
          function (err, result) {
            if (err) {
              next(err);
              return;
            }

          }
        );
        context.results = "Your password was updated!";
        res.render("login", { showMsg: context.results });
      } else {
        context.results = "Nothing happended!!!!";
        res.render("login", { showMsg: context.results });
      }
    }
  );

})






//404 error, route not found, this or app.get("*") at the end
app.use(function (req, res) {
  res.type('text/plain');
  res.status(404);
  res.send('404! - The page you requested was not found :(');
});





app.listen(port, function () {
  console.log('Our app is running on http://localhost:' + port);
});
