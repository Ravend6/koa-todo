(function () {
  'use strict';

  var socket = io('http://localhost:3000/todos');

  // socket.on('connect', function () {
  //   console.log('connected todos');
  // });

  // socket.on('disconnect', function () {
  //   console.log('disconnected');
  // });

  // socket.emit('ok', {message: 'OK'});
  // socket.emit('chat message', 'hello bob');
  // socket.on('chat message', function (msg) {
  //   console.log(msg);
  // });

  // socket.on('new', function (data) {
  //   var todo = data.todo;
  //   var span;
  //   if (todo.done) {
  //     span = $('<span>', {
  //       text: todo.title,
  //       class: 'todo-done'
  //     });
  //   } else {
  //     span = $('<span>', {
  //       text: todo.title,
  //     });
  //   }
  //   var a = $('<a>', {
  //     href: '/todos/' + todo._id,
  //     html: span
  //   });
  //   var h2 =$('<h2>', {text: data.todo.title, html: a});
  //   var article = $('<article>', {html: h2, class: 'socket-todo'});
  //   $('#todos-list').prepend(article);
  // });
}());