//-----------------------------------------------------------------------------
//  get all document
//-----------------------------------------------------------------------------
function GetAllDoc() {
  ar_records_alldoc = pipe.event({action:'get_alldoc', kdus: cbox.kdus},true);
  grid_alldoc.setCellText(ar_records_alldoc);
  grid_alldoc.setRowCount(ar_records_alldoc.length);

  for (i = 0; i < grid_alldoc.getRowCount(); i = i + 1) {
      cellColor = grid_alldoc.getCellText(12, i);
      grid_alldoc.getCellTemplate(0, i).setStyle("background", cellColor)
  }
  grid_alldoc.refresh();
}
//-----------------------------------------------------------------------------
//  get search
//-----------------------------------------------------------------------------
function GetSearch() {
  ar_records_alldoc = pipe.event({action:'get_alldoc'},true);
  grid_alldoc.setCellText(ar_records_alldoc);
  grid_alldoc.setRowCount(ar_records_alldoc.length);

  for (i = 0; i < grid_alldoc.getRowCount(); i = i + 1) {
      cellColor = grid_alldoc.getCellText(12, i);
      grid_alldoc.getCellTemplate(0, i).setStyle("background", cellColor)
  }
  grid_alldoc.refresh();
}                                                                                                                                     
//-----------------------------------------------------------------------------
//  input control
//-----------------------------------------------------------------------------
function InControl(value,type) {
    // Validator Object
    // var valid = new Object();
    // matches zip codes
    if (type == "zipCode") {reg = /\d{5}(-\d{4})?/; };
    // matches $17.23 or $14,281,545.45 or ...
    if (type == "Currency") {reg = /\d{1,3}(,\d{3})*(\.\d{0,2})?/; };
    // numeric
    if (type == "Numeric") {reg = /\d{1,3}(,\d{3})*(\.\d{0,3})?/; };
    // matches 5:04 or 12:34 but not 75:83
    if (type == "Time") {reg = /^([1-9]|1[0-2]):[0-5]\d$/; };
    //matches email
    if (type == "emailAddress") {reg = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/; };
    // matches phone ###-###-####
    if (type == "phoneNumber") {reg = /^\(?\d{3}\)?\s|-\d{3}-\d{4}$/; };
    // International Phone Number
    if (type == "phoneNumberInternationel") {reg = /^\d(\d|-){7,20}/; };
    // IP Address
    if (type == "ipAddress") {reg = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/; };
    // Date xx/xx/xxxx
    if (type == "Date") {
       //reg = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{4}$/;
       //reg = /(\d+)/(\d+)/(\d+)/;  
       //reg = /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/;      /* mm/dd/yyyy */
       //reg = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;      /* dd-mm-yyyy */
       reg = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])/;      /* yyyy-mm-dd */
    
       //date31 = /^(01|03|05|07|08|10|12)[ ](0?[1-9]|[12][0-9]|3[01])/;
       //date30 = /^(04|06|09|11)[ ]([123]0|[012]?[1-9])/;
       //date28 = /^(02)[ ](0?[1-9]|[12][0-9])/;
       //reg = /^{date31}|{date30}|{date28}/; 
    };
    // State Abbreviation   
    if (type == "State") {reg = /^(AK|AL|AR|AZ|CA|CO|CT|DC|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NB|NC|ND|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VT|WA|WI|WV|WY)$/i; };
    // Social Security Number
    if (type == "SSN") {reg = /^\d{3}\-\d{2}\-\d{4}$/; };

    var gotIt = reg.exec(value); 
    if(gotIt==null){
        alert("Failure to match  " + value + "  to  " + type);                  
        return false;
    };
    // alert(gotIt[1]);
    return true;
};
//-----------------------------------------------------------------------------
//  filter grid
//-----------------------------------------------------------------------------
// 
function filterGrid(obj, group, col, countr){ 
    var i, rows = [], max = obj.getRowCount(); 
    if (group=="") { 
       obj.clearRowModel();
       obj.clearSortModel();
       obj.clearScrollModel();
       obj.setRowCount(countr);
       obj.refresh(); }
    else {
       for (i=0; i<max; i++){ 
           if (group == "" || obj.getCellValue(col, i) == group){ 
              rows.push(i); 
           } 
       } 
       obj.setRowCount(rows.length);
       obj.setRowIndices(rows); 
       obj.refresh();
    };   
}; 
//-----------------------------------------------------------------------------
//  convert date
//-----------------------------------------------------------------------------
//convert dd/MM/YYYY --> yyyymmdd
function datetime(text) {
return (text.substr(6, 4)+"-"+text.substr(0, 2)+"-"+text.substr(3, 2));
};
//-----------------------------------------------------------------------------
//  NEW DOCUMENT
//-----------------------------------------------------------------------------
function ArNewDoc(tpop) {
//  ar_records_alldoc = pipe.event({action:'get_alldoc'},true);
//  grid_alldoc.setCellText(ar_records_alldoc);
//  grid_alldoc.setRowCount(ar_records_alldoc.length);
//  grid_alldoc.refresh();
};
//-----------------------------------------------------------------------------
//  Number Format
//-----------------------------------------------------------------------------
// ??????????? ????? ?????, ?????? number_format() ? PHP
function number_format(number, decimals, dec_point, thousands_sep){
  var exponent = "";
  var numberstr = number.toString ();
  var eindex = numberstr.indexOf ("e");
 var i, z;
  if(eindex > -1){
    exponent = numberstr.substring (eindex);
    number = parseFloat (numberstr.substring (0, eindex));
  }
  
  if(decimals != null){
    var temp = Math.pow (10, decimals);
    number = Math.round (number * temp) / temp;
  }
  var sign = number < 0 ? "-" : "";
  var integer = (number > 0 ? 
      Math.floor (number) : Math.abs (Math.ceil (number))).toString ();
  
  var fractional = number.toString ().substring (integer.length + sign.length);
  dec_point = dec_point != null ? dec_point : ".";
  fractional = decimals != null && decimals > 0 || fractional.length > 1 ? (dec_point + fractional.substring (1)) : "";
  if(decimals != null && decimals > 0){
    for(i = fractional.length - 1, z = decimals; i < z; ++i)
      fractional += "0";
  }
  
  thousands_sep = (thousands_sep != dec_point || fractional.length == 0) ? 
                  thousands_sep : null;
  if(thousands_sep != null && thousands_sep != ""){
  for (i = integer.length - 3; i > 0; i -= 3)
   integer = integer.substring (0 , i) + thousands_sep + integer.substring (i);
  }
  return sign + integer + fractional + exponent;
}

//-----------------------------------------------------------------------------
//  
//-----------------------------------------------------------------------------
