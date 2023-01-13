const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db.js");
const app = express();
const hostname = "127.0.0.1";
const port = 80;
const mongoose = require("mongoose");
const ytdl = require("ytdl-core");
// const bodyparser = require("body-parser");
const cors = require("cors");
const date = new Date();
app.use(cors());
//schema for contact form
const schema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: Date,
});
const Contact = mongoose.model("contact", schema);

//schema for register
const registerschema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  date: Date,
});
const Register = new mongoose.model("register", registerschema);

// For serving static files
app.use(express.static(path.join(__dirname, "public")));

// for getting file path from website
app.use(express.urlencoded({ extended: true }));

// Set the template engine as ejs
app.set("view engine", "ejs");

// Set the views directory
// app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => {
  res.status(200).render("demo");
});
app.get("/2", (req, res) => {
  res.status(200).send("demo");
});
app.get("/contact", (req, res) => {
  res.status(200).render("contact");
});
app.get("/about", (req, res) => {
  res.status(200).render("about");
});
app.get("/projects", (req, res) => {
  res.status(200).render("projects");
});
app.get("/signup", (req, res) => {
  res.status(200).render("signup", { alert: "" });
});
app.get("/login", (req, res) => {
  res.status(200).render("login", { alert: "" });
});

const url = "https://www.youtube.com/watch?v=xNTW2KfErTM";
const videoName = "never-gonna-give-you-up.mp4";

app.get("/down", async (req, res) => {
  var URL = req.query.URL;
  // res.json({ url: URL });
  //  ytdl(url)
  //   .pipe(fs.createWriteStream(videoName))
  //   .on("finish", () => {
  //     console.log(`${videoName} has been downloaded!`);
  //   });
  res.header("Content-Disposition", 'attachment; filename="video.mp4"');
  ytdl(url, {
    format: "mp4",
  }).pipe(res);
  let info = await ytdl.getInfo("xNTW2KfErTM");
  console.log(info)
  res.send("done");
});

//-----get data of input to store in text file-----
// app.post('/submited', (req, res) => {
//   namefull = req.body.Name;
//   email = req.body.Email;
//   subject = req.body.Subject;
//   message = req.body.Message;
//   let out = `name is ${namefull},\n email is ${email},\n Subect is ${subject},\n Message for you ${message}`;
//   fs.writeFileSync('outputt.txt', out);
//   console.log(req.body);
//   res.status(200).render("submited");
// });

//-----to store Contact Form data in database-----
app.post("/contact", (req, res) => {
  var myData = new Contact(req.body);
  myData
    .save()
    .then(() => {
      console.log(myData);
      res.send("This item has been saved to the database");
    })
    .catch(() => {
      res.status(400).send("item was not saved to the databse");
      console.log(myData);
      // console.log(res)
    });
});

// function login(email) {
//   Register.findOne({ email: email }, function (err, Contact) {
//     if (err) {
//       // return handleError(err);
//       return false;
//     } else {
//       console.log("%s %s", Contact.name, Contact.email);

//       return true;
//     }
//   });
// }

//--to store data of user into register table/collection
app.post("/signup", (req, res) => {
  var data = new Register(req.body);

  console.log(req.body.password, req.body.cpassword);

  // if (login(req.body.email)) {
  //   console.log("exist");
  //   res
  //     .status(200)
  //     .render("signup", { alert: "account with this email already exist" });
  // }
  if (req.body.password !== req.body.cpassword) {
    console.log("password does not match");
    // res.send('<script>alert("password does not match")</script>')
    res.status(200).render("signup", { alert: "password does not match" });
  } else {
    if (req.body.password === req.body.cpassword) {
      Register.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
          return handleError(err);
        } else if (!user) {
          console.log(data);
          data.save(() => {
            console.log("data saved");
            res.status(200).render("demo");
          });
        } else {
          // console.log("%s %s", Contact.name, Contact.email);
          res.status(200).render("signup", {
            alert: "account with this email already exist",
          });
          // return true;
        }
      });
    }
  }
});

//login
app.post("/login", (req, res) => {
  var data = new Register(req.body);

  console.log(req.body.password, req.body.email);
  Register.findOne({ email: req.body.email }, function (err, user) {
    if (!user) {
      res.status(200).render("login", {
        alert: "Account doesnt exist , create an account first",
      });
    } else if (user.password === req.body.password) {
      console.log(user.password, user.email);
      console.log("logged in");
      res.status(200).render("demo");
    } else if (user.password !== req.body.password) {
      console.log("password does not match");
      res.status(200).render("login", { alert: "password does not match" });
    }
  });
});
// strat the server
app.listen(port, () => {
  console.log(
    `The application started successfully on port http://${hostname}:${port}`
  );
});

// technique to get connect with server without express
// const http = require('http');
// const fs = require('fs');
// const hostname = '127.0.0.1';
// const port = 80;

// const home = fs.readFileSync('./home.html');
// const about = fs.readFileSync('./about.html');
// const contact = fs.readFileSync('./contact.html');
// const project = fs.readFileSync('./projects.html');
// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   url = req.url;
//   console.log(url);
//   res.setHeader('Content-Type', 'text/html');
//   if (url == '/') {
//     res.end(home);
//   }
//   else if (url == '/about') {
//     res.end(about);
//   }

//   else if (url == '/contact') {
//     res.end(contact);
//   }
//   else if (url == '/projects') {
//     res.end(project);
//   }
//   else {
//     res.statusCode = 404;
//     res.end("<h1>404 not found</h1>");
//   }
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

function validateEmailAccessibility(email, done) {
  User.find({ email: email }, function (err, result) {
    // If an exception occurs return the error
    if (err) {
      return done(err);
    }
    // Otherwise if the result object is empty, the email is not registered
    if (!result) {
      //the email is not registered
      return true;
    }
    // Otherwise the email is in use
    return false;
  });
}
