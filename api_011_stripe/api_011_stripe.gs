var SECRET_API_KEY = 'Your secret key in here';

function callStripe() {
  
  // api URL
  var apiURL = 'https://api.stripe.com/';
  
  // example endpoint
  var endpoint = "v1/charges"
  
  // request url
  var stripeURL = apiURL + endpoint;
  
  var headers = {
    "Authorization": "Bearer " + SECRET_API_KEY
  };
  
  var options = {
    "headers": headers,
    "method" : "GET",
    "muteHttpExceptions": true
  };
  
  var response = UrlFetchApp.fetch(stripeURL,options);
  
  Logger.log(response);
}