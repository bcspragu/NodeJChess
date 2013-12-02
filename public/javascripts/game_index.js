$(function(){
  socket.on('create',function(data){
    //Put the new row in the correct location
    var name = data.name.toLowerCase();
    var table = $('#game_list').find('table');
    var rows = table.find('tr:not(:first)');
    var new_row = $(data.row);
    if(rows.length == 0 || rows.first().find('td:first').text().toLowerCase() > name){
      table.find('tr:first').after(new_row);
    }else{
      var added = false
      rows.each(function(){
        var game_name = $(this).find('td:first').text().toLowerCase();
        if(game_name > name){
          $(this).before(new_row);
          added = true;
          return false;
        }
      });
      if(!added){
        table.append(new_row);
      }
    }
  });
});
