var CLIENT_ID = '...';
var CLIENT_SECRET = '...';

/*
 * Based on the following work by others;
 * https://mashe.hawksey.info/2015/10/setting-up-oauth2-access-with-google-apps-script-blogger-api-example/
 * https://github.com/googlesamples/apps-script-oauth2
 * https://developers.google.com/blogger/docs/3.0/getting_started
 *
 **/


// configure the service
function getBloggerService_() {
  return OAuth2.createService('Blogger')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('https://www.googleapis.com/auth/blogger');  // this is blogger scope
}

// Logs the redict URI to register
// run this to get the necessary redirect URI for the OAuth
function logRedirectUri() {
  var service = getBloggerService_();
  Logger.log(service.getRedirectUri());
}


// handle the callback
function authCallback(request) {
  var bloggerService = getBloggerService_();
  var isAuthorized = bloggerService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

// call the blogger API
// based on https://mashe.hawksey.info/2015/10/setting-up-oauth2-access-with-google-apps-script-blogger-api-example/
function bloggerAPI() {
  var service = getBloggerService_();
  
  if (service.hasAccess()) {
    Logger.log("App has access.");
    var api = "https://www.googleapis.com/blogger/v3/users/self/blogs";
    
    var headers = {
      "Authorization": "Bearer " + getBloggerService_().getAccessToken()
    };
    
    var options = {
      "headers": headers,
      "method" : "GET",
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(api, options);
    
    var json = JSON.parse(response.getContentText());
    
    for (var i in json.items) {
      Logger.log("%s %s", json.items[i].name, json.items[i].url); 
    }
  }
  else {
    Logger.log("App has no access yet.");
    
    // this was the step I was missed originally
    // open this url to gain authorization from blogger
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
        authorizationUrl);
  }
  
}