let Joi = require('joi');
module.exports = {
  email    : Joi.string().email().required().max(254),
  password : Joi.string().required().min(6).max(100),
  name     : Joi.string().optional().max(100)
};
