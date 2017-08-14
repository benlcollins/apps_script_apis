// Get Rate limit
function getSpotifyData() {
  // set up the service
  var service = getSpotifyService_();
  
  if (service.hasAccess()) {
    Logger.log("App has access.");
    
    var base = "https://api.spotify.com";
    //var endpoint = "/v1/me";
    var endpoint = "/v1/me/tracks";
    
    var headers = {
      "Authorization": "Bearer " + getSpotifyService_().getAccessToken()
    };
    
    var options = {
      "headers": headers,
      "method" : "GET",
      "muteHttpExceptions": true
    };
    
    var response = JSON.parse(UrlFetchApp.fetch(base + endpoint, options));
    
    Logger.log(response);
    // {error={message=Insufficient client scope, status=403}}
    
  }
  else {
    Logger.log("App has no access yet.");
    
    // open this url to gain authorization from github
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log("Open the following URL and re-run the script: %s",
        authorizationUrl);
  }
}