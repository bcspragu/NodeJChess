module.exports.contains_bad_word = function(given_string) //Returns true if contains bad words , false otherwise
{
	var bad_words = ["penis","vagina","fuck","nigger","douche","faggot","shit","dick","pussy","asshole","crap","poop","cunt"];

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
