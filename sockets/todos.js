'use strict';

module.exports = function (io) {
  var ioTodos = io.of('/todos');
  ioTodos.on('connect', function (socket) {
    // socket.on('chat message', function(msg){
    //   ioTodos.emit('chat message', msg);
    // });
    // socket.emit('new', {
    //   hello: 'world'
    // });
    // io.emit('new', { for: 'everyone' });
    // io.emit('new', { for: 'everyone' });

    // socket.on('ok', function (data) {
    //   console.log('ioTodos', data.message);
    // });
  });
  return ioTodos;
};