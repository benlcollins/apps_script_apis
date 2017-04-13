// Ejunkie can send an HTTP POST data to a common notification url
// Apps Script can receive the POST request and output data to sheet
// Read more here: http://www.e-junkie.com/ej/help.integration.htm

function doPost(e) {
  
  var ss= SpreadsheetApp.openById("<Sheet ID>");
  var sheet = ss.getSheetByName("Sheet1");
  
  var outputArray = [];
  
  if(typeof e !== 'undefined') {
    var data = e.parameter;
    
    outputArray.push(
      data.ej_txn_id,
      data.invoice,
      data.payment_date,
      data.item_name,
      data.from_email,
      data.receiver_email,
      data.discount_codes,
      data.mc_gross,
      data.payment_type,
      data.payer_id,
      data.payer_email,
      data.first_name,
      data.last_name,
      data.residence_country,
      data.payer_status,
      data.payment_status,
      data.payment_gross,
      data.buyer_ip,
      data.affiliate_id,
      data.item_affiliate_fee_total,
      data.receiver_id,
      data.mc_currency,
      data.payer_business_name,
      data.payment_fee
    );
    
    sheet.appendRow(outputArray);
  }
  
  return;
}