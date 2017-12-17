//FOR chateau DATA EXPLORER ONLY
var config = require("config");

// RethinkDB settings
exports.host = config.get("rethinkdb.host");    // RethinkDB host
exports.port = config.get("rethinkdb.port");          // RethinkDB driver port
exports.authKey = config.get("rethinkdb.password");          // Authentification key (leave an empty string if you did not set one)

// Express settings
exports.expressPort = 3030;    // Port used by express
exports.debug = true;          // Debug mode
exports.network = 'localhost'  // Network the node app will run on