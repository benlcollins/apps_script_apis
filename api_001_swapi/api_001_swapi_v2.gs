/********************************************************************************
 * 
 */

function swapiCategories() {
  
  // get the categories from the api
  var categories = function () {
  
    var response = UrlFetchApp.fetch("http://swapi.co/api/");
    var data = response.getContentText();
    var json = JSON.parse(data);
    var keys = Object.keys(json);
    
    return keys;
  };
  
  Logger.log(categories()); // [people, planets, films, species, vehicles, starships]
  
  // set up spreadsheet variables
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var apiSheet = ss.getSheetByName("api tool");
  var workingsSheet = ss.getSheetByName("workings");
  
  // get the value from the spreadsheet corresponding to user's choice
  var category = apiSheet.getRange(4,3).getValue().toLowerCase();
  
  // get the corresponding item names in this category
  var catData = categoryData(category);
  var catNames = getCategoryNames(category,catData);
  
  Logger.log(catData);
  Logger.log(catNames);
  // [[Luke Skywalker], [C-3PO], [R2-D2], [Darth Vader], [Leia Organa], [Owen Lars], 
  // [Beru Whitesun lars], [R5-D4], [Biggs Darklighter], [Obi-Wan Kenobi]]
  
  // paste into our sheet as a drop down menu
  workingsSheet.getRange(13,2,workingsSheet.getLastRow()).clearContent();
  workingsSheet.getRange(13, 2, catNames.length).setValues(catNames);
  
  // change the cell in the drop down menu to be the first name of the new category list
  var firstName = workingsSheet.getRange(13,2).getValue();
  apiSheet.getRange(6,3).setValue(firstName)
}

// get the items for a given category
function categoryData(category) {
  
  // Call the Star Wars API for each class
  var response = UrlFetchApp.fetch("http://swapi.co/api/" + category + "/");
  var json = response.getContentText();
  var data = JSON.parse(json)["results"];
  
  return data;
};



function swapiDetail() {
  
  // get the category name chosen
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var apiSheet = ss.getSheetByName("api tool");
  var category = apiSheet.getRange(4,3).getValue().toLowerCase();
  
  // call the api to get back all the data for that category
  var catData = categoryData(category);
  var catNames = getCategoryNames(category,catData);
  
  // get the specific item chosen within this category
  var item = apiSheet.getRange(6,3).getValue();
  
  // loop through category data until have match with the chosen item
  Logger.log(catNames);
  var idx = 0;
  
  for (var i = 0; i < catNames.length; i++) {
    if (catNames[i][0] === item) {
      idx = i;
    }
  }
  
  var itemData = catData[idx];
  
  Logger.log(itemData);
  // people:
  // {films=[http://swapi.co/api/films/5/, http://swapi.co/api/films/6/, http://swapi.co/api/films/1/], 
  // homeworld=http://swapi.co/api/planets/1/, gender=female, skin_color=light, edited=2014-12-20T21:17:50.319000Z, 
  // created=2014-12-10T15:53:41.121000Z, mass=75, vehicles=[], url=http://swapi.co/api/people/7/, hair_color=brown, 
  // birth_year=47BBY, eye_color=blue, species=[http://swapi.co/api/species/1/], starships=[], name=Beru Whitesun lars, height=165}
  
}


// function to create array of names within category based on data retrieved from the api
function getCategoryNames(category,data) {
  // create names array
  var names = [];
    
  for each (item in data) {
    var itemName = (category == "films") ? item.title : item.name;
    names.push([itemName]);
  }
  
  return names;
}

// use the filter function to match the name chosen in the sheet
// to the name in the data json object returned from the api
// change to onedit trigger: https://developers.google.com/apps-script/guides/triggers/#onedit
