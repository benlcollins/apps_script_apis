/********************************************************************************
 * 
 * API experiments 2017 #003
 * Exploring the Google Analytics API
 * Retrives GA data and populates a Google Sheet
 * Apps Script Advanced Service
 * 
 */


// setup menu to run print Mailchimp function from Sheet
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('Google Analytics Menu')
    .addItem('Get Analytics data', 'gaReport')
    .addToUi();

}


// script properties service
// retrive copy of ga profile id
function getProfileId() {  
  var properties = PropertiesService.getScriptProperties();
  return properties.getProperty('gaProfileId');
}

// get the dates from the Sheet
function getDates() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("workings");
  
  var chosenPeriod = sheet.getRange(7,2).getValue();
  var today = new Date();
  
  // use Object literal approach instead of switch or if/else for this lookup
  var startDateCalculator = function(n) {  
    return new Date(today.getTime() - n * 24 * 60 * 60 * 1000);
  }
  
  var periods = {
    'Last 7 days': function() {
      return [chosenPeriod, startDateCalculator(7), today];
    },
    'Last 14 days': function() {
      return [chosenPeriod, startDateCalculator(14), today];
    },
    'Last 30 days': function() {
      return [chosenPeriod, startDateCalculator(30), today];
    },
    'Last Quarter': function() {
      var newArr = getPreviousQuarter(today)
      newArr.unshift(chosenPeriod);
      return newArr;
    },
    'Year To Date': function() {
      return [chosenPeriod, new Date(today.getFullYear(),0,1), today];
    },
    'Last Year': function() {
      return [chosenPeriod, new Date(today.getFullYear()-1,0,1), new Date(today.getFullYear()-1,11,31)];
    },
    'Custom Range': function() {
      var startDateChosen = sheet.getRange(9,2).getValue();
      var endDateChosen = sheet.getRange(10,2).getValue();
      if (endDateChosen < startDateChosen) {
        
        // To Do: refactor this part of the application
        // still getting this error:
        // TypeError: Cannot read property "0" from undefined.
        Browser.msgBox("End date cannot precede Start date", Browser.Buttons.OK);
        return [chosenPeriod, startDateChosen, startDateChosen]
      }
      else {
        return [chosenPeriod, startDateChosen,endDateChosen];
      }
    }
  };
  
  return periods[chosenPeriod]();
  
}
  
  
// find out which quarter the date is in
// return the two dates of the previous full quarter
function getPreviousQuarter(date) {
  
  var startQuarter, endQuarter;
  var quarter = Math.ceil((date.getMonth() + 1)/ 3);
  
  //Logger.log(quarter);
  
  switch (quarter) {
    case 1.0:
      startQuarter = new Date(date.getFullYear() - 1,9,1);
      endQuarter = new Date(date.getFullYear() - 1,11,31);
      break;
    case 2.0:
      startQuarter = new Date(date.getFullYear(),0,1);
      endQuarter = new Date(date.getFullYear(),2,31);
      break;
    case 3.0:
      startQuarter = new Date(date.getFullYear(),3,1);
      endQuarter = new Date(date.getFullYear(),5,30);
      break;
    case 4.0:
      startQuarter = new Date(date.getFullYear(),6,1);
      endQuarter = new Date(date.getFullYear(),8,30);
  }
  
  //Logger.log([startQuarter,endQuarter]);
  return [startQuarter,endQuarter];
}


// run Google Analytics report
function gaReport() {
  
  var profileId = getProfileId();  
  var chosenDateRange = getDates()[0];
  var startDate = Utilities.formatDate(getDates()[1], Session.getScriptTimeZone(),'yyyy-MM-dd');
  var endDate = Utilities.formatDate(getDates()[2], Session.getScriptTimeZone(),'yyyy-MM-dd');

  var tableId  = 'ga:' + profileId;
  var metric = 'ga:visits';
  var options = {
    'dimensions': 'ga:deviceCategory',
    'sort': '-ga:visits',
    'filters': 'ga:medium==organic',
    'max-results': 25  // actually redundant in this example with deviceCategory
  };
  
  var report = Analytics.Data.Ga.get(tableId, startDate, endDate, metric,
      options);
  
  //Logger.log(report["query"]);
  // [[desktop, 4215], [mobile, 224], [tablet, 57]]
  // {end-date=2017-01-15, max-results=25, start-index=1, ids=ga:93306374, 
  // start-date=2017-01-08, sort=[-ga:visits], filters=ga:medium==organic, 
  // metrics=[ga:visits], dimensions=ga:deviceCategory}
  
  displayGAData(chosenDateRange,report);
  
  
}


// display output in Google Sheet
function displayGAData(dateRange,data) {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Output");
  
  var timestamp = new Date();
  
  var output = [
    timestamp,
    data["query"]["dimensions"],
    data["query"]["metrics"][0],
    data["query"]["filters"],
    dateRange,
    data["query"]["start-date"],
    data["query"]["end-date"],
    data["rows"][0][1],
    data["rows"][1][1],
    data["rows"][2][1]
  ];
  
  Logger.log(output);
  
  sheet.appendRow(output);
  
}
