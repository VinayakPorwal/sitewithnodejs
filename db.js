const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/?readPreference=primary&directConnection=true&ssl=false', { useUnifiedTopology: true }).catch(err => console.log(err.reason));
// mongoose.connect('mongodb+srv://fookrey420:Vinayak%4002@cluster0.8mvxk.mongodb.net/test', { useUnifiedTopology: true }).catch(err => console.log(err.reason));
mongoose.connect('mongodb+srv://fookrey420:Vinayak%4002@cluster0.8mvxk.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }).catch(err => console.log(err.reason));

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error in connecting to database"));

db.once('open', function () {
    console.log("Connected to database db");
});



module.exports = db;