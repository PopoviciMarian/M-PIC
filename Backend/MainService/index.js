const http = require('http');
let router = require('./routes/routes');
let logging = require('./utils/logging');
let mongoose = require('mongoose');
require('dotenv').config();

mongoose
    .connect(process.env.MONGO_URL)
    .then((result) => {
        logging.info(NAMESPACE, 'Mongo Connected');
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