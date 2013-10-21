function Chess(id, fen) {
  if($('#'+id).length == 1){
    if(fen){
      this.logic = new ChessLogic(start_fen);
    }else {
      this.logic = new ChessLogic();
    }
    $('#'+id).chessboard();
  }
}
