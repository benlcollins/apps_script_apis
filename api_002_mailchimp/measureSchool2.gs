/**
 *
 * Mailchimp API - Get Campaign Data into Google Sheets
 * By Ben Collins 2017
 * http://www.benlcollins.com/
 *
 */

var API_KEY = '';
var LIST_ID = '';

// setup menu to run print Mailchimp function from Sheet
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('MailChimp Menu')
    .addItem('Get campaign data', 'mailchimpCampaign')
    .addToUi();
}

/** 
 * call the Mailchimip API to get campaign data
 * This gets all campaigns in an account
 */
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
  
  try {
    // call the Mailchimp API
    var response = UrlFetchApp.fetch(root+endpoint, params);
    var data = response.getContentText();
    var json = JSON.parse(data);
    
    // get just campaign data
    var campaigns = json['campaigns'];
    
    // blank array to hold the campaign data for Sheet
    var campaignData = [];
  
    // Add the campaign data to the array
    for (var i = 0; i < campaigns.length; i++) {
      
      // put the campaign data into a double array for Google Sheets
      if (campaigns[i]["emails_sent"] != 0) {
        campaignData.push([
          i,
          campaigns[i]["send_time"].substr(0,10),
          campaigns[i]["settings"]["title"],
          campaigns[i]["settings"]["subject_line"],
          campaigns[i]["recipients"]["recipient_count"],
          campaigns[i]["emails_sent"],
          (campaigns[i]["report_summary"]) ? campaigns[i]["report_summary"]["unique_opens"] : 0,  
          (campaigns[i]["report_summary"]) ? campaigns[i]["report_summary"]["subscriber_clicks"] : 0
        ]);
      }
      else {
        campaignData.push([
          i,
          "Not sent",
          campaigns[i]["settings"]["title"],
          campaigns[i]["settings"]["subject_line"],
          campaigns[i]["recipients"]["recipient_count"],
          campaigns[i]["emails_sent"],
          "N/a",
          "N/a"
        ]);
      }
    }
    
    // Log the campaignData array
    Logger.log(campaignData);
    
    // select the campaign output sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Campaign Analysis');
    
    // calculate the number of rows and columns needed
    var numRows = campaignData.length;
    var numCols = campaignData[0].length;
    
    // output the numbers to the sheet
    sheet.getRange(7,1,numRows,numCols).setValues(campaignData);
    
    // adds formulas to calculate open rate and click rate
    for (var i = 0; i < numRows; i++) {
      sheet.getRange(7+i,9).setFormulaR1C1('=iferror(R[0]C[-2]/R[0]C[-3]*100,"N/a")');
      sheet.getRange(7+i,10).setFormulaR1C1('=iferror(R[0]C[-2]/R[0]C[-4]*100,"N/a")');
    }
    
  }
  catch (error) {
    // deal with any errors
    Logger.log(error);
  };
  
  
}