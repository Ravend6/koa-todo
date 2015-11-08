'use strict';

module.exports = function (io) {
  var ioUsers = io.of('/users');
  io.on('connect', function (socket) {
    // socket.emit('new', {
    //   hello: 'world'
    // });
    // io.emit('new', { for: 'everyone' });
    // io.emit('new', { for: 'everyone' });

    socket.on('ok', function (data) {
      console.log('ioUsers', data.message);
    });
  });
  return ioUsers;
};