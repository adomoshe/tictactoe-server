const Server = require('socket.io').Server;
const express = require('express');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);

// import playHandlers from './routes/play';

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}

const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

const checkJwt = jwt({
  // Dynamically provide a signing key based on the [Key ID](https://tools.ietf.org/html/rfc7515#section-4.1.4) header parameter ("kid") and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: [`https://${process.env.AUTH0_DOMAIN}/`],
  algorithms: ['RS256'],
});

const checkScopes = jwtAuthz(['read:messages']);

app.get('/api/public', function (req, res) {
  res.json({
    message:
      "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});

app.get('/api/private', checkJwt, function (req, res) {
  res.json({
    message:
      'Hello from a private endpoint! You need to be authenticated to see this.',
  });
});

app.get('/api/private-scoped', checkJwt, checkScopes, function (req, res) {
  res.json({
    message:
      'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.',
  });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  return res.status(err.status).json({ message: err.message });
});

const serverOptions = {
  cors: {
    origin: ['http://localhost:3000'],
  },
};
const io = new Server(server, serverOptions);

// const { createTodo, listTodo } = createTodoHandlers(components);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
  // socket.on('todo:create', createTodo);
  // socket.on('todo:list', listTodo);
});

const port = process.env.PORT || 3001;
const socketPort = process.env.SOCKET_PORT || 3002;

app.listen(port);
console.log(`Listening on PORT: ${port}`);

server.listen(socketPort, () => {
  console.log(`Socket listening on PORT: ${socketPort}`);
});

