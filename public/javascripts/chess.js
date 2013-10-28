function Chess(id, fen) {
  var c = this;
  c.valid = $('#'+id).length == 1;
  if(c.valid){
    if(fen){
      c.logic = new ChessLogic(fen);
    }else {
      c.logic = new ChessLogic();
    }
    c.cells = $('#'+id).chessboard();
  }

  c.draw = function(){
    if(c.valid){
      var fen = c.logic.fen().split('');
      var column = 0;
      var row = 7;
      var index = 0;
      while(fen[index] !== ' '){
        //If it's a slash, start on the next row
        if(fen[index] === '/'){
          row--;
          column = 0;
          index++;
        }
        //If it's a number, we just want to draw that many blank spaces
        else if($.isNumeric(fen[index])){
          var spaces = parseInt(fen[index]);
          for(var i = 0; i < spaces; i++){
            c.cells[column][row].draw('blank');
            column++;
            if(column == 8){
              column = 0;
            }
          }
          index++;
        }
        //Otherwise it's a character and we can draw it
        else{
          c.cells[column][row].draw(fen[index]);
          column++;
          index++;
        }
      }
    }
  }
}
