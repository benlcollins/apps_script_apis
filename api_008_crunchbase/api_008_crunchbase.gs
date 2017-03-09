/*
 * Crunchbase API integration
 *
 * https://data.crunchbase.com/docs/using-the-api
 *
 * Step 1: Register for basic account (Free)
 * https://about.crunchbase.com/pricing/
 *
 * Email support for user key if you don't have one:
 * api-basic@crunchbase.com
 *
 *
 *
 *
 *
 */

var USER_KEY = '';


function getCrunchbaseOrgs() {
  
  // Basic access:
  // https://data.crunchbase.com/docs/odm-organizations
  
  // URL and params for the Crunchbase API
  var root = 'https://api.crunchbase.com/v/3/odm-organizations';
  
  var params = {
    'method': 'GET',
    //'muteHttpExceptions': true,
    'headers': {
      'Authorization': 'user_key ' + USER_KEY
    },
    'query': 'Kaggle' // example org
  };
  
  try {
    var response = UrlFetchApp.fetch(root, params); // POST emails to mailchimp
    var responseData = response.getContentText();
    var json = JSON.parse(responseData);
    Logger.log(json);
  }
  catch (e) {
    Logger.log(e);
  }
  
}
