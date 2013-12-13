module.exports.contains_bad_word = function(given_string) //Returns true if contains bad words , false otherwise
{
  //This array once contained all sorts of profanity
  //Given that this is an academic project, we did not feel that it was appropriate to include the array of profanity in our final submission
	var bad_words = ["badword", "bardword1", "badword3"];

	for(var x=0;x<bad_words.length;x++)
    {
      if(given_string.toLowerCase().indexOf(bad_words[x])>=0)
       {
        return true;
       }
    }

    return false;
};


module.exports.length_between = function(given_string,min,max) //Returns true if between (inclusive) two ints, false otherwise
{
  if(given_string.length >=min && given_string.length <=max)
    return true;

  return false;
};
