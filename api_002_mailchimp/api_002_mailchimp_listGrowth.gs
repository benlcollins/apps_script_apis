/********************************************************************************
 * 
 * API experiments 2017 #002
 * Exploring the MailChimp API
 * Retrives MailChimp list growth data and populates a Google Sheet
 * 
 */


function listGrowth() {
  
  // get mailchimp api key from properties service
  var apikey = getApiKey();
  
  var listID = getListID();
  
  var endpointListGrowth = 'lists/' + listID + '/growth-history';
  
  var listGrowth = mailchimpEndpoint(endpointListGrowth)['history'];
  
  //Logger.log(listGrowth);
  
  // [{existing=3070, optins=77, imports=0, list_id=77e612d207, month=2017-03, _links=[{...}]},
  
  var monthlyGrowth = [];
  
  listGrowth.forEach(function(el) {
    monthlyGrowth.push([el.month, el.existing, el.optins, el.imports]);
  });
  
  return monthlyGrowth;
}


// add the campaign data to our sheet
function getListGrowth() {
  
  var data = listGrowth().reverse();
  Logger.log(data);
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('List Growth');
  
  var numRows = data.length;
  var numCols = data[0].length;
  
  sheet.getRange(4,1,numRows,numCols).setValues(data);
  
  for (var i = 0; i < numRows; i++) {
    sheet.getRange(4+i,5).setFormulaR1C1('=iferror(R[0]C[-3] - R[-1]C[-3],0)');  // absolute monthly change in list
    sheet.getRange(4+i,6).setFormulaR1C1('=iferror((R[0]C[-4] - R[-1]C[-4])/R[-1]C[-4],0)').setNumberFormat("0.00%");  // rate of change in list
  }
  
}




