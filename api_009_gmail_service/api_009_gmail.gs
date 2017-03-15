// add menu to Sheet
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Extract Emails')
      .addItem('Extract Emails...', 'extractEmails')
      .addToUi();
}


// extract emails from label in Gmail
function extractEmails() {
  
  // get the spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var label = sheet.getRange(1,2).getValue();
  
  // get all email threads that match label from Sheet
  var threads = GmailApp.search ("label:" + label);
  
  // get all the messages for the current batch of threads
  var messages = GmailApp.getMessagesForThreads (threads);
  
  var emailArray = [];
  
  // get array of email addresses
  messages.forEach(function(message) {
    message.forEach(function(d) {
      emailArray.push(d.getFrom(),d.getTo());
    });
  });
  
  // de-duplicate the array
  var uniqueEmailArray = emailArray.filter(function(item, pos) {
    return emailArray.indexOf(item) == pos;
  });
  
  var cleanedEmailArray = uniqueEmailArray.map(function(el) {
    var name = "";
    var email = "";
    
    var matches = el.match(/\s*"?([^"]*)"?\s+<(.+)>/);
    
    if (matches) {
      name = matches[1]; 
      email = matches[2];
    }
    else {
      name = "N/k";
      email = el;
    }
    
    return [name,email];
  }).filter(function(d) {
    if (
         d[1] !== "benlcollins@gmail.com" &&
         d[1] !== "drive-shares-noreply@google.com" &&
         d[1] !== "wordpress@www.benlcollins.com"
       ) {
      return d;
    }
  });
  
  // clear any old data
  sheet.getRange(4,1,sheet.getLastRow(),2).clearContent();
  
  // paste in new names and emails and sort by email address A - Z
  sheet.getRange(4,1,cleanedEmailArray.length,2).setValues(cleanedEmailArray).sort(2);
 
}