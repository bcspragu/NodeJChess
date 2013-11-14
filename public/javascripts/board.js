$(function(){
  var game_board = $('.game_board');
  if(game_board.length > 0){
    var game_id = game_board.attr('id');
    new Chess(game_id);
  }
});
