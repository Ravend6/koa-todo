(function () {
  'use strict';

  $('.users-delete').on('click', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/api/v1/users/' + $(this).data('id'),
      method: 'post',
      data: {
        _method: 'delete',
        _csrf: $(this).data('csrf')
      },
    }).done(function (data, status, req) {
      console.log(data);
    }).fail(function (err) {
      console.log(err);
    });
  });

  $('#load-token').on('click', function (e) {
    var token = $(this).data('token');
    $.ajax({
      url: '/api/v1/todos/token',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).done(function (data) {
      $('#token').text(data.data.token);
    });
  });

  // var socket = io('http://localhost:3000/users');

  // socket.on('connect', function () {
  //   console.log('connected users');
  // });

  // socket.on('disconnect', function () {
  //   console.log('disconnected');
  // });

  // socket.emit('ok', {
  //   message: 'OK'
  // });

  // socket.on('new', function (data) {
  //   console.log('new users', data);
  // });
}());

