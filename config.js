servers = require('./servers.js');

config = {
    database: {
        ip: "localhost",
        port: 27017,
        url: ""
    },
    servers: {

    },
    secret: {
        jwt_key: "nsac",
        encryption: 'HS256'
    },
    data: {},
    retrive: {
        leaderboard: 50
    }
};
config.servers = servers;
config.database.url = "mongodb://" + config.database.ip + ":" + config.database.port + "/"
module.exports = config