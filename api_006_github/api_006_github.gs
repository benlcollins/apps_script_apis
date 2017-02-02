// GitHub API <> Google Sheets
// currently just a straight http call
// need to build authenticated version of app to get better rate limits
//
// read more about api here: https://developer.github.com/v3/

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom GitHub Menu')
      .addItem('Get User Repos','getUserRepos')
      .addToUi();
}


function callGitHub() {
  
  // Call the GitHub API with username
  var response = UrlFetchApp.fetch("https://api.github.com/users/benlcollins");
  //Logger.log(response.getContentText());
  
  // Call the GitHub API with username repos
  var repos = UrlFetchApp.fetch("https://api.github.com/users/benlcollins/repos");
  //Logger.log(repos.getContentText());
  
  // Call the GitHub API with username with specific repo
  var githubViz = UrlFetchApp.fetch("https://api.github.com/repos/benlcollins/github_api_viz");
  //Logger.log(githubViz.getContentText());
  
  // Call the GitHub API with username with specific repo languages
  var languages = UrlFetchApp.fetch("https://api.github.com/repos/benlcollins/github_api_viz/languages");
  Logger.log(languages.getContentText());
  
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
  
  //Logger.log(data.length);  // 27
  //Logger.log(data[0]);
  
  var repoNames = [];
  
  data.forEach(function(elem) {
    repoNames.push([elem["name"]]);
  });
  
  Logger.log(repoNames);
  
  workings.getRange(1,1,repoNames.length,1).setValues(repoNames);
  
  // To Do:
  // fetch only returns 30 repos at the moment. Collect more, or keep calling api until comes back with no extra repos
  // https://developer.github.com/v3/#pagination
  
}


function getRepoLanguages() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Github dashboard");
  
  var username = sheet.getRange(3,2).getValue();
  var repoName = sheet.getRange(5,2).getValue();
  
  var baseURL = "https://api.github.com/repos/";
  
  var response = UrlFetchApp.fetch(baseURL + username + "/" + repoName + "/languages");
  
  // Parse the JSON reply
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  Logger.log(typeof json);  // object
  Logger.log(json);  //  {"Ruby":53927,"HTML":47401,"CSS":25427,"JavaScript":667}
  Logger.log(json["Ruby"]);
  
  Logger.log(typeof data);  // object
  Logger.log(data);  // {CSS=25427, JavaScript=667, HTML=47401, Ruby=53927}
  
  
  
  var langs = [];
 
  Object.keys(json).forEach(function(key,index) {
    langs.push([key,index]);
  });
  
  
}


function getGitHubRateLimit() {
  
  var response = UrlFetchApp.fetch("https://api.github.com/rate_limit");
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  Logger.log(json);
  Logger.log(data["resources"]["core"]["reset"]);
  
  //{"resources":{"core":{"limit":60,"remaining":0,"reset":1486061428},"search":{"limit":10,"remaining":10,"reset":1486061134}},"rate":{"limit":60,"remaining":0,"reset":1486061428}}
  
  var resetTime = data["resources"]["core"]["reset"];
  
  Logger.log(time(resetTime));
  
}

function time(ms) {
    return new Date(ms).toLocaleString();
}




