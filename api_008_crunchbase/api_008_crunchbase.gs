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


function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Crunchbase Data')
    .addItem('Retrieve organization data...', 'getCrunchbaseOrgs')
    .addItem('Retrieve people data...', 'getCrunchbasePeople')
    .addToUi();
}

function getCrunchbasePeople() {

}


function getCrunchbaseOrgs() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Organizations');
  var query = sheet.getRange(3,2).getValue();
  
  // URL and params for the Crunchbase API
  var url = 'https://api.crunchbase.com/v/3/odm-organizations?query=' + encodeURI(query) + '&user_key=' + USER_KEY;
  Logger.log(url);
  
  var data = getCrunchbaseData(url,query);
  
  Logger.log(data);
  Logger.log(data.length); // 1 or 2 if error
  
  if (data.length === 2) {
    // deal with error
    sheet.getRange(5,1,sheet.getLastRow(),2).clearContent();
    sheet.getRange(6,1,1,2).setValues([data]);
  }
  else {
    // correct data comes back, parse into array for Google Sheet
    var outputData = [
      ["Name",data[0].properties.name],
      ["Homepage",data[0].properties.homepage_url],
      ["Type",data[0].properties.primary_role],
      ["Short description",data[0].properties.short_description],
      ["Country",data[0].properties.country_code],
      ["Region",data[0].properties.region_name],
      ["City name",data[0].properties.city_name],
      ["Blog url",data[0].properties.blog_url],
      ["Facebook",data[0].properties.facebook_url],
      ["Linkedin",data[0].properties.linkedin_url],
      ["Twitter",data[0].properties.twitter_url]
    ];
    
    // clear any old data
    sheet.getRange(5,1,sheet.getLastRow(),2).clearContent();
    
    // insert new data
    sheet.getRange(6,1,12,2).setValues(outputData);
    
    // add image with formula and format that row
    sheet.getRange(5,2).setFormula('=image("' + data[0].properties.profile_image_url + '",4,50,50)').setHorizontalAlignment("center");
    sheet.setRowHeight(5,60);
  }
  
}



function getCrunchbaseData(url,query) {
    
  try {
    var response = UrlFetchApp.fetch(url); // POST emails to mailchimp
    var responseData = response.getContentText();
    var json = JSON.parse(responseData);
    
    // filter down to match the name of the entity
    var data = json.data.items.filter(function(item) {
      return item.properties.name == query;
    });
    
    return data;
  }
  catch (e) {
    Logger.log(e);
    return ["Error:", e];
  }
  
}


