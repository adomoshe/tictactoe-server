const Server = require('socket.io').Server;
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
require('dotenv').config();

const { registerMove, matchGame } = require('./routes/play');

const app = express();
const server = require('http').createServer(app);

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
    jwksUri: `https://${
      process.env.AUTH0_DOMAIN || 'tictactoe1.us.auth0.com'
    }/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE || 'tictactoe1.us.auth0.com',
  issuer: [`https://${process.env.AUTH0_DOMAIN || 'localhost:3001/play'}/`],
  algorithms: ['RS256'],
});

app.get('/api/private', checkJwt, function (req, res) {
  res.json({
    message:
      'Hello from a private endpoint! You need to be authenticated to see this.',
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

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.use(([event, ...args], next) => {
    // Hook this up to Auth0 for authentication
    /* if (isUnauthorized(event)) {
         return next(new Error("unauthorized event"));
       }*/
       next();
  });

  socket.on('play:space', (payload) => registerMove(socket, payload));
  socket.on('joined', async (payload) => await matchGame(socket, payload));
  socket.on('error', (err) => {
    if (err && err.message === 'unauthorized event') {
      socket.disconnect();
    }
  });
  socket.on('disconnect', () => console.log('A user disconnected'));
});

const port = process.env.PORT || 3001;
const socketPort = process.env.SOCKET_PORT || 3002;

app.listen(port);
console.log(`Listening on PORT: ${port}`);

server.listen(socketPort, () => {
  console.log(`Socket listening on PORT: ${socketPort}`);
});
