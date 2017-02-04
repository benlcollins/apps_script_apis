/********************************************************************************
 * Step 1:
 * Most basic call to the API 
 */
function swapi1() {
  
  // Call the Star Wars API
  var response = UrlFetchApp.fetch("http://swapi.co/api/planets/1/");
  Logger.log(response.getContentText());
}

/*
 * example data packet reply from api
{films=[http://swapi.co/api/films/5/, http://swapi.co/api/films/4/, http://swapi.co/api/films/6/, 
http://swapi.co/api/films/3/, http://swapi.co/api/films/1/], edited=2014-12-21T20:48:04.175778Z, 
created=2014-12-09T13:50:49.641000Z, climate=arid, rotation_period=23, url=http://swapi.co/api/planets/1/, 
population=200000, orbital_period=304, surface_water=1, diameter=10465, gravity=1 standard, name=Tatooine, 
residents=[http://swapi.co/api/people/1/, http://swapi.co/api/people/2/, http://swapi.co/api/people/4/, 
http://swapi.co/api/people/6/, http://swapi.co/api/people/7/, http://swapi.co/api/people/8/, 
http://swapi.co/api/people/9/, http://swapi.co/api/people/11/, http://swapi.co/api/people/43/, 
http://swapi.co/api/people/62/], terrain=desert}
*/


/********************************************************************************
 * Step 2:
 * Same basic call to the API 
 * Parse the JSON reply
 */
function swapi2() {
  
  // Call the Star Wars API
  var response = UrlFetchApp.fetch("http://swapi.co/api/planets/1/");
  
  // Parse the JSON reply
  var json = response.getContentText();
  var data = JSON.parse(json);
  Logger.log(data);
  
  // output the planet name in our Google Sheet
  Browser.msgBox(data.name);
}


/********************************************************************************
 * Step 3:
 * Same basic call to the API 
 * Parse the JSON reply
 * Log error messages
 */
function swapi3() {
  
  try {
    
    // Call the Star Wars API
    // deliberately use the wrong URL
    var response = UrlFetchApp.fetch("http://ZZZswapi.co/api/planets/1/");
    
    // Parse the JSON reply
    var json = response.getContentText();
    var data = JSON.parse(json);
  
    // output the planet name in our Google Sheet
    Browser.msgBox(data.name);
  
  } catch (e) {
    
    // TO DO
    // log the error
    Logger.log(e); // full error message
    Logger.log(e.message); // content of error message
    // .. what else....?
    
  }
  
}



/********************************************************************************
 * Step 4:
 * Same basic call to the API 
 * Parse the JSON reply
 * Get response code and base decision off that
 * Log error messages
 */
function swapi4() {
  
  // Add the base URL for the Star Wars API to a variable
  var queryString = "http://swapi.co/api/"
  var endpoint = "bob"
  
  var params = {
    'method': 'GET',
    'muteHttpExceptions': true  // allows program to continue despite error fetching the API with missing endpoint
  }
  
  // deliberately use the wrong URL
  var rc = UrlFetchApp.fetch(queryString + endpoint, params).getResponseCode();
  
  if (rc == 200) {
    // output the planet name in our Google Sheet
    Logger.log(rc);
  }
  else {
    // do something...
    Logger.log("Uh-oh! I searched for '" + endpoint + "' but the server returned response code " + rc + ", which means I didn't find what you were looking for."); 
  }
  
}


/********************************************************************************
 * Step 5:
 * Same basic call to the API 
 * Parse the JSON reply
 * Get headers
 */
function swapi5() {
  
  // Call the Star Wars API
  var response = UrlFetchApp.fetch("http://swapi.co/api/planets/1/");
  
  // Get the reply headers
  var headers = response.getHeaders();

  Logger.log(headers);
  Logger.log(headers.Date);
  Logger.log(headers.domain); // why was this "undefined"?
  
}



/********************************************************************************
 * Step 6:
 * Same basic call to the API 
 * Parse the JSON reply
 * display the different parts of the JSON
 */
function swapi6() {
  
  // Call the Star Wars API
  var response = UrlFetchApp.fetch("http://swapi.co/api/planets/1/");
  
  // Parse the JSON reply
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  Logger.log("Record created: " + data.created);
  Logger.log("Record last edited: " + data.edited); 
  Logger.log("URL of endopint: " + data.url);
  Logger.log("Name of planet: " + data.name);
  Logger.log("Climate of planet: " + data.climate);
  Logger.log("Terrain of planet: " + data.terrain);
  Logger.log("Population of planet: " + data.population);
}


/********************************************************************************
 * Step 7:
 * Same basic call to the API 
 * Parse the JSON reply
 * display the different parts of the JSON
 */
function swapi7() {
  
  // Call the Star Wars API
  var response = UrlFetchApp.fetch("http://swapi.co/api/planets/");
  
  // Parse the JSON reply
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  // Log all planet names from the api
  for each (item in data["results"]) {
    
    Logger.log(item.name);
  }
  
  //Logger.log(data["results"][0]);
  //Logger.log(data["results"].length);
}


/********************************************************************************
 * Step 8:
 * Initialize by creating list of all category items and pasting to sheet
 * Parse the JSON reply
 * display the different parts of the JSON
 */
function allData() {
  
  // Call the Star Wars API
  var response = UrlFetchApp.fetch("http://swapi.co/api/");
  
  // Parse the JSON reply
  var json = response.getContentText();
  var apiData = JSON.parse(json);
 
  return apiData;
  /*
   * {films=http://swapi.co/api/films/, planets=http://swapi.co/api/planets/, species=http://swapi.co/api/species/, 
   * starships=http://swapi.co/api/starships/, vehicles=http://swapi.co/api/vehicles/, people=http://swapi.co/api/people/}
   */
}



function returnCatNames(category) {
    
  var names = [];
  
  /*  
  for each (item in category) {
    var obj = {};
    names.push(item.name);
      //obj["name"] = item.name,
      //obj["url"] = item.url
      //);
  }
  */
  
  category.forEach(function(elem) {
    var obj = {};
    names.push(elem.name);
  });
  
  
  Logger.log(names);
  
  return names;
}


function readToSheet() {
  
  var planetData = callAPI("planets");
  var peopleData = callAPI("people");
  
  // Create array of all planet names from the api
  var planetNames = returnCatNames(planetData);
  var peopleNames = returnCatNames(peopleData);


  Logger.log(planetNames);
  //Logger.log(planetData[0].url);
  Logger.log(peopleNames);
  
}


/********************************************************************************
 * Step 9:
 * get all options for api and write to sheet
 * 
 */

function getCategoryData() {
  
  // get the value from the spreadsheet corresponding to user's choice
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var apiSheet = ss.getSheetByName("api tool");
  var category = apiSheet.getRange(4,3).getValue().toLowerCase();
  Logger.log(category);
  
  // Call the Star Wars API for each class
  var response = UrlFetchApp.fetch("http://swapi.co/api/" + category + "/");
  var json = response.getContentText();
  var data = JSON.parse(json)["results"];
  
  // create array of the names for this category
  var names = getCategoryNames(category,data);
  var categoryCount = names.length;
  Logger.log(names);
  Logger.log(categoryCount);
  
  // paste into our sheet as a drop down menu
  var workingsSheet = ss.getSheetByName("workings");
  var maxRow = workingsSheet.getLastRow();
  workingsSheet.getRange(13,2,maxRow).clearContent();
  workingsSheet.getRange(13, 2, categoryCount).setValues(names);
  
  // change the cell in the drop down menu to be the first name of the new category list
  var firstName = workingsSheet.getRange(13,2).getValue();
  apiSheet.getRange(6,3).setValue(firstName);
  
  Logger.log(data);
  return data;

}











// turn into drop down menus so you can select from within the sheet
// paste the API reply into the google sheet as the "answer"
// explore different error handling and response codes
// explore different bits of data returned and log and look at each one
// https://developers.google.com/apps-script/reference/url-fetch/http-response
