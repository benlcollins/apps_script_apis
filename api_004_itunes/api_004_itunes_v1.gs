// --------------------------------------------------------------------------------------------------

// Step 1: Most basic call to the API 

// --------------------------------------------------------------------------------------------------

function calliTunes() {
  
  // Call the iTunes API
  var response = UrlFetchApp.fetch("https://itunes.apple.com/search?term=jack+johnson&limit=5");
  Logger.log(response.getContentText());
}


// --------------------------------------------------------------------------------------------------

// Step 2: Parse the response 

// --------------------------------------------------------------------------------------------------

function calliTunes2() {
  
  // Call the Star Wars API
  var response = UrlFetchApp.fetch("https://itunes.apple.com/search?term=jack+johnson&limit=5");
  
  // Parse the JSON reply
  var json = response.getContentText();
  var data = JSON.parse(json);
  Logger.log(data);
  
}