/**
 * userValidation.js
 * @description :: validate each post and put request as per user model
 */

 const joi = require('joi');
 
 /** validation keys and properties of user */
 exports.schemaKeys = joi.object({
   username: joi.string().required(),
   password: joi.string().min(8),
   email: joi.string().email(),
   name: joi.string(),
   role: joi.number(),
   phone: joi.string().length(10).regex(/^[0-9]+$/),
 }).unknown(true);