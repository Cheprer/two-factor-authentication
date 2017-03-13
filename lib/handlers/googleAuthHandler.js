let speakeasy = require("speakeasy");
let Boom = require('boom');
let QRCode = require('qrcode');

let getSignedToken = require('../getSignedToken');
let db = require('../peopleDB');
let help = require('../helpers');

function login(request, reply) {
    if (request.payload) {
        let email = request.payload.email;
        let googleToken = request.payload.verificationCode;
        if (!email || !googleToken){
            return reply(Boom.badRequest('Invalid body'));
        }

        let person = db.people[email];
        if(!person){
            return reply(Boom.notFound("Couldn't find user"));
        }

        if(!person.two_factor_enabled || !person.two_factor_secret){
            return reply(Boom.forbidden("User doesn't have 2 factor authentication enabled"));
        }

        let verified = speakeasy.totp.verify({
            secret: person.two_factor_secret,
            encoding: 'base32',
            token: googleToken });
        if(verified && person.password_validated){
            db.people[email].password_validated = false;
            let token = getSignedToken(email);
            return reply.view('admin', {
                name: person.name,
                email: help.escape(person.email)
            }).header("Authorization", token);
        }
        return reply(Boom.unauthorized('Invalid code or comming from wrong page(go through login first).', '' , { email: email }));
    }
    return reply(Boom.badRequest('Empty payload'));
}

function generate(request, reply){
    let credentials = request.auth.credentials;
    let person = db.people[credentials.email];
    let secret = speakeasy.generateSecret({ name: "UNMS " + credentials.email });
    let tempSecretToken = secret.base32;

    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
        return reply.view('googleAuthAdmin', {
            two_factor: {
                qr: data_url,
                temp_secret: tempSecretToken,
                authToken: request.auth.token
            }
        });
    });
}

function update(request, reply){
    if (request.payload.googleSecret && request.payload.verificationCode) {
        var verified = speakeasy.totp.verify({
            secret: request.payload.googleSecret,
            encoding: 'base32',
            token: request.payload.verificationCode });

        if(verified){
            let credentials = request.auth.credentials;
            db.people[credentials.email].two_factor_enabled = true;
            db.people[credentials.email].two_factor_secret = request.payload.googleSecret;
            return reply.view('admin', {
                name: db.people[credentials.email].name,
                email: help.escape(credentials.email)
            }).header("Authorization", request.auth.token);
        }
        return reply(Boom.unauthorized('Invalid code'), '', { googleSecret: request.payload.googleSecret});

    }
    return reply(Boom.badRequest('Wrong payload. Missing secret and/or verification code.'));
}

module.exports = {
    login: login,
    generate: generate,
    update: update
};
