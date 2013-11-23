$(function(){
  var game_board = $('.game_board');
  if(game_board.length > 0){
    var game_id = game_board.attr('id');

    new Chess(game_id,socket);

    socket.on(game_id+'/join', function(data){
      if(data.color == 'b'){
        $('#black_player').text('Black: '+data.name);
      }else if(data.color == 'w'){
        $('#white_player').text('White: '+data.name);
      }
    });
  }
  socket.on('create',function(data){
    //Figure out how to render new rows
    $('#game_list').find('table').append(data.row);
  });
});
