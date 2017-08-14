var CLIENT_ID = '';
var CLIENT_SECRET = '';

// configure the service
function getSpotifyService_() {
  return OAuth2.createService('Spotify')
    .setAuthorizationBaseUrl('https://accounts.spotify.com/authorize')
    .setTokenUrl('https://accounts.spotify.com/api/token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
}

// Logs the redict URI to register
// can also get this from File > Project Properties
function logRedirectUri() {
  var service = getSpotifyService_();
  Logger.log(service.getRedirectUri());
}


// handle the callback
function authCallback(request) {
  var spotifyService = getSpotifyService_();
  var isAuthorized = spotifyService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}