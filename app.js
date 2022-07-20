const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv')
const logger = require('morgan')
const passport = require('passport')
dotenv.config({ path: '.env'});
require('./config/db')
const seeder = require('./seeder')
const routes = require('./routes')
const app = express();
const corsOptions = { origin: process.env.ALLOW_ORIGIN, };

// including passport Strategies
const adminPassportStrategy = require('./config/adminPassportStrategy');
adminPassportStrategy(passport)
const employeePassportStrategy = require('./config/employeePassportStrategy');
employeePassportStrategy(passport)

// configuration of response handlers
app.use(require('./utils/response/responseHandler'));
app.use(cors(corsOptions));
app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// initializeing passport
app.use(passport.initialize());
// binding routes
app.use(routes)

// seeding of predefined data
seeder.seedData();

// listening server
app.listen(process.env.PORT, ()=>{
    console.log('Server is listening on ', process.env.PORT)
})
