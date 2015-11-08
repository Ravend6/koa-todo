var setNotify = (function () {
  'use strict';

  var notify = $('#flash-notify');
  // var li = notify.find('li');
  var p = notify.find('p');
  setNotify(p.data('type'), p.text());
  // li.each(function (index, element) {
  //    setNotify($(this).data('type'), $(this).text());
  // });

  function setNotify(messageType, message) {

    var ico;
    switch (messageType) {
      case "success":
        ico = 'glyphicon glyphicon-ok-sign';
        break;
      case "danger":
        ico = 'glyphicon glyphicon-remove-sign';
        break;
      case "info":
        ico = 'glyphicon glyphicon-info-sign';
        break;
      case "warning":
        ico = 'glyphicon glyphicon-question-sign';
        break;
    }

    if (message) {
      $.notify({
        message: message
      }, {
          // settings
          element: 'body',
          position: null,
          type: messageType,
          allow_dismiss: true,
          newest_on_top: false,
          showProgressbar: false,
          placement: {
            from: "top",
            align: "right"
          },
          offset: 20,
          spacing: 10,
          z_index: 1031,
          delay: 4000,
          timer: 1000,
          url_target: '_blank',
          mouse_over: null,
          animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
          },
          onShow: null,
          onShown: null,
          onClose: null,
          onClosed: null,
          icon_type: 'class',
          template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
          '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
          '<span data-notify="icon"><span class="' + ico + '" aria-hidden="true"></span></span> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'
        });
    }
  }
  return setNotify;
} ());

