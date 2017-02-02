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
  
  Logger.log(json);  //  {"Ruby":53927,"HTML":47401,"CSS":25427,"JavaScript":667}
  
  Logger.log(data);  // {CSS=25427, JavaScript=667, HTML=47401, Ruby=53927}
  
  Logger.log(typeof data);  // object
  
  var langs = [];
 
  Object.keys(data).forEach(function(key,index) {
    langs.push([key,index]);
  });
  
  
}




