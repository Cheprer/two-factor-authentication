let serverInstance = require('./lib/server');
let server = serverInstance();

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
