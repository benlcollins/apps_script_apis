// add custom menu
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom GitHub Menu')
      .addItem('Get User Repos','getUserRepos')
      .addItem('Get repo commit statistics...','getGitHubStatistics')
      .addItem('Get rate quota','getGitHubRateLimit')
      .addToUi();
}


// https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository
// https://developer.github.com/v3/repos/statistics/#get-the-last-year-of-commit-activity-data

// TO DO:
// DRY - make a general function for calling the api


/***************************************/
// Get Rate limit
function getGitHubRateLimit() {
  // set up the service
  var service = getGithubService_();
  
  if (service.hasAccess()) {
    Logger.log("App has access.");
    
    var api = "https://api.github.com/rate_limit";
    
    var headers = {
      "Authorization": "Bearer " + getGithubService_().getAccessToken(),
      "Accept": "application/vnd.github.v3+json"
    };
    
    var options = {
      "headers": headers,
      "method" : "GET",
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(api, options);
    
    var json = JSON.parse(response.getContentText());
    var responseCode = response.getResponseCode();
    
    Logger.log(responseCode);
    
    Logger.log("You have " + json.rate.remaining + " requests left this hour.");
    
  }
  else {
    Logger.log("App has no access yet.");
    
    // open this url to gain authorization from github
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log("Open the following URL and re-run the script: %s",
        authorizationUrl);
  }
}



/***************************************/
// Get Repo Stats Data
// first time you run this you may get a 202 message back
// this means your data hasn't been cached by github
// but they will kick off a background worker to compile your stats
// run script again a few minutes later and you should get stats back
// read more at the top of this page in the docs:
// https://developer.github.com/v3/repos/statistics/#get-the-last-year-of-commit-activity-data
function getGitHubStatistics() {
  
  // set up the service
  var service = getGithubService_();
  
  if (service.hasAccess()) {
    Logger.log("App has access.");
    
    var api = "https://api.github.com/repos/benlcollins/apps_script/stats/commit_activity";
    
    var headers = {
      "Authorization": "Bearer " + getGithubService_().getAccessToken(),
      "Accept": "application/vnd.github.v3+json"
    };
    
    var options = {
      "headers": headers,
      "method" : "GET",
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(api, options);
    
    var json = JSON.parse(response.getContentText());
    var responseCode = response.getResponseCode();
    
    Logger.log(responseCode);
    
    Logger.log(json);
    
    outputWeeklyCommitStats(json);
    
  }
  else {
    Logger.log("App has no access yet.");
    
    // open this url to gain authorization from github
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log("Open the following URL and re-run the script: %s",
        authorizationUrl);
  }
}


function outputWeeklyCommitStats (data) {
  
  var outputArray = [];
  
  data.forEach(function(item,i) {
    var tempDaysArray = [];
    item.days.forEach(function(day) {
      tempDaysArray.push(day);
    })
    outputArray.push(tempDaysArray);
  });
  
  var newOutputArray = outputArray[0].map(function(col, i) {
    return outputArray.map(function(row) {
      return row[i];
    });
  });
  
  Logger.log(newOutputArray);
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Data');
  /*
  var testArray = [[0, 0, 0, 4, 3, 0, 0], 
                   [0, 8, 0, 0, 3, 0, 0], 
                   [1, 0, 0, 4, 3, 2, 0]];
  
  Logger.log(testArray[0]);
  
  var newTestArray = testArray[0].map(function(col, i) {
    return testArray.map(function(row) {
      return row[i];
    });
  });
  
  Logger.log(newTestArray);
  
  var testArray2 = [[0,0,1],
                    [0,8,9],
                    [0,0,0],
                    [4,0,4],
                    [3,3,3],
                    [0,0,2],
                    [0,0,0]];
  */
  sheet.getRange(4,2,7,52).setValues(newOutputArray);
  
}




/***************************************/
// Get Event Data
function getGitHubData() {
  
  // set up the service
  var service = getGithubService_();
  
  if (service.hasAccess()) {
    Logger.log("App has access.");
    
    // https://developer.github.com/v3/activity/events/#list-events-performed-by-a-user
    var api = "https://api.github.com/users/benlcollins/events";  
    
    
    
    var headers = {
      "Authorization": "Bearer " + getGithubService_().getAccessToken(),
      "Accept": "application/vnd.github.v3+json"
    };
    
    var options = {
      "headers": headers,
      "method" : "GET",
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(api, options);
    
    var json = JSON.parse(response.getContentText());
    var responseCode = response.getResponseCode();
    
    Logger.log(responseCode);
    
    json.forEach(function(item) {
      Logger.log("Repo update: " + item.repo.name + " at " + new Date(getDateFromIso(item.created_at)) + " of type " + item.type);
    });
  }
  else {
    Logger.log("App has no access yet.");
    
    // open this url to gain authorization from github
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log("Open the following URL and re-run the script: %s",
        authorizationUrl);
  }
}

