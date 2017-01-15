// script properties service
// retrive copy of ga profile id
function getProfileId() {  
  var properties = PropertiesService.getScriptProperties();
  return properties.getProperty('gaProfileId');
}


// run Google Analytics report
function gaReport() {
  
  var profileId = getProfileId();
  
  var today = new Date();
  var oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  var startDate = Utilities.formatDate(oneWeekAgo, Session.getScriptTimeZone(),
      'yyyy-MM-dd');
  
  
  
  var endDate = Utilities.formatDate(today, Session.getScriptTimeZone(),
      'yyyy-MM-dd');

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
  
  Logger.log(report["rows"]);
  // [[desktop, 4215], [mobile, 224], [tablet, 57]]
  
}
