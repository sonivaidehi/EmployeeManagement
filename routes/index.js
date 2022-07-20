/**
 * index.js
 * @description :: index route of platforms
 */

 const express = require('express');
 const router =  express.Router();
 
 // admin routes
 router.use(require('./admin'));

 // employee routes
 router.use(require('./employee'));
 module.exports = router;