/**
 * paste transaction data into Google Sheet
 */
function postTransactionsToSheet() {

	var transactionData = getTransactions().transaction_details;
	//Logger.log(transactionData);

	transactionData.forEach(function(transaction) {
		Logger.log(transaction);
	})

}


/**
 * get paypal transactions from api
 */
function getTransactions() {

	var access_token = getAccessToken();

	var transactionBase = 'https://api.paypal.com/v1/reporting/transactions';
	var startDate = '2018-11-01T00:00:00-0700';
	var endDate = '2018-11-30T23:59:59-0700';
	var transactionEndpoint = transactionBase + '?start_date=' + startDate + '&end_date=' + endDate;

	var head = {
		'Authorization':'Bearer ' + access_token,
		'Content-Type': 'application/json'
	}

	var params = {
		headers: head,
		method: 'get',
    muteHttpExceptions: true
	}

	try {
		var response = UrlFetchApp.fetch(transactionEndpoint, params);
		var responseCode = response.getResponseCode();
		Logger.log(responseCode);

		var responseBody = response.getContentText();
		//Logger.log(responseBody);
		return JSON.parse(responseBody);
	}
	catch(e){
		Logger.log(e);
	}
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
    payload : postPayload,
    muteHttpExceptions: true
  }
  
  var response = UrlFetchApp.fetch(tokenEndpoint, params); 
  var result = response.getContentText();
  var resultObject = JSON.parse(result);
  //Logger.log(resultObject);

  return resultObject.access_token;

}
