Raphael.fn.chessSquare = function(x,y,cell_size){
  var cell = this.rect(x*cell_size,y*cell_size,cell_size,cell_size,5);
  if((x+y) % 2 == 0){
    cell.attr({fill: 'white', 'stroke-width': 0}).data('color','white');
  }else{
    cell.attr({fill: 'black', 'stroke-width': 0}).data('color','black');
  }
  cell.mouseover(function(){
    this.animate({fill: 'grey'},250);
  })
  .mouseout(function(){
    this.animate({fill: cell.data('color')},250);
  });
}

$.fn.chessboard = function(){
  var width = this.width();
  var cell_size = width/8;
  this.height(width);         //Make the board square
  var paper = Raphael(this.get(0),width,width);
  for(var x = 0; x < 8; x++){
    for(var y = 0; y < 8; y++){
      var cell = paper.chessSquare(x,y,cell_size);
    }
  }
  paper.rect(0,0,width,width,5).attr({'stroke-width': 2, stroke: '#000'});
}
