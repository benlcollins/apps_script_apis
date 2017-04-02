// Ejunkie can send an HTTP POST data to a common notification url
// Apps Script can receive the POST request and output data to sheet
// Read more here: http://www.e-junkie.com/ej/help.integration.htm

function doPost(e) {

  if(typeof e !== 'undefined') 
    var ss= SpreadsheetApp.openById("<Sheet ID>")
    var sheet = ss.getSheetByName("Sheet1")
    sheet.getRange(1, 1).setValue(JSON.stringify(e))
    return ContentService.createTextOutput(JSON.stringify(e))
}