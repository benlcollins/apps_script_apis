function doPost(e) {

  if(typeof e !== 'undefined') 
    var ss= SpreadsheetApp.openById("<Sheet ID>")
    var sheet = ss.getSheetByName("Sheet1")
    sheet.getRange(1, 1).setValue(JSON.stringify(e))
    return ContentService.createTextOutput(JSON.stringify(e))
}