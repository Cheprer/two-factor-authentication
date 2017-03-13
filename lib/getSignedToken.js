let JWT = require('jsonwebtoken');
let aguid = require('aguid');

let db = require('./peopleDB');

function getSignedToken(email){
    let sid = aguid();
    let token = {
        sid: sid,
        email: email,
        exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60
    };
    db.sessions[token.sid] = token;
    return JWT.sign(token, process.env.JWT_SECRET);
}

module.exports = getSignedToken;
