//Locations are between 0 and 7
module.exports.chess960row = function(){
  var locations = [];
  var pieces = Array(8);
  for(var i = 0; i < 8; i++){
    locations.push(i);
  }
  //First int 0,2,4,6
  var loc = Math.floor(Math.random() * 4)*2;
  pieces[loc] = 'b';
  locations.splice(locations.indexOf(loc),1);
  //Second int 1,3,5,7
  loc = Math.floor(Math.random() * 4)*2+1;
  pieces[loc] = 'b';
  locations.splice(locations.indexOf(loc),1);
  var qnn = 'qnn'.split('');
  locations = shuffle(locations);
  for(var i = 0; i < qnn.length; i++){
    var loc = locations.pop();
    pieces[loc] = qnn[i];
  }
  locations = locations.sort();
  loc = locations.pop();
  pieces[loc] = 'r';
  loc = locations.pop();
  pieces[loc] = 'k';
  loc = locations.pop();
  pieces[loc] = 'r';
  return pieces.join('');
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
