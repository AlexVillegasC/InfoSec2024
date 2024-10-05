// Required libraries
const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const session = require('express-session');
const { auth, requiresAuth } = require('express-openid-connect');
const path = require('path');
const cons = require('consolidate');
const unalib = require('./unalib'); // Include the unalib module

// SSL options
const sslOptions = {
  key: fs.readFileSync('certs/localhost/localhost.key'),
  cert: fs.readFileSync('certs/localhost/localhost.crt')
};

// Create HTTPS server
const httpsServer = https.createServer(sslOptions, app);

// Create Socket.io server
const io = require('socket.io')(httpsServer);

const port = process.env.PORT || 3000;

// Secret for session
const SECRET = '';

// OIDC Configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: SECRET,
  baseURL: '',
  clientID: '',
  issuerBaseURL: '',  
  // Add the 'afterCallback' function
  afterCallback: (req, res, session) => {
    // Redirect to '/unachat' after login
    res.redirect('/unachat');
    return session;
  }
};


// Session middleware
app.use(session({
  cookie: { httpOnly: true },
  secret: SECRET,
  resave: false,
  saveUninitialized: false
}));

// Auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// View engine setup
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Serve static files
app.use('/static', express.static('static'));

// Serve the public index page
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

// Protected route to unachat
app.get('/unachat', requiresAuth(), function(req, res) {
  // Get the user's information
  const userInfo = req.oidc.user;
  res.render('unachat', { user: userInfo });
});

// Socket connection
io.on('connection', function(socket){
  // Since only authenticated users can access /unachat, we assume connections are authenticated
  socket.on('Evento-Mensaje-Server', function(msg){
    // Process the message using unalib
    var processedMsg = unalib.validateMessage(msg);
    io.emit('Evento-Mensaje-Server', processedMsg);
  });
});

// Start the server
httpsServer.listen(port, function(){
  console.log('Listening on *:' + port);
});