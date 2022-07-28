/********************************************************************************
 *
 * Mailchimp API - Get Campaign Data into Google Sheets
 * By Ben Collins 2017
 * http://www.benlcollins.com/
 *
 */

// Add your API KEY & List ID below;
var API_KEY = '';
var LIST_ID = '';

// Get the Data Center location from the API_KEY & append it to the ROOT_URL
var DATA_CENTER = API_KEY.split('-')[1];
var ROOT_URL = `https://${DATA_CENTER}.api.mailchimp.com/3.0/`;

/********************************************************************************
 * call the Mailchimip API to get campaign data
 * This gets all campaigns in an account
 */
function mailchimpCampaign() {
	// URL and params for the Mailchimp API
	var endpoint = 'campaigns?count=100';

	// parameters for url fetch
	var params = {
		method: 'GET',
		muteHttpExceptions: true,
		headers: {
			Authorization: 'apikey ' + API_KEY,
		},
	};

	try {
		// call the Mailchimp API
		var response = UrlFetchApp.fetch(ROOT_URL + endpoint, params);
		var data = response.getContentText();
		var json = JSON.parse(data);

		// get just campaign data
		var campaigns = json['campaigns'];

		// blank array to hold the campaign data for Sheet
		var campaignData = [];

		// Add the campaign data to the array
		for (var i = 0; i < campaigns.length; i++) {
			// put the campaign data into a double array for Google Sheets
			if (campaigns[i]['emails_sent'] != 0) {
				campaignData.push([
					i,
					campaigns[i]['send_time'].substr(0, 10),
					campaigns[i]['settings']['title'],
					campaigns[i]['settings']['subject_line'],
					campaigns[i]['recipients']['recipient_count'],
					campaigns[i]['emails_sent'],
					campaigns[i]['report_summary']
						? campaigns[i]['report_summary']['unique_opens']
						: 0,
					campaigns[i]['report_summary']
						? campaigns[i]['report_summary']['subscriber_clicks']
						: 0,
				]);
			} else {
				campaignData.push([
					i,
					'Not sent',
					campaigns[i]['settings']['title'],
					campaigns[i]['settings']['subject_line'],
					campaigns[i]['recipients']['recipient_count'],
					campaigns[i]['emails_sent'],
					'N/a',
					'N/a',
				]);
			}
		}

		// Log the campaignData array
		Logger.log(campaignData);

		// select the campaign output sheet
		var ss = SpreadsheetApp.getActiveSpreadsheet();
		var sheet = ss.getSheetByName('Campaign Analysis');

		// calculate the number of rows and columns needed
		var numRows = campaignData.length;
		var numCols = campaignData[0].length;

		// output the numbers to the sheet
		sheet.getRange(4, 1, numRows, numCols).setValues(campaignData);

		// adds formulas to calculate open rate and click rate
		for (var i = 0; i < numRows; i++) {
			sheet
				.getRange(4 + i, 9)
				.setFormulaR1C1('=iferror(R[0]C[-2]/R[0]C[-3]*100,"N/a")');
			sheet
				.getRange(4 + i, 10)
				.setFormulaR1C1('=iferror(R[0]C[-2]/R[0]C[-4]*100,"N/a")');
		}
	} catch (error) {
		// deal with any errors
		Logger.log(error);
	}
}

/********************************************************************************
 *
 * Retrives MailChimp list growth data and populates a Google Sheet
 *
 */
function mailchimpListGrowth() {
	// URL and params for the Mailchimp API
	var endpoint =
		'lists/' +
		LIST_ID +
		'/growth-history?count=100&sort_field=month&sort_dir=DESC';

	var params = {
		method: 'GET',
		muteHttpExceptions: true,
		headers: {
			Authorization: 'apikey ' + API_KEY,
		},
	};

	try {
		// call the Mailchimp API
		var response = UrlFetchApp.fetch(ROOT_URL + endpoint, params);
		var data = response.getContentText();
		var json = JSON.parse(data);
		// Logger.log(data);

		// get just list history data
		var listGrowth = json['history'];

		// blank array to hold the list growth data for Sheet
		var monthlyGrowth = [];

		// Add the list growth data to the array
		listGrowth.forEach(function (el) {
			// Properties existing, optins & imports are depreciated by MailChimp
			// monthlyGrowth.push([el.month, el.existing, el.optins, el.imports]);

			// Add new property "subscribed" instead
			monthlyGrowth.push([el.month, el.subscribed]);
		});

		// Log the monthlyGrowth array
		// Logger.log(monthlyGrowth);

		// select the list growth output sheet
		var ss = SpreadsheetApp.getActiveSpreadsheet();
		var sheet = ss.getSheetByName('List Growth');

		// calculate the number of rows and columns needed
		var numRows = monthlyGrowth.length;
		var numCols = monthlyGrowth[0].length;

		// output the numbers to the sheet
		sheet.getRange(4, 1, numRows, numCols).setValues(monthlyGrowth.reverse());

		// adds formulas for absolute and relative growth
		for (var i = 0; i < numRows; i++) {
			sheet
				.getRange(4 + i, 5)
				.setFormulaR1C1('=iferror(R[0]C[-3] - R[-1]C[-3],0)'); // absolute monthly change in list
			sheet
				.getRange(4 + i, 6)
				.setFormulaR1C1('=iferror((R[0]C[-4] - R[-1]C[-4])/R[-1]C[-4],0)')
				.setNumberFormat('0.00%'); // rate of change in list
		}

		// Hiding the "Optins" & "Imported columns" without affecting the Google Sheet template
		sheet.hideColumns(3, 2); //Starting from the third column & hiding 2 columns
	} catch (error) {
		// deal with any errors
		Logger.log(error);
	}
}
