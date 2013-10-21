Raphael.fn.chessSquare = function(x,y,cell_size){
  var cell = this.rect(x*cell_size,y*cell_size,cell_size,cell_size,3);
  if((x+y) % 2 == 0){
    cell.attr({fill: 'white', 'stroke-width': 0}).data('color','white');
  }else{
    cell.attr({fill: 'black', 'stroke-width': 0}).data('color','black');
  }

  //Labeling each cell with algebraic chess notation
  cell.data('column',String.fromCharCode(x+97));
  cell.data('row',8-y);

  cell.mouseover(function(){
    this.animate({fill: '#888'},250);
  })
  .mouseout(function(){
    this.animate({fill: this.data('color')},250);
  })
  .click(function(){
    var column = this.data('column');
    var row = this.data('row');
  });

  //Cell Methods
  cell.boardPos = function(){
    return cell.data('column')+cell.data('row');
  }

  return cell
}

$.fn.chessboard = function(start_fen){
  var width = this.width();
  var cell_size = width/8;
  this.height(width);         //Make the board square
  var paper = Raphael(this.get(0),width,width);
  var cells = new Array(8);
  for(var i = 0; i < 8; i++){
    cells[i] = new Array(8);
  }
  for(var x = 0; x < 8; x++){
    for(var y = 0; y < 8; y++){
      cells[x][y] = paper.chessSquare(x,y,cell_size);
    }
  }
  paper.rect(0,0,width,width,3).attr({'stroke-width': 2, stroke: '#000'});
}
