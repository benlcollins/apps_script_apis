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
  var response = UrlFetchApp.fetch("https://itunes.apple.com/search?term=metallica&limit=200");
  
  // Parse the JSON reply
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  Logger.log(data);
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
  var response = UrlFetchApp.fetch("https://itunes.apple.com/search?term=" + artist + "&limit=200");
  
  // Parse the JSON reply
  var json = response.getContentText();
  return JSON.parse(json);
  
}


function displayArtistData() {
  
  // pick up the search term from the Google Sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  var artist = sheet.getRange(11,2).getValue();
  
  var tracks = calliTunesAPI(artist);
  
  var results = tracks["results"];
  
  var output = []
  
  results.forEach(function(elem,i) {
    var image = '=image("' + elem["artworkUrl60"] + '",4,60,60)';
    var hyperlink = '=hyperlink("' + elem["previewUrl"] + '","Listen to preview")';
    output.push([elem["artistName"],elem["collectionName"],elem["trackName"],image,hyperlink]);
    sheet.setRowHeight(i+15,65);
  });
  
  // sort by album
  var sortedOutput = output.sort( function(a,b) {
    
    var albumA = (a[1]) ? a[1] : 'Not known';
    var albumB = (b[1]) ? b[1] : 'Not known';
    
    if (albumA < albumB) {
      return -1;
    }
    else if (albumA > albumB) {
      return 1;
    }
    // names are equal
    return 0;
  });
  
  
  // return > 50 results
  
  //Logger.log(sortedOutput);
  
  sortedOutput.forEach(function(elem,i) {
    elem.unshift(i + 1);
    Logger.log(elem);
    Logger.log(i);
  });
  
  
  var len = sortedOutput.length;
  
  sheet.getRange(15,1,500,6).clearContent();
  
  sheet.getRange(15,1,len,6).setValues(sortedOutput);
  
  // formatting
  sheet.getRange(15,1,500,6).setVerticalAlignment("middle");
  sheet.getRange(15,5,500,1).setHorizontalAlignment("center");
  sheet.getRange(15,2,len,3).setWrap(true);
  
  
}


