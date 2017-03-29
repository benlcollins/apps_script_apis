var CLIENT_ID = 'Insert your client ID';
var CLIENT_SECRET = 'Insert your client secret';

// configure the service
function getGithubService_() {
  return OAuth2.createService('GitHub')
    .setAuthorizationBaseUrl('https://github.com/login/oauth/authorize')
    .setTokenUrl('https://github.com/login/oauth/access_token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('user'); 
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
