/********************************************************************************
 * 
 * API experiments 2017 #002
 * Exploring the MailChimp API
 * Retrives MailChimp data and populates a Google Sheet
 * Drop-down menu controls for user to choose categories/items
 * 
 */


// setup menu to run print Mailchimp function from Sheet
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('MailChimp Menu')
      .addItem('Get campaign data', 'printMailChimpData')
      .addToUi();
  
}



// script properties service
// retrive copy of mailchimp api key
function getApiKey() {  
  var properties = PropertiesService.getScriptProperties();
  return properties.getProperty('apikey');
}


/*
 * Step 1:
 * Basic MailChimp API GET request
 *
 * {list_id} the ID of your list in MailChimp
 * {apikey} your MailChimp API key
 *
 */

function mailchimp1() {
  
  // get mailchimp api key from properties service
  var apikey = getApiKey();
  
  // URL and params for the Mailchimp API
  var root = 'https://us11.api.mailchimp.com/3.0/';
  var endpoint = 'lists/77e612d207';
  
  var params = {
    'method': 'GET',
    'muteHttpExceptions': true,
    'headers': {
      'Authorization': 'apikey ' + apikey
    }
  };
  
  // call the Mailchimp API
  var response = UrlFetchApp.fetch(root+endpoint, params);
  var data = response.getContentText();
  var json = JSON.parse(data);
  
  // Log the list stats
  Logger.log(json["stats"]);
  
  // Log the total number of people on the list
  Logger.log("Total members on list: " + json["stats"]["member_count"]);
}


/****************************************************************************************
 *
 * Step 2:
 *
 */
function mailchimp2() {
  
  // get mailchimp api key from properties service
  var apikey = getApiKey();
  
  // URL and params for the Mailchimp API
  var root = 'https://us11.api.mailchimp.com/3.0/';
  var endpoint = 'lists/';
  
  var params = {
    'method': 'GET',
    'muteHttpExceptions': true,
    'headers': {
      'Authorization': 'apikey ' + apikey
    }
  };
  
  // call the Mailchimp API
  var response = UrlFetchApp.fetch(root+endpoint, params);
  var data = response.getContentText();
  var json = JSON.parse(data);
  
  // Log the list id and stats
  Logger.log("List ID:" + json["lists"][0]["id"]);
  Logger.log(json["lists"][0]["stats"]);
}

/****************************************************************************************
 *
 * Return more than the default 10
// Add this to the endpoint '?count=20'
 */
function mailchimp3() {
  
  // get mailchimp api key from properties service
  var apikey = getApiKey();
  
  // URL and params for the Mailchimp API
  var root = 'https://us11.api.mailchimp.com/3.0/';
  var endpoint = 'campaigns?count=20';
  
  var params = {
    'method': 'GET',
    'muteHttpExceptions': true,
    'headers': {
      'Authorization': 'apikey ' + apikey
    }
  };
  
  // call the Mailchimp API
  var response = UrlFetchApp.fetch(root+endpoint, params);
  var data = response.getContentText();
  var json = JSON.parse(data);
  
  // Log the list id and stats
  var campaigns = json['campaigns'];
  Logger.log(campaigns.length);
  for (var i = 0; i < campaigns.length; i++) {
    Logger.log(campaigns[i]["settings"]["subject_line"]);
  }
}



/****************************************************************************************
 *
 * Step 4: general endpoint
 *
 */

// generalized mailchimp api call
function mailchimp4(endpoint) {
  
  // get mailchimp api key from properties service
  var apikey = getApiKey();
  
  // URL and params for the Mailchimp API
  var root = 'https://us11.api.mailchimp.com/3.0/';
  var path = endpoint;
  var query = '?count=30';
  
  var params = {
    'method': 'GET',
    'muteHttpExceptions': true,
    'headers': {
      'Authorization': 'apikey ' + apikey
    }
  };
  
  // call the Mailchimp API
  var response = UrlFetchApp.fetch(root + path + query, params);
  var data = response.getContentText();
  var json = JSON.parse(data);
  
  // Return the JSON data
  return json[endpoint];
}


// get mailchimp campaign data v2
function getMailChimpCampaignData2() {
  
  // get mailchimp api key from properties service
  var apikey = getApiKey();
  
  var campaigns = mailchimp4('campaigns');
  
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
        (campaigns[i]["report_summary"]) ? campaigns[i]["report_summary"]["clicks"] : 0
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
  
  return campaignData;
}


// add the campaign data to our sheet
function printMailChimpData() {
  
  var data = getMailChimpCampaignData2();
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  var numRows = data.length;
  var numCols = data[0].length;
  
  sheet.getRange(4,1,numRows,numCols).setValues(data);
  
}


// add new email subscribers to MailChimp
function addMailChimpSubscribers() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  var email = sheet.getRange(2, 1).getValue();
  
  Logger.log(email);
}




// get mailchimp campaign data v1
function getMailChimpCampaignData1() {
  
  // get mailchimp api key from properties service
  var apikey = getApiKey();
  
  var campaigns = mailchimp4('campaigns');
  
  //Logger.log(campaigns[15]);
  
  // Log the campaign data
  for (var i = 0; i < campaigns.length; i++) {
    //Logger.log("i: " + i);
    (campaigns[i]["settings"]["title"]) ? Logger.log("Campaign title: " + campaigns[i]["settings"]["title"]) : Logger.log("No title");
    (campaigns[i]["send_time"]) ? Logger.log("Send time: " + campaigns[i]["send_time"]) : Logger.log("No emails sent");
    (campaigns[i]["settings"]["subject_line"]) ? Logger.log("Campaign: " + campaigns[i]["settings"]["subject_line"]) : Logger.log("No subject line recorded");
    (campaigns[i]["recipients"]["recipient_count"]) ? Logger.log("Recipient count: " + campaigns[i]["recipients"]["recipient_count"]) : Logger.log("No recipient count");
    (campaigns[i]["emails_sent"]) ? Logger.log("Emails sent: " + campaigns[i]["emails_sent"]) : Logger.log("No emails sent");
    
    if ("report_summary" in campaigns[i]) {
      Logger.log("Unique opens: " + campaigns[i]["report_summary"]["unique_opens"]);
      Logger.log("Clicks: " + campaigns[i]["report_summary"]["clicks"]);
    }
    else {
      Logger.log("No unique opens or clicks recorded");
    }

    Logger.log("\n"); // add blank line
  }
  
}
