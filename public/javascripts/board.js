$(function(){
  var game_board = $('.game_board');
  var receive_message = function(data){
    var name = data.name;
    var message = data.message;
    var chat = data.chat;
    var chatbox = $("#"+chat+"-chat");
    chatbox.html(chatbox.html() +"<div class='chat_message'><b>"+name+"</b>: "+message+"</div>");
    chatbox.scrollTop(chatbox.scrollHeight);
  };

  $("#chat_tabs").on("click", "li", function(e){
    e.preventDefault();
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    $('.chat_messages').addClass("hidden");
    var chatbox = $("#"+$(this).data("chat")+"-chat");
    $(chatbox).removeClass("hidden");
    $(chatbox).scrollTop(chatbox.scrollHeight);
    $('#message #room').val($(this).data("chat"));
  });

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
      socket.on('games/'+game_id+'/message', receive_message);
    });
  }
  socket.on('games/lobby/message', receive_message);

  $('.body').on('click','.join_game, .login, .create_user, .request_move',function(e){
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
        else if(data.error) {
          animateErrorMessage(data.error);
        }
      }
    });
  });

  $('#create_game').click(function(e){
    e.preventDefault();
    var mode = $('#game_mode').find('option:selected').val();
    if(mode === 'ai'){
      var loading = $('.loading');
      loading.css({opacity: 0}).removeClass('hidden');
      loading.animate({opacity: 1},500);
    }
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
        else if(data.error) {
          animateErrorMessage(data.error);
          if(mode === 'ai'){
            loading.animate({opacity: 0},500,function(){
              loading.addClass('.hidden');
            });
          }
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
        else if(data.error) {
          animatedErrorMessage(data.error);
        }
      }
    }); 
  });

  $('body').on('click','.new_game',function(){
    var current = $(this);
    current.addClass('game_list_holder').removeClass('new_game');
    var games = [];
    $('.live_game').each(function(){
      games.push($(this).find('.game_board').attr('id'));
    });
    current.load('/games/game_list',{exclude: games});
  });

  $('.body').on('click','.add_game',function(){
    var id = $(this).attr('id');
    var holder = $(this).parents('.game_list_holder');
    var next = $(this).parents('.grid_4').nextAll('.grid_4').first().children().first();
    $(this).parent().load('/games/'+id+'/board',function(){
      $('#'+id).parent().css({opacity: 0});
      holder.removeClass('game_list_holder').addClass('live_game');
      next.css({opacity: 0});
      new Chess(id,socket);
      $('#'+id).parent().animate({opacity: 1},500);
      next.addClass('new_game').removeClass('board_selector').animate({opacity: 1},500);
    })
  });

  $('#message').submit(function(e){
    e.preventDefault();
    var game_id = $(this).find('#room').val();
    $.ajax({
      type: "POST",
      url: "/games/"+game_id+"/message",
      data: {message: $("#chat_input").val()},
      dataType: "json",
      success: function(data) {
        if(typeof data.error === 'undefined')
        {
          $("#chat_input").val("");
        }
        else
        {
          animateErrorMessage(data.error);
        }
      }
    });
  });

  $('#game_mode').change(function(){
    var mode = $(this).find('option:selected').val();
    var ai_field = $('.ai_field');
    var player_radios = $('.player_radios');
    if(mode === 'ai'){
      ai_field.find('input').val('');
      ai_field.removeClass('hidden');
      player_radios.find('input[value!="w"]').attr('disabled',true).prop('checked',false);
      player_radios.find('input[value="w"]').prop('checked',true);
    }else{
      ai_field.addClass('hidden');
      player_radios.find('input').attr('disabled',false);
    }
  });
});

function animateErrorMessage(text){
  var message = $('.message');
  message.text(text).css({opacity: 0}).removeClass('hidden').animate({opacity: 1}, 500, function(){
    setTimeout(function(){
      message.animate({opacity: 0},1000,function(){
        message.addClass('hidden').css({opacity: 1});
      });
    },1000);
  });
}
