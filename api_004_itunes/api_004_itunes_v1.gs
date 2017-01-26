function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom iTunes Menu')
      .addItem('Get Artist Data','displayArtistData')
      .addToUi();
}


// --------------------------------------------------------------------------------------------------
//
// Step 1: Most basic call to the API 
//
// --------------------------------------------------------------------------------------------------

function calliTunes() {
  
  // Call the iTunes API
  var response = UrlFetchApp.fetch("https://itunes.apple.com/search?term=coldplay&limit=5");
  Logger.log(response.getContentText());
}


// --------------------------------------------------------------------------------------------------
//
// Step 2: Parse the response 
//
// --------------------------------------------------------------------------------------------------

function calliTunes2() {
  
  // Call the iTunes API
  var response = UrlFetchApp.fetch("https://itunes.apple.com/search?term=coldplay&limit=25");
  
  // Parse the JSON reply
  var json = response.getContentText();
  var data = JSON.parse(json);
  //Logger.log(data["results"][0]);
  Logger.log(data["results"][0]["artistName"]);
  Logger.log(data["results"][0]["collectionName"]);
  Logger.log(data["results"][0]["artworkUrl60"]);
  Logger.log(data["results"][0]["previewUrl"]);
  
  Logger.log(data["results"][3]);
  Logger.log("New");
  Logger.log(data["results"][7]);
  
}


// --------------------------------------------------------------------------------------------------
//
// Step 3: Output the results
//
// --------------------------------------------------------------------------------------------------

function calliTunesAPI(artist) {
  
  // Call the iTunes API
  var response = UrlFetchApp.fetch("https://itunes.apple.com/search?term=" + artist);
  
  // Parse the JSON reply
  var json = response.getContentText();
  return JSON.parse(json);
  
}


function displayArtistData() {
  
  // pick up the search term from the Google Sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  var artist = sheet.getRange(12,2).getValue();
  
  var tracks = calliTunesAPI(artist);
  
  var results = tracks["results"];
  
  var output = []
  
  results.forEach(function(elem,i) {
    var image = '=image("' + elem["artworkUrl60"] + '",4,60,60)';
    output.push([i+1,elem["artistName"],elem["collectionName"],elem["trackName"],image,elem["previewUrl"]]);
    sheet.setRowHeight(i+15,65);
  });
  
  /*
  var unique = output.filter(function(elem,i,self) {
    return i == self.indexOf(elem);
  });
  Logger.log(unique);
  */
  
  Logger.log(output);
  
  var len = output.length;
  
  sheet.getRange(15,1,500,6).clearContent();
  
  sheet.getRange(15,1,len,6).setValues(output);
  
  // formatting
  sheet.getRange(15,1,500,6).setVerticalAlignment("middle");
  sheet.getRange(15,5,500,1).setHorizontalAlignment("center");
  sheet.getRange(15,2,len,3).setWrap(true);
  
  
}


