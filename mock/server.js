const jsonServer = require('json-server');
const server = jsonServer.create();

const integration = jsonServer.router('./db.json'); 

const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(integration);
server.listen(port);
