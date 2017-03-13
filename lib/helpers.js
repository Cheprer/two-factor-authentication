let validator = require('validator');

function validatorEscape (str) {
  str = str || ''; // assign empty string if unset;
  return validator.escape(str);
}


function extractValidationError(error) {
  let key = error.data.details[0].path;
  err = {}
  err[key] = {
    class   : 'input-error',
    message : error.data.details[0].message // Joi error message
  }
  return err;
}

function returnFormInputValues(error) {
    let values = {};
    Object.keys(error.data._object).forEach(function(k){
      values[k] = validator.escape(error.data._object[k].toString());
    });
  return values;
}

module.exports = {
  extractValidationError : extractValidationError,
  returnFormInputValues : returnFormInputValues,
  escape : validatorEscape
};
