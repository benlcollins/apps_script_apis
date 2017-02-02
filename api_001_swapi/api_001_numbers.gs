function callNumbers() {
  
  // Call the Numbers API for random year
  var response = UrlFetchApp.fetch("http://numbersapi.com/random/year");
  Logger.log(response.getContentText());
  
  // Call a random number
  var number = Math.round(Math.random() * 1000);
  var response = UrlFetchApp.fetch("http://numbersapi.com/" + number);
  Logger.log("\n Random number fact:");
  Logger.log(response.getContentText());
  
}
