/*****************************************************************

	ActiveWidgets 2.5.6
	Copyright (C) 2003-2011 ActiveWidgets SARL. All Rights Reserved. 
	http://www.activewidgets.com/

	WARNING: This software program is protected by copyright law 
	and international treaties. Unauthorized reproduction or
	distribution of this program, or any portion of it, may result
	in severe civil and criminal penalties, and will be prosecuted
	to the maximum extent possible under the law.

*****************************************************************/

AW.Formats.Date = AW.System.Format.subclass();

AW.Formats.Date.create = function(){

/****************************************************************

	Date formatting class.

*****************************************************************/

	var obj = this.prototype;

	obj.date = new Date();

	var shortMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var longMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	var shortWeekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	var longWeekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

	if (!obj.shortMonths){obj.shortMonths = shortMonths}
	if (!obj.longMonths){obj.longMonths = longMonths}
	if (!obj.shortWeekdays){obj.shortWeekdays = shortWeekdays}
	if (!obj.longWeekdays){obj.longWeekdays = longWeekdays}

	obj.digits = [];

	for(var i=0; i<100; i++){obj.digits[i] = i<10 ? "0" + i : "" + i}

	var tokens = {
		"hh"	: "this.digits[this.date.getUTCHours()]",
		"h"		: "this.date.getUTCHours()",
		":mm"	: "':'+this.digits[this.date.getUTCMinutes()]",
		"mm:"	: "this.digits[this.date.getUTCMinutes()]+':'",
		"ss"	: "this.digits[this.date.getUTCSeconds()]",
		"tt"	: "(this.date.getUTCHours()>11?'PM':'AM')",
		"dddd"	: "this.longWeekdays[this.date.getUTCDay()]",
		"ddd"	: "this.shortWeekdays[this.date.getUTCDay()]",
		"dd"	: "this.digits[this.date.getUTCDate()]",
		"d"		: "this.date.getUTCDate()",
		"mmmm"	: "this.longMonths[this.date.getUTCMonth()]",
		"mmm"	: "this.shortMonths[this.date.getUTCMonth()]",
		"mm"	: "this.digits[this.date.getUTCMonth()+1]",
		"m"		: "(this.date.getUTCMonth()+1)",
		"yyyy"	: "this.date.getUTCFullYear()",
		"yy"    : "this.digits[this.date.getUTCFullYear()%100]"
	};

	var tokens12 = {}, match = "";

	for(i in tokens){
		if (typeof(i) == "string"){
			tokens12[i] = tokens[i];
			match += "|" + i;
		}
	}

	tokens12.hh	= "this.digits[1+(this.date.getUTCHours()+11)%12]";
	tokens12.h	= "(1+(this.date.getUTCHours()+11)%12)";

	var re = new RegExp("(" + match.substr(1)+")", "gi");

	var reverse = {
		"hh"	: ["(\\d{1,2})", "a[3]=", ";"],
		"h" 	: ["(\\d{1,2})", "a[3]=", ";"],
		":mm"	: [":(\\d{1,2})", "a[4]=", ";"],
		"mm:"	: ["(\\d{1,2}):", "a[4]=", ";"],
		"ss"	: ["(\\d{1,2})", "a[5]=", ";"],
		"tt"	: ["(AM|PM)",	 "a[3]=", "=='AM'?a[3]%12:a[3]%12+12;"],
		"dd"	: ["(\\d{1,2})", "a[2]=", ";"],
		"d"		: ["(\\d{1,2})", "a[2]=", ";"],
		"mmmm"	: ["([^\\s\\x2c-\\x2f\\x5c;]+)", "a[1]=this.rMonths[", ".toLowerCase()];"],
		"mmm"	: ["([^\\s\\x2c-\\x2f\\x5c;]+)", "a[1]=this.rMonths[", ".toLowerCase()];"],
		"mm"	: ["(\\d{1,2})", "a[1]=Number(", ")-1;"],
		"m"		: ["(\\d{1,2})", "a[1]=Number(", ")-1;"],
		"yyyy"	: ["(\\d{1,4})", "a[0]=Number(", "); if(a[0]<30){a[0]+=2000};"],
		"yy"    : ["(\\d{1,4})", "a[0]=Number(", "); if(a[0]<30){a[0]+=2000};"]
	};

	var delim = /[\s\x2c-\x2f\x5c;]+/g;

/****************************************************************

	Allows to specify the format for the text output.

	@param	format	(String) Format pattern.

*****************************************************************/

	obj.setTextFormat = function(format){
		format = format.replace(/am\/pm/i, "tt");
		var tok = format.match("tt") ? tokens12 : tokens;
		var	code = format.replace(re, function(i){return "'+" + tok[i.toLowerCase()] + "+'"});
		code = "if (isNaN(value) || (value === this._valueError)) return this._textError;" +
				 "this.date.setTime(value + this._textTimezoneOffset);" +
				("return '" + code + "'").replace(/(''\+|\+'')/g, "");
		this.valueToText = new Function("value", code);

	//	-------------------------------------------------

		var num = 0;
		code = "var a=[this._year,0,1]; if(String(text).match(this._t2v)){\n";

		function item(i){
			i = i.toLowerCase();
			if (reverse[i])  {
				code += reverse[i][1] + "RegExp.$" + (++num) + reverse[i][2];
				return reverse[i][0];
			}
			else {
				return "\\w+";
			}
		}

		this._t2v = new RegExp(format.replace(delim, "[\\s\\x2c-\\x2f\\x5c;]+").replace(re, item));
		code += "\n return Date.UTC.apply(this, a) - this._textTimezoneOffset} else {return this._valueError}";
		this.textToValue = new Function("text", code);

		this.rMonths = {};

		for(var m=0; m<12; m++){
			this.rMonths[m+1] = m;
			this.rMonths[this.digits[m+1]] = m;
			this.rMonths[shortMonths[m].toLowerCase()] = m;
			this.rMonths[longMonths[m].toLowerCase()] = m;
			this.rMonths[this.shortMonths[m].toLowerCase()] = m;
			this.rMonths[this.longMonths[m].toLowerCase()] = m;
		}

		this._year = (new Date).getUTCFullYear();
	};

	var xmlExpr = /(\d\d\d\d)-(\d\d)-(\d\d)[T ]?(\d\d)?(:\d\d)?(:\d\d)?(\.\d+)?Z?([+-]\d\d)?:?(\d\d)?/;
	var xmlOut = "$1/$2/$3 $4$5$6 GMT$8$9";

	var auto = function(data){
		var value = Date.parse(data + this._dataTimezoneCode);
		return isNaN(value) ? this._valueError : value;
	};

	var RFC822 = function(data){
		var value = Date.parse(data);
		return isNaN(value) ? this._valueError : value;
	};

	var ISO8601 = function(data){
		var value = Date.parse(data.replace(xmlExpr, xmlOut));
		return isNaN(value) ? this._valueError : value;
	};

/****************************************************************

	Allows to specify the wire format for data input.

	@param	format	(String) Format pattern.

*****************************************************************/

	obj.setDataFormat = function(format){
		if (format == "RFC822" || format == "rfc822") {
			this.dataToValue = RFC822;
		}
		else if (format == "ISO8601" || format == "iso8601" || format == "ISO8061") {
			this.dataToValue = ISO8601;
		}
		else {
			this.dataToValue = auto;
		}
	};

/****************************************************************

	Allows to specify the timezone used for the text output.

	@param	value	(Number) Timezone offset.

*****************************************************************/

	obj.setTextTimezone = function(value){
		this._textTimezoneOffset = value;
	};

/****************************************************************

	Allows to specify the timezone used for the data input.

	@param	value	(Number) Timezone offset.

*****************************************************************/

	obj.setDataTimezone = function(value){
		if (!value) {
			this._dataTimezoneCode = " GMT";
		}
		else {
			this._dataTimezoneCode = " GMT" +
				(value>0 ? "+" : "-") +
				this.digits[Math.floor(Math.abs(value/3600000))] +
				this.digits[Math.abs(value/60000)%60];
		}
	};

	var localTimezone = - obj.date.getTimezoneOffset() * 60000;

	obj.setTextTimezone(localTimezone);
	obj.setDataTimezone(localTimezone);

	obj.setTextFormat("m/d/yyyy");
	obj.setDataFormat("default");

};


