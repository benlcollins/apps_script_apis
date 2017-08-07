// GitHub API <> Google Sheets
// currently just a straight http call
// need to build authenticated version of app to get better rate limits
//
// read more about api here: https://developer.github.com/v3/

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom GitHub Menu')
      .addItem('Get User Repos','getUserRepos')
      .addItem('Get Repo languages','getRepoLanguages')
      .addItem('Get GitHub Rate Limit','getGitHubRateLimit')
      .addToUi();
}


// get all the repos for username in google sheet
// cycle through, print out the repo names in sheet
// make into a drop down menu
// create a chart of languages used in the repo

function getUserRepos() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Github dashboard");
  var workings = ss.getSheetByName("workings");
  
  var username = sheet.getRange(3,2).getValue();
  sheet.getRange(5,2).clearContent();
  //Logger.log(username);
  
  var baseURL = "https://api.github.com/";
  
  var response = UrlFetchApp.fetch(baseURL + "users/" + username + "/repos");
  
  // Parse the JSON reply
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  var repoNames = [];
  
  data.forEach(function(elem) {
    repoNames.push([elem["name"]]);
  });
  
  Logger.log(repoNames);
  
  workings.getRange(1,1,repoNames.length,1).setValues(repoNames);
  
}


function getRepoLanguages() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Github dashboard");
  
  var username = sheet.getRange(3,2).getValue();
  var repoName = sheet.getRange(4,2).getValue();
  
  var baseURL = "https://api.github.com/repos/";
  
  var response = UrlFetchApp.fetch(baseURL + username + "/" + repoName + "/languages");
  
  // Parse the JSON reply
  var json = response.getContentText();  // string
  var data = JSON.parse(json);  // object
  
  Logger.log(typeof json);  // string
  Logger.log(json);  //  {"Ruby":53927,"HTML":47401,"CSS":25427,"JavaScript":667}
  Logger.log(json["Ruby"]);  // undefined
  
  Logger.log(typeof data);  // object
  Logger.log(data);  // {CSS=25427, JavaScript=667, HTML=47401, Ruby=53927}
  
  // create an array of index and key/value pairs
  var langs = Object.keys(data).map(function(key,index) {
    return [index + 1,key,data[key]];
  });
  
  Logger.log(langs);  // [[0, Ruby, 53927], [1, HTML, 47401], [2, CSS, 25427], [3, JavaScript, 667]]  <-- array of rows
  
  // clear any old repo language info
  sheet.getRange(9,1,500,3).clear();
  
  // paste in the new repo language info
  sheet.getRange(9,1,langs.length,3).setValues(langs);
  
  // format the index column to be centre aligned
  sheet.getRange(9,1,langs.length,1).setHorizontalAlignment('center');
  
}


function getGitHubRateLimit() {
  
  var response = UrlFetchApp.fetch("https://api.github.com/rate_limit");
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  Logger.log(json);
  Logger.log(data["resources"]["core"]["reset"]);
  
  //{"resources":{"core":{"limit":60,"remaining":0,"reset":1486061428},"search":{"limit":10,"remaining":10,"reset":1486061134}},"rate":{"limit":60,"remaining":0,"reset":1486061428}}
  
  var callsRemaining = data["resources"]["core"]["remaining"];
  var resetTime = data["resources"]["core"]["reset"];
  
  Logger.log(time(resetTime));
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Github dashboard");
  
  var remainingCell = sheet.getRange(5,2).clear();
  remainingCell.setValue(callsRemaining).setHorizontalAlignment('center');
  
}

function time(ms) {
    return new Date(ms).toLocaleString();
}




