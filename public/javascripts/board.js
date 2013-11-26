$(function(){
  var game_board = $('.game_board');
  if(game_board.length > 0){
    game_board.each(function(){
      var game_id = $(this).attr('id');
      new Chess(game_id,socket);
      socket.on(game_id+'/join', function(data){
        var board = $('#'+data.id);
        if(data.color == 'b'){
          board.find('.black_name').text(data.name);
        }else if(data.color == 'w'){
          board.find('.white_name').text(data.name);
        }
      });
    });

  }
  socket.on('create',function(data){
    $('#game_list').find('table').append(data.row);
  });
});
