function exportSheetToSlides() {
  
  /* Setup:
   * Resources > Libraires and add library id 1-8n9YfGU1IBDmagna_1xZRHdB3c2jOuFdUrBmUDy64ITRfyhQoXH5lHc 
   * H/T Spencer Easton https://plus.google.com/u/0/+SpencerEastonCCS/posts/gK1jmbFH5kT
   * Go to Developers Console and enable Drive API and Slides API
   */

  // name of our slide template
  var TEMPLATEFILE = 'sheets_to_slides_template';
  
  // get authorization
  SlidesAPI.setTokenService(function(){
    return ScriptApp.getOAuthToken()
  });
  
  // make copy of slide template and get the ID
  var DECK_ID = DriveApp.getFilesByName(TEMPLATEFILE).next().makeCopy().getId();
  
  // log the ID
  Logger.log(DECK_ID);
}

