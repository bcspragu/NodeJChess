$.fn.chessboard = function(){
  var width = this.width();
  this.height(width);         //Make the board square
  var paper = Raphael(this.get(),width,width);
  //Then do shit with the paper
}
