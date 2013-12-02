$(function(){
  socket.on('lobby_message', function(data) {
    var name = data.name;
    var message = data.message;
    $("#chat_messages").append("<p>"+name+": "+message+"</p>");
    var objDiv = $('#chat_messages');
    if (objDiv.length > 0){
        objDiv[0].scrollTop = objDiv[0].scrollHeight;
    }
  });

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

  $('#lobby_message').on("submit", function(e){
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/lobby_message",
      data: {message: $("#chat_input").val()},
      dataType: "json",
      complete: function(data) {
        $("#chat_input").val("");
      }
    });
  })
});