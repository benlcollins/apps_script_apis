var CLIENT_ID = '...';
var CLIENT_SECRET = '...';

/*
 * Based on the following work by others;
 * https://mashe.hawksey.info/2015/10/setting-up-oauth2-access-with-google-apps-script-blogger-api-example/
 * https://github.com/googlesamples/apps-script-oauth2
 * https://developers.google.com/blogger/docs/3.0/getting_started
 *
 **/

// add custom menu
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Blogger Menu')
      .addItem('Get Blogger Posts','getBloggerPosts')
      .addToUi();
}



// configure the service
function getBloggerService_() {
  return OAuth2.createService('Blogger')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('https://www.googleapis.com/auth/blogger');  // this is blogger scope
}

// Logs the redict URI to register
function logRedirectUri() {
  var service = getBloggerService_();
  Logger.log(service.getRedirectUri());
}


// handle the callback
function authCallback(request) {
  var bloggerService = getBloggerService_();
  var isAuthorized = bloggerService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

// Step 1: call the blogger API and get list of blogger sites associated with this google account
function getBloggerSites() {
  var service = getBloggerService_();
  
  if (service.hasAccess()) {
    Logger.log("App has access.");
    var api = "https://www.googleapis.com/blogger/v3/users/self/blogs";
    
    var headers = {
      "Authorization": "Bearer " + getBloggerService_().getAccessToken()
    };
    
    var options = {
      "headers": headers,
      "method" : "GET",
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(api, options);
    
    var json = JSON.parse(response.getContentText());
    
    var bloggerIds = [];
    
    for (var i in json.items) {
      Logger.log("%s %s", json.items[i].name, json.items[i].url); 
      bloggerIds.push(json.items[i].id);
    }
    Logger.log(bloggerIds);
    //return bloggerIds;
  }
  else {
    Logger.log("App has no access yet.");
    
    // this was the step I was missing originally
    // open this url to gain authorization from blogger
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
        authorizationUrl);
  }
}


// Step 2: get list of all posts for specific blogger site
function getBloggerPosts() {
  var service = getBloggerService_();
  var blogId = '4679573973485579295'; // the id for my blogger site Data Chops
  
  var api = 'https://www.googleapis.com/blogger/v3/blogs/' + blogId + '/posts';
  
  var headers = {
    "Authorization": "Bearer " + getBloggerService_().getAccessToken()
  };
  
  var options = {
    "headers": headers,
    "method" : "GET",
    "muteHttpExceptions": true
  };
  
  var response = UrlFetchApp.fetch(api, options);
  
  var json = JSON.parse(response.getContentText());
  var posts = json["items"];
  
  Logger.log(posts.length); // result is 8, which matches the number of blog posts at http://datachops.blogspot.com/
  //Logger.log(posts[0]);
  
  var postsArray = [];
  
  for (var i = 0; i < posts.length; i++) {
    var authorName = posts[i]["author"]["displayName"];
    var authorImage = '=image("https:' + posts[i]["author"]["image"]["url"] + '",4,60,60)';
    var publishedDate = posts[i]["published"];
    var publishedUrl = posts[i]["url"];
    var title = posts[i]["title"];
    //var content = posts[i]["content"];
  
    postsArray.push([publishedDate,title,publishedUrl,authorName,authorImage/*,content*/]);
  }
  
  Logger.log(postsArray);
  
  outputToSheet(postsArray);
  
}


// print out results to sheet
function outputToSheet(post) {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var publishedPosts = ss.getSheetByName('Published Posts');
  
  publishedPosts.getRange(4,1,publishedPosts.getLastRow(),5).clearContent();
  
  var outputRange = publishedPosts.getRange(4,1,post.length,5).setValues(post);
  
  for (var i = 0; i < post.length; i++) { 
    publishedPosts.setRowHeight(i + 4,65);
  }
}
