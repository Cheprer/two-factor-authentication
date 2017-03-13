let db = require('./peopleDB');

function validate(decoded, request, callback) {
    if (db.sessions[decoded.sid] && db.sessions[decoded.sid].exp > Math.floor(new Date().getTime() / 1000)) {
        return callback(null, true);
    } else {
        return callback(null, false);
    }
};

module.exports = validate;
