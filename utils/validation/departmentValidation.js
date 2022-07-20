/**
 * departmentValidation.js
 * @description :: validate each post and put request as per Department model
 */

 const joi = require('joi');
 
 /** validation keys and properties of user */
 exports.schemaKeys = joi.object({
   name: joi.string().required(),
   email: joi.string().email().required(),
   phone: joi.string().length(10).regex(/^[0-9]+$/),
   code: joi.string().required()
 }).unknown(true);