/**
 *
 * Mailchimp API - Get Campaign Data into Google Sheets
 * By Ben Collins 2017
 * http://www.benlcollins.com/
 *
 */

var API_KEY = '';
var LIST_ID = '';

// call the Mailchimip API to get campaign data
// This gets all campaigns in an account
function mailchimpCampaign() {
  
  // URL and params for the Mailchimp API
  var root = 'https://us11.api.mailchimp.com/3.0/';
  var endpoint = 'campaigns?count=100';
  
  // parameters for url fetch
  var params = {
    'method': 'GET',
    'muteHttpExceptions': true,
    'headers': {
      'Authorization': 'apikey ' + API_KEY
    }
  };
  
  // call the Mailchimp API
  var response = UrlFetchApp.fetch(root+endpoint, params);
  var data = response.getContentText();
  var json = JSON.parse(data);
  
  Logger.log(json);

  // get just campaign data
  var campaigns = json['campaigns'];
  
  // Log the campaign stats
  Logger.log("Number of campaigns: " + campaigns.length);
  
  // print out all the campaign headings
  campaigns.forEach(function(campaign) {
    Logger.log(campaign["settings"]["subject_line"]);
  });
  
}
