/*
 * Crunchbase API integration
 *
 * http://www.benlcollins.com/apps-script/crunchbase/
 *
 * First step is to register for basic account (Free)
 * https://about.crunchbase.com/forms/apply-basic-access/
 *
 * Email support for user key if you don't get one
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


// function to retrive people data
function getCrunchbasePeople() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('People');
  var query = sheet.getRange(3,2).getValue();
  
  // URL and params for the Crunchbase API
  var url = 'https://api.crunchbase.com/v/3/odm-people?query=' + encodeURI(query) + '&user_key=' + USER_KEY;
  
  var json = getCrunchbaseData(url,query);
  
  if (json[0] === "Error:") {
    // deal with error with fetch operation
    sheet.getRange(5,1,sheet.getLastRow(),2).clearContent();
    sheet.getRange(6,1,1,2).setValues([json]);
  }
  else {
    if (json[0] !== 200) {
      // deal with error from api
      sheet.getRange(5,1,sheet.getLastRow(),2).clearContent();
      sheet.getRange(6,1,1,2).setValues([["Error, server returned code:",json[0]]]);
    }
    else {
      var data = json[1].data.items[0].properties;
      
      // correct data comes back, parse into array for Google Sheet
      var outputData = [
        ["Name",data.first_name + ' ' + data.last_name],
        ["Gender",data.gender],
        ["Type",data.organization_name],
        ["Short description",data.title],
        ["Country",data.country_code],
        ["Region",data.region_name],
        ["Website url",data.homepage_url],
        ["Facebook",data.facebook_url],
        ["Linkedin",data.linkedin_url],
        ["Twitter",data.twitter_url],
        ["Crunchbase URL","https://www.crunchbase.com/" + data.web_path],
        ["Crunchbase Organization URL","https://www.crunchbase.com/" + data.organization_web_path]
      ];
      
      // clear any old data
      sheet.getRange(5,1,sheet.getLastRow(),2).clearContent();
      
      // insert new data
      sheet.getRange(6,1,12,2).setValues(outputData);
      
      // add image with formula and format that row
      sheet.getRange(5,2).setFormula('=image("' + data.profile_image_url + '",4,50,50)').setHorizontalAlignment("center");
      sheet.setRowHeight(5,60);
    }
  }
}


// function to retrive organizations data
function getCrunchbaseOrgs() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Organizations');
  var query = sheet.getRange(3,2).getValue();
  
  // URL and params for the Crunchbase API
  var url = 'https://api.crunchbase.com/v/3/odm-organizations?query=' + encodeURI(query) + '&user_key=' + USER_KEY;
  
  var json = getCrunchbaseData(url,query);
  
  if (json[0] === "Error:") {
    // deal with error with fetch operation
    sheet.getRange(5,1,sheet.getLastRow(),2).clearContent();
    sheet.getRange(6,1,1,2).setValues([json]);
  }
  else {
    if (json[0] !== 200) {
      // deal with error from api
      sheet.getRange(5,1,sheet.getLastRow(),2).clearContent();
      sheet.getRange(6,1,1,2).setValues([["Error, server returned code:",json[0]]]);
    }
    else {
      // correct data comes back, filter down to match the name of the entity
      var data = json[1].data.items.filter(function(item) {
        return item.properties.name == query;
      })[0].properties;
      
      // parse into array for Google Sheet
      var outputData = [
        ["Name",data.name],
        ["Homepage",data.homepage_url],
        ["Type",data.primary_role],
        ["Short description",data.short_description],
        ["Country",data.country_code],
        ["Region",data.region_name],
        ["City name",data.city_name],
        ["Blog url",data.blog_url],
        ["Facebook",data.facebook_url],
        ["Linkedin",data.linkedin_url],
        ["Twitter",data.twitter_url],
        ["Crunchbase URL","https://www.crunchbase.com/" + data.web_path]
      ];
      
      // clear any old data
      sheet.getRange(5,1,sheet.getLastRow(),2).clearContent();
      
      // insert new data
      sheet.getRange(6,1,12,2).setValues(outputData);
      
      // add image with formula and format that row
      sheet.getRange(5,2).setFormula('=image("' + data.profile_image_url + '",4,50,50)').setHorizontalAlignment("center");
      sheet.setRowHeight(5,60);
    }
  }
}


// general query to call Crunchbase API
function getCrunchbaseData(url,query) {
    
  try {
    var response = UrlFetchApp.fetch(url); // POST emails to mailchimp
    var responseData = response.getContentText();
    var responseCode = response.getResponseCode();
    var json = JSON.parse(responseData);
    return [responseCode,json];
  }
  catch (e) {
    Logger.log(e);
    return ["Error:", e];
  }  
}
