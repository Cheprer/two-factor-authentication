require('env2')('.env');
let Hapi = require('hapi');
let Jwt2 = require('hapi-auth-jwt2');
let Vision = require('vision');
let HapiLogin = require('hapi-login');

let config = require('./config');
let validate = require('./validateFunc');
let db = require('./peopleDB');
let customFields = require('./peopleModel');
let loginHandler = require('./handlers/loginHandler');
let GAHandler = require('./handlers/googleAuthHandler');

function serverInstance() {
    let server;

    if (server){
        return server
    }

    server = new Hapi.Server();

    let loginOpts = {
        fields: customFields,
        handler: loginHandler,
        fail_action_handler: loginHandler
    };

    server.connection({
        host: config.server.hostname,
        port: config.server.port
    });

    server.register([Vision,
        {
            register: Jwt2
        },
        {
            register: HapiLogin,
            options: loginOpts
        }
    ], (err) => {

        if (err) {
            console.log(err);
        }

        server.auth.strategy('jwt', 'jwt', true, {
            key: process.env.JWT_SECRET,
            validateFunc: validate,
            verifyOptions: {
                algorithms: ['HS256']
            }
        });

        server.views({
            engines: {
                html: require('handlebars')
            },
            path: __dirname + '/views/'
        });

        server.route([{
                method: "GET",
                path: "/",
                handler: loginHandler,
                config: {
                    auth: false
                }
            },
            {
                method: 'POST',
                path: '/login/googleauth',
                handler: GAHandler.login,
                config: {
                    auth: false
                }
            },
            {
                method: 'GET',
                path: '/admin/googleauth',
                handler: GAHandler.generate
            },
            {
                method: 'POST',
                path: '/admin/googleauth',
                handler: GAHandler.update
            },
            {
                method: 'GET',
                path: '/admin',
                handler: (request, reply) => {
                    let person = db.people[request.auth.credentials.email];
                    console.log(person);
                    reply.view('admin')
                    .header("Authorization", request.headers.authorization);
                }
            }
        ]);
    });
    return server
}

module.exports = serverInstance;
