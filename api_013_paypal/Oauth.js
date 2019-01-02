/**
 * access client ID and client secret from user properties
 */
// first time running script, need to add the client id and secret to user properties
// var CLIENT_ID = '...';
// var CLIENT_SECRET = '...';
// thereafter, access them from user properties
var CLIENT_ID = getUserProperty('CLIENT_ID');
var CLIENT_SECRET = getUserProperty('CLIENT_SECRET');
 
/**
 * Adds client ID and client secret to user properties
 */
function addToUserProps() {
  var userProperties = PropertiesService.getUserProperties();
  var clientProperties = {
    CLIENT_ID: CLIENT_ID,
    CLIENT_SECRET: CLIENT_SECRET
  }
  userProperties.setProperties(clientProperties,true); // true argument deletes all other properties in the store
}

function getUserProperty(key) {
  var userProperties = PropertiesService.getUserProperties();
  return userProperties.getProperty(key);
}

function viewUserProperties() {
  Logger.log(CLIENT_ID);
  Logger.log(CLIENT_SECRET);
}