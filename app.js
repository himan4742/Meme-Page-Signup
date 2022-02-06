const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express()
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extension: true}));

app.listen(process.env.PORT || 8000, function() {
  console.log("Server is running.");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.post("/submit", function(req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        'email_address': email,
        status: "subscribed",
        merge_fields: {
          'FNAME': fname,
          'LNAME': lname,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/Lists/ed72506c3d";

  const options = {
    method: "POST",
    auth: "Himanshu:0e36b4f05e9fc70091bac4340ce8600c-us14",
  };

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');    }
    else {
      res.sendFile(__dirname + '/failure.html');
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();
});


app.post("/redirect", function(req, res) {
  res.redirect("/");
});
