/*
 *
 * Basic MailChimp API GET request
 * {list_id} the ID of your list in MailChimp
 * {apikey} your MailChimp API key
 *
 */

function mailchimp() {
  
  // URL and params for the Mailchimp API
  var root = 'https://us11.api.mailchimp.com/3.0/';
  var endpoint = 'lists/{list_id}';
  
  var params = {
    'method': 'GET',
    'muteHttpExceptions': true,
    'headers': {
      'Authorization': 'apikey {apikey}'
    }
  };
  
  // call the Mailchimp API
  var response = UrlFetchApp.fetch(root+endpoint, params);
  var data = response.getContentText();
  var json = JSON.parse(data);
  
  Logger.log(json);
}