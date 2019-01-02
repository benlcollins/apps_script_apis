/**
 * get paypal transactions
 */
function getTransactions() {

	var access_token = getAccessToken();

	Logger.log(access_token);
}


/**
 * get access token request
 */
function getAccessToken() {
  
  var tokenEndpoint = 'https://api.paypal.com/v1/oauth2/token';
  
  var head = {
    'Authorization':'Basic ' + Utilities.base64Encode(CLIENT_ID + ':' + CLIENT_SECRET),
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  
  var postPayload = {
    'grant_type' : 'client_credentials'
  }
  
  var params = {
    headers:  head,
    contentType: 'application/x-www-form-urlencoded',
    method : 'post',
    payload : postPayload
  }
  
  var response = UrlFetchApp.fetch(tokenEndpoint, params); 
  var result = response.getContentText();
  var resultObject = JSON.parse(result);
  Logger.log(resultObject);

  return resultObject.access_token;

}
