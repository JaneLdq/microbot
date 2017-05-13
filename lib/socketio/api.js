'use strict';

var http = require('http'),
  _ = require('lodash'),
  SocketIO = require('./socket.js');

let API = module.exports = class API {
  constructor(opts) {
    if (opts == null) {
      opts = {};
    }
    this.mcp = opts.mcp;

    this.defaults = {
      name: 'socketio',
      host: '127.0.0.1',
      port: '3000',
      auth: false,
      CORS: '*:*',
    };

    _.forEach(this.defaults, function(def, name) {
      this[name] = _.has(opts, name) ? opts[name] : def;
    }.bind(this), this);

  }

  start() {
    this.createServer();
    this.listen();
  }

  createServer() {
    this.server = this.http = http.createServer();
    this.socketio = this._newSocketIO();
  }

  listen() {
    this.server.listen(this.port, function() {
      this.socketio.start();
      this.socketio.io.set('origins', this.CORS || '*:*');
      console.log('SocketIO server listening at ' + this.host + ':' + this.port);
    }.bind(this));
  }

  _newSocketIO() {
    return new SocketIO(this.http, this.mcp);
  }

}
