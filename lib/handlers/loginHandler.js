let bcrypt = require('bcrypt');

let getSignedToken = require('../getSignedToken');
let db = require('../peopleDB');
let help = require('../helpers');

function reject(request, reply) {
    return reply.view('index', {
        title: 'Login Failed: Email Address or Password incorrect',
        error: {
            email: {
                message: 'Sorry, that email or password is incorrect. Please try again.'
            }
        },
        values: {
            email: help.escape(request.payload.email)
        }
    }).code(401);
}
function redirectToAdmin(request, reply, person){
    let token = getSignedToken(request.payload.email);
    return reply.view('admin', {
        name: person.name,
        email: help.escape(request.payload.email)
    }).header("Authorization", token);
}

function checkPassword(request, reply, person) {
    let pw = request.payload.password;
    let hash = person.password;
    bcrypt.compare(pw, hash, (err, res) => {
        if (!err && res === true) {
            db.people[request.payload.email].password_validated = true;
            if(person.two_factor_enabled && person.two_factor_secret){
                return reply.view('googleAuth', {
                    email: help.escape(request.payload.email)
                })
            }
            return redirectToAdmin(request, reply, person);
        }
        return reject(request, reply);
    });
}

function loginHandler(request, reply, source, error) {
    if (!request.payload || request.payload && error) {
        let errors, values;
        if (error && error.data) {
            errors = help.extractValidationError(error);
            values = help.returnFormInputValues(error);
        }
        return reply.view('index', {
            title: 'Please Register ' + request.server.version,
            error: errors,
            values: values
        }).code(error ? 400 : 200);
    }

    let person = db.people[request.payload.email];
    if (person){
        return checkPassword(request, reply, person);
    }

    return reject(request, reply);
}

module.exports = loginHandler;
