function Chess(id,socket) {
  var c = this;
  c.board = $('#'+id);
  c.valid = c.board.length == 1;
  c.currentPiece = null;
  c.socket;
  c.pieceList = {} //Hash to hold all the pieces on the board

  c.changePiece = function(board_loc, piece){
    for(var loc in c.pieceList){
      if(loc === board_loc){
        c.pieceList[loc].attr({src: '/images/pieces/'+piece+'.png'});
        break;
      }
    }
  }

  c.movePiece = function(move){
    var pieceToMove = c.pieceList[move.from];

    //Killing a piece
    if(typeof c.pieceList[move.to] !== 'undefined'){
      c.pieceList[move.to].remove();
      delete c.pieceList[move.to];
    }

    var padding = c.cell_size*0.1;
    var from_column = move.from.charCodeAt(0)-97;
    var from_row = 8-parseInt(move.from.charAt(1));
    var column = move.to.charCodeAt(0)-97;
    var row = parseInt(8-move.to.charAt(1));
    var xloc = column*c.cell_size + padding;
    var yloc = row*c.cell_size + padding;
    
    if(move.piece == 'n'){
      var from_x = from_column*c.cell_size + padding;
      var from_y = from_row*c.cell_size + padding;
      var x_diff = Math.abs(xloc - from_x);
      var y_diff = Math.abs(yloc - from_y);
      if(x_diff > y_diff){
        pieceToMove.animate({x: xloc},125,function(){
          pieceToMove.animate({y: yloc},125);
        });
      }else{
        pieceToMove.animate({y: yloc},125,function(){
          pieceToMove.animate({x: xloc},125);
        });
      }
    }else{
      pieceToMove.animate({x: xloc, y: yloc},250);
    }
    pieceToMove.boardPos = function(){
      return move.to;
    }
    pieceToMove.unclick(c.cells[from_column][from_row].c_click);
    pieceToMove.click(c.cells[column][row].c_click);

    pieceToMove.unmouseover(c.cells[from_column][from_row].c_mouseover);
    pieceToMove.mouseover(c.cells[column][row].c_mouseover);

    pieceToMove.unmouseout(c.cells[from_column][from_row].c_mouseout);
    pieceToMove.mouseout(c.cells[column][row].c_mouseout);
    c.pieceList[move.to] = pieceToMove;
    delete c.pieceList[move.from];

    //En passant
    if(move.flags === 'e'){
      for(var loc in c.pieceList){
        if(c.logic.get(loc) === null){
          c.pieceList[loc].remove();
          delete c.pieceList[loc];
          break;
        }
      }
    }

    //Castling
    if(move.flags === 'k' || move.flags === 'q'){
      for(var loc in c.pieceList){
        if(c.logic.get(loc) === null){
          var from_column = loc.charCodeAt(0)-97;
          var from_row = 8-parseInt(loc.charAt(1));
          var fromLoc = loc;
          pieceToMove = c.pieceList[loc];
          break;
        }
      }
      for(var i = 0; i < 64; i++){
        var row = i % 8;
        var column = Math.floor(i/8);
        var pos = String.fromCharCode(column + 97)+(row + 1).toString();
        if(c.logic.get(pos) !== null && typeof c.pieceList[pos] === 'undefined'){
          var toLoc = pos;
        }
      }

      var column = toLoc.charCodeAt(0)-97;
      var row = 8-parseInt(toLoc.charAt(1));
      var xloc = column*c.cell_size + padding;
      var yloc = row*c.cell_size + padding;
      
      pieceToMove.animate({x: xloc, y: yloc},250);
      pieceToMove.boardPos = function(){
        return toLoc;
      }
      pieceToMove.unclick(c.cells[from_column][from_row].c_click);
      pieceToMove.click(c.cells[column][row].c_click);

      pieceToMove.unmouseover(c.cells[from_column][from_row].c_mouseover);
      pieceToMove.mouseover(c.cells[column][row].c_mouseover);

      pieceToMove.unmouseout(c.cells[from_column][from_row].c_mouseout);
      pieceToMove.mouseout(c.cells[column][row].c_mouseout);
      c.pieceList[toLoc] = pieceToMove;
      delete c.pieceList[fromLoc];
    }
  }

  c.drawInitial = function(){
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
        //If it's a number, we just want to skip that many blank spaces
        else if($.isNumeric(fen[index])){
          var spaces = parseInt(fen[index]);
          for(var i = 0; i < spaces; i++){
            //Don't draw anything on a blank space
            column++;
            if(column == 8){
              column = 0;
            }
          }
          index++;
        }
        //Otherwise it's a character and we can draw it
        else{
          c.drawPiece(fen[index],row,column);
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
      c.cells[column][row].highlight(moves[i]);
    }
  }

  c.chessCell = function(x,y){
    var paper = c.paper;
    var cell = paper.rect(x*c.cell_size,y*c.cell_size,c.cell_size,c.cell_size,3);
    if((x+y) % 2 == 0){
      cell.attr({fill: 'white', 'stroke-width': 0}).data('color','white');
    }else{
      cell.attr({fill: '#04BAC2', 'stroke-width': 0}).data('color','#04BAC2');
    }

    //Labeling each cell with algebraic chess notation
    cell.data('column',String.fromCharCode(x+97));
    cell.data('row',8-y);
    cell.data('highlighted', false);
    cell.data('promotion', false);
    cell.data('move', null);
    cell.c_mouseover = function(){
      if(!cell.data('highlighted')){
        cell.animate({fill: '#AAA'},250);
      }
    } 
    cell.c_mouseout = function(){
      if(!cell.data('highlighted')){
        cell.animate({fill: cell.data('color')},250);
      }
    }
    cell.c_click = function(){
      var board_loc = cell.boardPos();
      //If we select a highlighted cell
      var promotion = '';
      if(cell.data('highlighted')){
        if(cell.data('promotion')){
          promotion = prompt('What would you like to promote to? (q,r,b,n)');
          var move = c.logic.move({from: cell.data('move').from, to: cell.data('move').to, promotion: promotion});
        }else{
          var move = c.logic.move(cell.data('move').san);
        }
        $.post('/games/'+id+'/move',{fen: c.logic.fen(), move: move});
        var column = cell.boardPos().charCodeAt(0)-97;
        var row = parseInt(8-cell.boardPos().charAt(1));
        c.currentPiece = null;
        c.unhighlightAll();
      }
      //If there is a piece on that cell and it's their turn
      if(c.logic.get(board_loc) && c.logic.turn() === c.logic.get(board_loc).color && $.inArray(c.logic.turn(),c.player_color) != -1){
        c.unhighlightAll();
        c.highlightMoves(c.logic.moves({square: board_loc, verbose: true}));
        c.currentPiece = cell;
      }
    }

    //Add our calls
    cell.mouseover(cell.c_mouseover).mouseout(cell.c_mouseout).click(cell.c_click);

    //Cell Methods
    cell.boardPos = function(){
      return cell.data('column')+cell.data('row');
    }

    cell.highlight = function(move){
      if('promotion' in move){
        cell.attr({fill: '#0000FF'});
        cell.data('promotion',true);
      }
      else if('captured' in move){
        cell.attr({fill: '#FF0000'});
      }else{
        cell.attr({fill: '#FFB800'});
      }
      cell.data('highlighted',true);
      cell.data('move',move);
    }

    return cell
  }

  c.drawPiece = function(piece,row,column){
    var size = c.cell_size*0.8;
    var padding = c.cell_size*0.1;
    var xloc = column*c.cell_size + padding;
    var yloc = row*c.cell_size + padding;
    var piece = c.paper.image('/images/pieces/'+piece+'.png', xloc, yloc, size, size);
    var pos = c.cells[column][row].boardPos();
    piece.click(c.cells[column][row].c_click);
    piece.mouseover(c.cells[column][row].c_mouseover);
    piece.mouseout(c.cells[column][row].c_mouseout);
    piece.boardPos = function(){
      return pos;
    }
    c.pieceList[pos] = piece;
  }

  c.reloadPlayer = function(data){
    c.player_color = data.color;
  }

  c.unhighlightAll = function(){
    for(var i = 0; i < 8; i++){
      for(var j = 0; j < 8; j++){
        var cell = c.cells[i][j];
        if(cell.data('highlighted')){
          cell.animate({fill: cell.data('color')},250);
          cell.data('highlighted',false);
          cell.data('promotion',false);
          cell.data('move',null);
        }
      }
    }
  }

  c.setStatus = function(stat){
    if(stat !== ''){
        c.message.attr({text: stat}).animate({opacity: 0.75},250);
    }
    else if(typeof(stat) !== 'undefined'){
      c.message.animate({opacity: 0},250,function(){
        c.message.attr({text: ''});
      });
    }
  }

  c.checkStatus = function(){
    $.post('/games/'+id+'/check',function(data){
      c.setStatus(data.checkStatus);
    });
  }

  if(c.valid){
    //Load the game
    $.post('/games/'+id+'/info',function(data){
      c.socket = socket;
      c.player_color = data.player_color;
      c.start_fen = data.fen;
      c.logic = new ChessLogic(c.start_fen);
      c.width = c.board.width();
      c.cell_size = c.width/8;
      c.board.height(c.width);         //Make the board square
      c.paper = Raphael(c.board.get(0),c.width,c.width);
      c.cells = new Array(8);
      for(var i = 0; i < 8; i++){
        c.cells[i] = new Array(8);
      }
      for(var x = 0; x < 8; x++){
        for(var y = 0; y < 8; y++){
          c.cells[x][y] = c.chessCell(x,y);
        }
      }
      c.paper.rect(0,0,c.width,c.width,3).attr({'stroke-width': 2, stroke: '#000'});
      c.drawInitial();
      c.message = c.paper.text(c.width/2,c.width/2,'').attr(
        {
          'font-size': 100*(c.width/1000),
          opacity: 0
        }).transform('r-30,'+c.width/2+','+c.width/2);
      c.checkStatus();
      c.socket.on(id+'/move', function (data) {
        var is_ai = !!data.ai;
        if(!is_ai){
          var pc = data.fen.split(" ")[1] === 'w' ? "White" : "Black";
        }else{
          var pc = "White";
        }
        $('#'+id).parent().find('.c_turn').text(pc);
        c.logic.load(data.fen);
        c.movePiece(data.move);
        c.setStatus(data.checkStatus);
        if(typeof data.move.promotion !== 'undefined'){
          if(pc === 'Black'){
            data.move.promotion = data.move.promotion.toUpperCase();
          }
          c.changePiece(data.move.to, data.move.promotion);
        }
      });
    },'json');
  }

}
