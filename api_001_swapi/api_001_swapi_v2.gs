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
  apiSheet.getRange(6,3).setValue(firstName);
  swapiDetail(); // run swapiDetail so that data displayed matches the first name
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
  
  // call function to parse itemData and return selected data for that category item
  // data required will be depedent on category of item e.g. people v planets
  var itemDataForSheet = returnItemDetails(itemData,category);
  
  // paste into sheet, clear old details first
  apiSheet.getRange(10,2,apiSheet.getLastRow(),2).clear();
  apiSheet.getRange(10, 2, itemDataForSheet.length, 2).setValues(itemDataForSheet);
  
}


function returnItemDetails(itemData,category) {
  
  var data = [];
  
  if (category === 'films') {
    // do something
    data.push(["Title:",itemData["title"]]);
    data.push(["Url:",itemData["url"]]);
  }
  else if (category === 'people') {
    // people details
    data.push(["Name:",itemData["name"]]);
    data.push(["Height:",itemData["height"]]);
    data.push(["Mass:",itemData["mass"]]);
    data.push(["Hair Color:",itemData["hair_color"]]);
    data.push(["Skin Color:",itemData["skin_color"]]);
    data.push(["Eye Color:",itemData["eye_color"]]);
    data.push(["Birth Year:",itemData["birth_year"]]);
    data.push(["Gender:",itemData["gender"]]);
    data.push(["Url:",itemData["url"]]);
  }
  else if (category === 'planets') {
    // do something
    data.push(["Name:",itemData["name"]]);
    data.push(["Url:",itemData["url"]]);
  }
  else if (category === 'species') {
    // do something
    data.push(["Name:",itemData["name"]]);
    data.push(["Url:",itemData["url"]]);
  }
  else if (category === 'starships') {
    // do something
    data.push(["Name:",itemData["name"]]);
    data.push(["Url:",itemData["url"]]);
  }
  /*else if (category === 'vehicles') {
    // do something
    data.push(["Name:",itemData["name"]]);
    data.push(["Url:",itemData["url"]]);
  }*/
  else {
    data.push(["Error!"],["There has been a great disturbance in the force"]);
  }
  
  return data;
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



// change to onedit trigger: https://developers.google.com/apps-script/guides/triggers/#onedit
