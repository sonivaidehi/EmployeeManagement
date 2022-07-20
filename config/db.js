const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db = mongoose.connection;
db.once('open', ()=>{
    console.log("Database is connected...");
})

db.on('error',()=>{
    console.log("error while connecting database...")
})

module.exports = db;