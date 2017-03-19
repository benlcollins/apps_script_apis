/*
 * Crunchbase API integration
 *
 * https://data.crunchbase.com/docs/using-the-api
 *
 * Step 1: Register for basic account (Free)
 * https://about.crunchbase.com/forms/apply-basic-access/
 *
 * Email support for user key if you don't have one:
 * api-basic@crunchbase.com
 *
 */

var USER_KEY = 'Put your API user key in here';


function getCrunchbaseOrgs() {
  
  // Basic access:
  // https://data.crunchbase.com/docs/odm-organizations
  
  // URL and params for the Crunchbase API
  var root = 'https://api.crunchbase.com/v/3/odm-organizations?query=Kaggle&user_key=' + USER_KEY;
  
  try {
    var response = UrlFetchApp.fetch(root); // POST emails to mailchimp
    var responseData = response.getContentText();
    var json = JSON.parse(responseData);
    var data = json.data;
    
    var outputData = [
      [data.items[0].properties.name],
      [data.items[0].properties.profile_image_url],
      [data.items[0].properties.primary_role],
      [data.items[0].properties.short_description],
      [data.items[0].properties.country_code],
      [data.items[0].properties.region_name],
      [data.items[0].properties.city_name],
      [data.items[0].properties.homepage_url],
      [data.items[0].properties.blog_url],
      [data.items[0].properties.facebook_url],
      [data.items[0].properties.linkedin_url],
      [data.items[0].properties.twitter_url]
    ];
    
    Logger.log(outputData);
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    sheet.getRange(5,2,12,1).setValues(outputData);

  }
  catch (e) {
    Logger.log(e);
  }
  
}

