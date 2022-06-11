const http = require('http');
let router = require('./routes/routes');
let logging = require('./utils/logging');
let pool = require('./db')
require('dotenv').config();

pool.query("SELECT NOW()")
    .then(() => {
        logging.info(NAMESPACE, 'Postgres Connected');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    });


const NAMESPACE = 'Server';
const port = process.env.SERVER_PORT;
function serverFunc(req, res) {
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    router.callRoute(req, res);
    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
}

let server = http.createServer(serverFunc);
server.listen(port);