'use strict';

var path = require('path');
var http = require('http');
var koa = require('koa');
var app = new koa();
var koaBody = require('koa-body');
var serve = require('koa-static');
var koaNunjucks = require('koa-nunjucks-2');
var mount = require('koa-mount');
var methodOverride = require('koa-methodoverride');
var session = require('koa-session');
var flash = require('koa-flash');
var mongoose = require('koa-mongoose');
var chalk = require('chalk');
var socketIo = require('socket.io');
var _ = require('lodash');
var passport = require('koa-passport');

var config = require('./config.js');
var nunjucksFilters = require('./lib/nunjucks/filters');
var csrfMdw = require('./middleware/csrf');
var xhrMdw = require('./middleware/xhr');
var authMdw = require('./middleware/auth');

var server = http.Server(app.callback());
var io = socketIo(server);
server.listen(config.port);
console.log(chalk.blue.bold(`Server run and listening on ${config.port} port`));

// boot sockets
var ioTodos = require('./sockets/todos')(io);
var ioUsers = require('./sockets/users')(io);

app.use(function * (next) {
  this.io = {
    todos: ioTodos,
    users: ioUsers
  };
  yield next;
});


// var dbConnect = require('./lib/db/connect')();
app.use(mongoose({
  mongoose: require('mongoose-q')(),
  user: config.mongoUser,
  pass: config.mongoPassword,
  host: '127.0.0.1',
  port: 27017,
  database: config.mongoDatabase,
  db: {
    native_parser: true
  },
  server: {
    poolSize: 5
  }
}));

app.use(serve(__dirname + '/public'));

app.context.render = koaNunjucks({
  autoescape: true,
  ext: 'html',
  path: path.join(__dirname, 'views')
});

nunjucksFilters(app);

app.keys = [config.secret, config.secret, config.secret];
app.use(session(app));
app.use(flash());

app.use(function * (next) {
  this.setFlash = function (type, msg) {
    this.flash = {
      type: type,
      message: msg
    };
  };
  yield next;
});

app.use(passport.initialize());
app.use(passport.session());

app.use(authMdw.loadAccess());
app.use(authMdw.initJWTtoken());

// Load routes
var index = require('./routes/index');
var users = require('./routes/users');
var todos = require('./routes/todos');
var auth = require('./routes/auth');

// Load locals
app.use(function * (next) {
  this.state.flash = this.flash;
  this.state.back = this.request.headers.referer;
  this.state.router = {
    index,
    auth,
    users,
    todos,
  };
  yield next;
});

// Errors
app.use(function * (next) {
  try {
    yield next;
    if (this.status === 404) this.throw(404);
  } catch (err) {
    this.status = err.status || 500;
    if (process.env.NODE_ENV === 'development') {
      yield this.render('error', {
        code: this.status,
        message: err.message,
        stack: err.stack
      });
    } else {
      yield this.render('error', {
        code: this.status,
        message: err.message
      });
    }
    this.app.emit('error', err, this);
  }
});

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: __dirname + '/tmp'
  }
}));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(csrfMdw);
app.use(xhrMdw);

// Load policies
require('./policies/todos')();
require('./policies/index')();

// Load routes
app.use(index.middleware());
app.use(auth.middleware());
app.use(users.middleware());
app.use(todos.middleware());
app.use(require('./routes/api/v1/users'));
app.use(require('./routes/api/v1/todos'));

// logger
// app.use(function * (next) {
//   const start = new Date;
//   yield next;
//   const ms = new Date - start;
//   console.log(`${this.method} ${this.url} - ${ms}`);
// });

// app.listen(config.port);






module.exports = app;