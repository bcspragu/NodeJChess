function Chess(id, fen) {
  var c = this;
  var board = $('#'+id);
  c.valid = board.length == 1;
  c.currentPiece = null;

  c.draw = function(){
    if(c.valid){
      var fen = c.logic.fen().split('');
      var column = 0;
      var row = 0;
      var index = 0;
      while(fen[index] !== ' '){
        //If it's a slash, start on the next row
        if(fen[index] === '/'){
          row++;
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

  c.highlightMoves = function(moves){
    for(var i = 0; i < moves.length; i++){
      var column = moves[i].to.charCodeAt(0)-97;
      var row = parseInt(8-moves[i].to.charAt(1));
      debugger;
      c.cells[column][row].highlight('captured' in moves[i]);
    }
  }

  c.chessCell = function(x,y,cell_size){
    var paper = c.paper;
    var cell = paper.rect(x*cell_size,y*cell_size,cell_size,cell_size,3);
    var image = paper.image("images/pieces/blank.png", x*cell_size+cell_size*0.1, y*cell_size+cell_size*0.1, cell_size*0.8, cell_size*0.8);
    if((x+y) % 2 == 0){
      cell.attr({fill: 'white', 'stroke-width': 0}).data('color','white');
    }else{
      cell.attr({fill: '#04BAC2', 'stroke-width': 0}).data('color','#04BAC2');
    }

    //Labeling each cell with algebraic chess notation
    cell.data('column',String.fromCharCode(x+97));
    cell.data('row',8-y);
    cell.data('image', image);
    cell.data('highlighted', false);
    var c_mouseover = function(){
      if(!cell.data('highlighted')){
        cell.animate({fill: '#AAA'},250);
      }
    } 
    var c_mouseout = function(){
      if(!cell.data('highlighted')){
        cell.animate({fill: cell.data('color')},250);
      }
    }
    var c_click = function(){
      var board_loc = cell.boardPos();
      //If we select a highlighted cell
      if(cell.data('highlighted')){
        c.logic.move({from: c.currentPiece.boardPos(), to: cell.boardPos()});
        c.draw();
        var column = cell.boardPos().charCodeAt(0)-97;
        var row = parseInt(8-cell.boardPos().charAt(1));
        c.currentPiece = null;
        c.unhighlightAll();
      }
      //If there is a piece on that cell and it's their turn
      if(c.logic.get(board_loc) && c.logic.turn() === c.logic.get(board_loc).color){
        c.unhighlightAll();
        c.highlightMoves(c.logic.moves({square: board_loc, verbose: true}));
        c.currentPiece = cell;
      }
    }

    //Add our calls
    cell.mouseover(c_mouseover).mouseout(c_mouseout).click(c_click);
    image.mouseover(c_mouseover).mouseout(c_mouseout).click(c_click);

    //Cell Methods
    cell.boardPos = function(){
      return cell.data('column')+cell.data('row');
    }

    cell.draw = function(pieceCharacter){
      cell.data('image').attr({src: 'images/pieces/'+pieceCharacter+'.png'});
    }

    cell.highlight = function(isKill){
      if(isKill){
        cell.attr({fill: '#FF0000'});
      }else{
        cell.attr({fill: '#FFB800'});
      }
      cell.data('highlighted',true);
    }

    return cell
  }

  c.unhighlightAll = function(){
    for(var i = 0; i < 8; i++){
      for(var j = 0; j < 8; j++){
        var cell = c.cells[i][j];
        if(cell.data('highlighted')){
          cell.animate({fill: cell.data('color')},250);
          cell.data('highlighted',false);
        }
      }
    }
  }

  if(c.valid){
    if(fen){
      c.logic = new ChessLogic(fen);
    }else {
      c.logic = new ChessLogic();
    }
    var width = board.width();
    var cell_size = width/8;
    board.height(width);         //Make the board square
    c.paper = Raphael(board.get(0),width,width);
    c.cells = new Array(8);
    for(var i = 0; i < 8; i++){
      c.cells[i] = new Array(8);
    }
    for(var x = 0; x < 8; x++){
      for(var y = 0; y < 8; y++){
        c.cells[x][y] = c.chessCell(x,y,cell_size);
      }
    }
    c.paper.rect(0,0,width,width,3).attr({'stroke-width': 2, stroke: '#000'});
  }

}
