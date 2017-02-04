/********************************************************************************
 * 
 * API experiments 2017 #001
 * Exploring the Star Wars API: http://swapi.co/api/
 * Retrives Star Wars data and populates a Google Sheet
 * Drop-down menu controls for user to choose categories/items
 * 
 */

function swapiCategories() {
  
  // get the categories from the api
  var categories = function () {
    
    try {
      var response = UrlFetchApp.fetch("http://swapi.co/api/");
      var data = response.getContentText();
      var json = JSON.parse(data);
      var keys = Object.keys(json);
      return keys;
    }
    catch(e) {
      Logger.log("Error: " + e.message); // log error message
    }
    
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
  
  try {
    // Call the Star Wars API for each class
    var response = UrlFetchApp.fetch("http://swapi.co/api/" + category + "/");
    var json = response.getContentText();
    var data = JSON.parse(json)["results"];
    
    return data;
  }
  catch(e) {
    Logger.log("Error: " + e.message); // log error message
  }
};



function swapiDetail() {
  
  // get the category name chosen
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var apiSheet = ss.getSheetByName("api tool");
  var category = apiSheet.getRange(4,3).getValue().toLowerCase();
  
  // call the api to get back all the data for that category
  var catData = categoryData(category);
  // Logger.log(catData[1]);
  var catNames = getCategoryNames(category,catData);  // [[Alderaan], [Yavin IV], [Hoth], [Dagobah], [Bespin], [Endor], [Naboo], [Coruscant], [Kamino], [Geonosis]]
  
  // get the specific item chosen within this category
  var item = apiSheet.getRange(6,3).getValue();
  
  var itemData;
  
  // loop through category data until have match with the chosen item
  catNames.forEach(function(elem,i) {
    if (elem[0] === item) { 
      itemData = catData[i];
    }
  });
  
  // call function to parse itemData and return selected data for that category item
  // data required will be depedent on category of item e.g. people v planets
  var itemDataForSheet = returnItemDetails(itemData,category);
  
  // paste into sheet, clear old details first
  apiSheet.getRange(10,2,apiSheet.getLastRow(),2).clearContent();
  apiSheet.getRange(10, 2, itemDataForSheet.length, 2).setValues(itemDataForSheet);
  apiSheet.getRange(10, 2, itemDataForSheet.length, 2).setBackground("black").setFontColor("#FFD966").setHorizontalAlignment("left");
  
}


function returnItemDetails(itemData,category) {
  
  var data = [];
  
  if (category === 'films') {
    // do something
    data.push(["Title:",itemData["title"]]);
    data.push(["Url:",itemData["url"]]);
    data.push(["Director:",itemData["director"]]);
    data.push(["Opening Crawl:",itemData["opening_crawl"]]);
  }
  else if (category === 'people') {
    // put the people details into the data array
    data.push(["Name:",itemData["name"]]);
    data.push(["Url:",itemData["url"]]);
    data.push(["Height:",itemData["height"]]);
    data.push(["Mass:",itemData["mass"]]);
    data.push(["Hair Color:",itemData["hair_color"]]);
    data.push(["Skin Color:",itemData["skin_color"]]);
    data.push(["Eye Color:",itemData["eye_color"]]);
    data.push(["Birth Year:",itemData["birth_year"]]);
    data.push(["Gender:",itemData["gender"]]);
  }
  else if (category === 'planets') {
    // put the planets details into the data array
    data.push(["Name:",itemData["name"]]);
    data.push(["Url:",itemData["url"]]);
    data.push(["Climate:",itemData["climate"]]); 
    data.push(["Rotation Period:",itemData["rotation_period"]]); 
    data.push(["Population:",itemData["population"]]); 
    data.push(["Orbital Period:",itemData["orbital_period"]]); 
    data.push(["Surface Water:",itemData["surface_water"]]); 
    data.push(["Diameter:",itemData["diameter"]]); 
    data.push(["Gravity:",itemData["gravity"]]);
    data.push(["Terrain:",itemData["terrain"]]);
  }
  else if (category === 'species') {
    // put the species details into the data array
    data.push(["Name:",itemData["name"]]);
    data.push(["Url:",itemData["url"]]);
    data.push(["Skin color:",itemData["skin_colors"]]); 
    data.push(["Homeworld:",itemData["homeworld"]]); 
    data.push(["Eye color:",itemData["eye_colors"]]); 
    data.push(["Language:",itemData["language"]]); 
    data.push(["Classification:",itemData["classification"]]); 
    data.push(["Hair color:",itemData["hair_colors"]]); 
    data.push(["Average height:",itemData["average_height"]]); 
    data.push(["Designation:",itemData["designation"]]); 
    data.push(["Average lifespan:",itemData["average_lifespan"]]);
  }
  else if (category === 'starships') {
    // put the starship details into the data array
    data.push(["Name:",itemData["name"]]);
    data.push(["Url:",itemData["url"]]);
    data.push(["Max atmosphering speed:",itemData["max_atmosphering_speed"]]); 
    data.push(["Cargo capacity:",itemData["cargo_capacity"]]); 
    data.push(["Passengers:",itemData["passengers"]]); 
    data.push(["Pilots:",itemData["pilots"]]); 
    data.push(["Consumables:",itemData["consumables"]]); 
    data.push(["MGLT:",itemData["MGLT"]]); 
    data.push(["Length:",itemData["length"]]); 
    data.push(["Starship class:",itemData["starship_class"]]); 
    data.push(["Manufacturer:",itemData["manufacturer"]]); 
    data.push(["Crew:",itemData["crew"]]); 
    data.push(["Hyperdrive rating:",itemData["hyperdrive_rating"]]);
    data.push(["Cost in credits:",itemData["cost_in_credits"]]);
    data.push(["Model:",itemData["model"]]);
  }
  else if (category === 'vehicles') {
    // put the vehicle details into the data array
    data.push(["Name:",itemData["name"]]);
    data.push(["Url:",itemData["url"]]);
    data.push(["Max atmosphering speed:",itemData["max_atmosphering_speed"]]); 
    data.push(["Cargo capacity:",itemData["cargo_capacity"]]); 
    data.push(["Passengers:",itemData["passengers"]]); 
    data.push(["Pilots:",itemData["pilots"]]); 
    data.push(["Consumables:",itemData["consumables"]]); 
    data.push(["Length:",itemData["length"]]); 
    data.push(["Manufacturer:",itemData["manufacturer"]]); 
    data.push(["Crew:",itemData["crew"]]); 
    data.push(["Vehicle class:",itemData["vehicle_class=repulsorcraft"]]);
    data.push(["Cost in credits:",itemData["cost_in_credits"]]);
    data.push(["Model:",itemData["model"]]);
  }
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
