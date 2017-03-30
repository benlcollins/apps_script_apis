// add custom menu
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom GitHub Menu')
      .addItem('Get User Repos','getUserRepos')
      .addToUi();
}


// Step 1: call the github API and get list of repos associated with this account
function getGitHubData() {
  
  // set up the service
  var service = getGithubService_();
  
  if (service.hasAccess()) {
    Logger.log("App has access.");
    var api = "https://api.github.com/users/benlcollins/events";  // example
    
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
      Logger.log("Repo update: " + item.repo.name + " at " + item.created_at + " of type " + item.type);
    });
    //Logger.log("Repo update: " + json[0].repo.name + " at " + json[0].created_at); // example
  }
  else {
    Logger.log("App has no access yet.");
    
    // open this url to gain authorization from github
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log("Open the following URL and re-run the script: %s",
        authorizationUrl);
  }
}

