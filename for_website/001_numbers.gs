function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Numbers API Menu')
      .addItem('Display random number fact','callNumbers')
      .addToUi();
}

function callNumbers() {
  
  // Call the Numbers API for random math fact
  var response = UrlFetchApp.fetch("http://numbersapi.com/random/math");
  Logger.log(response.getContentText());
  
  var fact = response.getContentText();
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(sheet.getLastRow() + 1,1).setValue([fact]);
  
}
