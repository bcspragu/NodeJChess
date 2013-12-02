$(function(){
  var game_board = $('.game_board');
  if(game_board.length > 0){
    game_board.each(function(){
      var game_id = $(this).attr('id');
      new Chess(game_id,socket);
      socket.on(game_id+'/join', function(data){
        var board = $('#'+data.id);
        if(data.color == 'b'){
          board.parent().find('.black_name').text(data.name);
        }else if(data.color == 'w'){
          board.parent().find('.white_name').text(data.name);
        }
      });
    });

  }

  $('.body').on('click','.join_game, #create_game, .login, .create_user',function(e){
    e.preventDefault();
    var form = $(this).parents('form');
    var url = form.attr('action');
    $.ajax({
      type: "POST",
      url: url,
      data: form.serialize(),
      dataType: "json",
      success: function(data) {
        if (data.redirect) {
          window.location.href = data.redirect;
        }
        else {
          $(".message").text(data.error).removeClass('hidden');
        }
      }
    }); 
  });

  $('.quit_game').click(function(e){
    e.preventDefault();
    var url = $(this).attr('href');
    $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      success: function(data) {
        if (data.redirect) {
          window.location.href = data.redirect;
        }
        else {
          $(".message").text(data.error).removeClass('hidden');
        }
      }
    }); 
  });

  $('body').on('click','.new_game',function(){
    var current = $(this);
    var next = current.parent().next().find('.board_selector');
    current.removeClass('new_game');
    current.load('/games/game_list');
    //next.removeClass('board_selector').addClass('new_game');
  });

  socket.on('games/'+$("#game_id").val()+'/message', function(data) {
    var name = data.name;
    var message = data.message;
    $("#game_chat_messages").append("<p>"+name+": "+message+"</p>");
    var objDiv = $('#game_chat_messages');
    if (objDiv.length > 0){
      objDiv[0].scrollTop = objDiv[0].scrollHeight;
    }
  });

  $('#game_message').on("submit", function(e){
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/games/"+$("#game_id").val()+"/message",
      data: {message: $("#chat_input").val()},
      dataType: "json",
      complete: function(data) {
        $("#chat_input").val("");
      }
    });
  })
});
