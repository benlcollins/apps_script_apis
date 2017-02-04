function callNumbers() {
  
  // Call the Numbers API for random math fact
  var response = UrlFetchApp.fetch("http://numbersapi.com/random/math");
  Logger.log(response.getContentText());
  
  var fact = response.getContentText();
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(1,1).setValue([fact]);
  
}