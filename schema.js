const mongoose = require("mongoose");
// const db = require("./db.js")

// const mongoose = require('mongoose');
mongoose
  .connect("mongodb://localhost/fookreywebs", { useUnifiedTopology: true })
  .catch((err) => console.log(err.reason));
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error in connecting to database"));

db.once("open", function () {
  console.log("Connected to database db");
});

const schema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: Date
});
const Contact = mongoose.model("contacts", schema);

// Contact.create({
//     Name : "hello",
//     email:"hello@hello.com",
//     subject:"hello",
//     message: "hello hello1 hello2 hello3",
//     date : Date(),
// })
// var data = new Contact({
//     name: "hellovczxzvb",
//     email: "hello@hello.com",
//     subject: "hello",
//     message: "hello hello1 hello2 hello3",
//     date: Date(),
// })
// data.save();

const finds =  Contact.find({},function(err,user){
  console.log(user);
})

// Contact.findOne({ name: "rawbeen.exe" }, function (err, Contact) {
//   if (err) return handleError(err);
//   console.log("%s %s is a %s .", Contact.name, Contact.email, Contact.subject);
// });

// console.log('hello');
// console.log( Contact.find({}));
// console.log( finds.user);
module.exports = schema;
