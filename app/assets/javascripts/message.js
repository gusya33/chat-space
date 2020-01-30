$(function(){
  function buildHTML(message){
    if ( message.image && message.content ) {
      var html =
      `<div class="message" data-message-id=${message.id}>
        <div class="message__member">
          ${message.user_name}
          <div class="message__time">
            ${message.created_at}
          </div>
        </div>
        <div class="message__comment">
          <p class="lower-message__content">
            ${message.content}
          </p>
        </div>
      </div>
        <img src=${message.image} >`
    } else if ( message.image ) {
      var html =
       `<div class="message" data-message-id=${message.id}>
          <div class="message__member">
            <div class="message__member">
              ${message.user_name}
            </div>
            <div class="message__time">
              ${message.created_at}
            </div>
          </div>
          <div class="lower-message">
            <img class = "lower-message__image" src = "${message.image}">
          </div>
        </div>`
    } else if ( message.content ) {
      var html =
        `<div class="message" data-message-id=${message.id}>
          <div class="message__member">
            ${message.user_name}
            <div class="message__time">
              ${message.created_at}
            </div>
          </div>
          <div class="message__comment">
            <p class="lower-message__content">
              ${message.content}
            </p>
          </div>
        </div>`
    };
      return html;
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
     .done(function(data){
       var html = buildHTML(data);
       $('.main-chat__member').append(html);
       $('.main-chat__member').animate({ scrollTop: $('.main-chat__member')[0].scrollHeight});
       $('form')[0].reset();
       $('.submit-btn').prop('disabled', false);
     })
     .fail(function() {
      alert("メッセージ送信に失敗しました");
     });
  });

  var reloadMessages = function() {
    last_message_id = $('.message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
      var insertHTML = '';
      $.each(messages, function(i, message) {
        insertHTML += buildHTML(message)
      });
      $('.main-chat__member').append(insertHTML);
      $('.main-chat__member').animate({ scrollTop: $('.main-chat__member')[0].scrollHeight});
      }
    })
    .fail(function() {
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});