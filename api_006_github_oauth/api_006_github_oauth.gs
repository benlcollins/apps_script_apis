var CLIENT_ID = '';
var CLIENT_SECRET = '';

// add custom menu
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom GitHub Menu')
      .addItem('Get User Repos','getUserRepos')
      .addToUi();
}



// configure the service
function getGithubService_() {
  return OAuth2.createService('GitHub')
    .setAuthorizationBaseUrl('https://github.com/login/oauth/authorize')
    .setTokenUrl('https://github.com/login/oauth/access_token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('user');  // add other scopes as needed
}

// Logs the redict URI to register
// can also get this from File > Project Properties
function logRedirectUri() {
  var service = getGithubService_();
  Logger.log(service.getRedirectUri());
}


// handle the callback
function authCallback(request) {
  var githubService = getGithubService_();
  var isAuthorized = githubService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

// Step 1: call the github API and get list of repos associated with this account
function getUserRepos() {
  var service = getGithubService_();
  
  if (service.hasAccess()) {
    Logger.log("App has access.");
    var api = "https://api.github.com/users/benlcollins";  // first example for testing
    
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
    
    Logger.log(json);
  }
  else {
    Logger.log("App has no access yet.");
    
    // open this url to gain authorization from github
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log("Open the following URL and re-run the script: %s",
        authorizationUrl);
  }
}

