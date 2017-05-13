const socketIO = require('socket.io'),
  _ = require('lodash');

/**
 * WebSocket class
 * @constructor WebSocket
 * @param {Object} [opts] http server options
 * @param {String} [opts.port] port to listen client requests
 * @param {Object} [service] the service this server belongs to
 * @return {HttpServer} new HttpService instance
 */
const Socket = module.exports = class Socket {
  constructor(http, mcp) {
    this.http = http;
    this.mcp = mcp;
    this.io = {};
    this.nsp = {}; //namespace
  }

  /**
   * Start the WebSocket class
   * @return {void}
   */
  start() {
    this.io = this._io();
    this.io.on('connection', function(socket) {
      console.log('A user connected');

      socket.on('disconnect', function() {
        console.log('A user disconnected');
      });
      // console.log('~~~~~~~~~~~~~~');
      // console.log(this.mcp);
      this.socketMCP();
      this.socketRobots(this.mcp);

      this.socketDevices(this.mcp);

      // _.forIn(this.mcp.robots, function(robot) {
      //   this.socketDevices(robot);
      // }, this);

    }.bind(this));
  }

  socketDevices(robot) {
    console.log('Setting up device sockets...');
    // console.log(robot.devices);

    var robotName = robot.name,
      nsp = '/api/robot/' + robotName + '/devices/';

    this._socketItems(nsp, robot.devices, this._addDefaultListeners.bind(this));
  }

  socketRobots(robots) {
    console.log('Setting up robot sockets...');

    var callback = function(socket, nspRoute, robot) {
      var devices = _.keys(robot.devices);

      socket.on('devices', function() {
        this.nsp[nspRoute].emit('devices', devices);
      }.bind(this));

      this._addDefaultListeners(socket, nspRoute, robot);

      this.nsp[nspRoute].emit('devices', devices);
    }.bind(this);

    var robotName = robots.name;
    var items = {};
    items[robotName] = robots;
    this._socketItems('/api/robot/', items, callback);
  }



  _io() {
    return socketIO(this.http);
  }

  socketMCP() {
    console.log('Setting up API socket...');

    var callback = function(socket, nspRoute, mcp) {
      var mcpJSON = mcp.toJSON();
      var nsp = this.nsp[nspRoute];

      var robotNames = _.map(mcp.robots, function(val, key) {
        return key;
      });

      socket.on('/', function() {
        nsp.emit('/', mcpJSON);
      });

      socket.on('robots', function() {
        nsp.emit('robots', robotNames);
      });

      this._addDefaultListeners(socket, nspRoute, mcp);

      nsp.emit('/', mcpJSON);
    }.bind(this);

    this._socketItems('/api', {
      '': this.mcp
    }, callback);
  }

  _socketItems(nsp, items, callback) {
    _.forEach(items, function(item, name) {
      var nspAndName;

      nspAndName = nsp + name;
      console.log('======');
      console.log(nsp);
      console.log(name);

      if (!this.nsp[nspAndName]) {
        console.log('Creating new Socket for: ' + nspAndName);

        this.nsp[nspAndName] = this.io.of(nspAndName);

        this.nsp[nspAndName].on('connection', function(socket) {
          console.log('User connected to socket: ', nspAndName);

          socket.on('disconnect', function() {
            console.log('User disconnected from socket: ', nspAndName);
          });

          callback(socket, nspAndName, item);
        });
      }

    }.bind(this), this);
  }

  _addDefaultListeners(sck, nspRoute, item) {
    var nspSocket = this.nsp[nspRoute];
    console.log('HHHHH');
    console.log(sck);
    sck.on('commands', function() {
      this._emitList(nspSocket, 'commands', _.keys(item.commands));
    }.bind(this));

    sck.on('events', function() {
      this._emitList(nspSocket, 'events', item.events);
    }.bind(this));

    if (item.commands) {
      item.commands.loopback = function(opts) {
        return opts;
      };

      item.commands.command = function(opts) {
        return item.commands[opts.name].apply(item, opts.args);
      };
    }

    _.forIn(item.commands, function(command, cname) {
      sck.on(cname, function() {
        var data = command.apply(item, arguments);
        this._nspEmit(nspSocket, {
          name: cname,
          type: 'command',
          data: data
        });
      }.bind(this));
    }, this);

    _forIn(item.events, function(eName) {
      if (item.listeners(eName).length < 1) {
        item.on(eName, function(data) {
          this._nspEmit(nspSocket, {
            name: eName,
            type: 'event',
            data: data
          });
          nspSocket.emit(eName, data);
        }.bind(this));
      }
    }, this);

  }

  _nspEmit(socket, payload) {
    socket.emit('message', payload);
    socket.emit(payload.type, {
      name: payload.name,
      data: payload.data
    });
  }

  _emitList(socket, name, data) {
    socket.emit('message', {
      name: name,
      type: 'command',
      data: data
    });

    socket.emit(name, data);
  }
}
