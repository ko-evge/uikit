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

(function(){

	var ua = navigator.userAgent || "";

	AW.browser = "";

	if (document.recalc || document.documentMode) {AW.browser = "ie"}
	if (window.XULElement) {AW.browser = "gecko"}
	if (window.opera){AW.browser = "opera"}
	if (ua.match("WebKit")){AW.browser = "webkit"}
	if (ua.match("Konqueror")){AW.browser = "konqueror"}

	if (AW.browser){AW[AW.browser] = true}

	if (AW.webkit){
		if (ua.match("Chrome")){
			AW.chrome = true;
		}
		else if (ua.match("Safari")){
			AW.safari = true;
		}
	}

	if (AW.safari && !document.evaluate){
		AW.safari2 = true;
	}

	if (!ua.match("Windows")){AW.unix = true}

	AW.theme = "classic";

	if (ua.match("Windows NT 6")){AW.theme = "vista"}
	if (ua.match("Windows NT 5.1")){AW.theme = "xp"}
	if (ua.match("Mac OS")){AW.theme = "aqua"}

	AW.strict = ("" + document.compatMode).match("CSS");

	// safari 2 does not support box-sizing
	// safari 3.0.4 does not support document.compatMode
	if (AW.safari2 ||
	    (AW.safari && !document.compatMode && document.doctype &&
	 	 (document.doctype.systemId ||
		   !("" + document.doctype.publicId).match(/(Transitional|Final)/)))){
	   	AW.strict = true;
	}

	if (!AW.strict) {AW.quirks = true}

	var htmlc = " aw-all";

	if (AW.strict) {htmlc += " aw-strict"}
	if (AW.quirks) {htmlc += " aw-quirks"}
	if (AW.browser){htmlc += " aw-" + AW.browser}
	if (AW.safari) {htmlc += " aw-safari"}
	if (AW.chrome) {htmlc += " aw-chrome"}
	if (AW.unix) {htmlc += " aw-unix"}
	if (AW.theme) {htmlc += " aw-" + AW.theme}
	if (AW.theme && AW.strict) {htmlc +=" aw-" + AW.theme + "-strict"}

	if (AW.ie) {
		var s = document.documentElement.currentStyle;
		if (s.columns || ua.match("MSIE 10")){
			AW.ie10 = true;
			htmlc += " aw-ie10";
		}
		else if (s.fontVariant){
			AW.ie9 = true;
			htmlc += " aw-ie9";
		}
		else if (s.outlineStyle){
			AW.ie8 = true;
			htmlc += " aw-ie8";
		}
		else if (s.maxWidth){
			AW.ie7 = true;
			htmlc += " aw-ie7";
		}
		else if (s.textOverflow){
			AW.ie6 = true;
			htmlc += " aw-ie6";
		}
		else if (s.writingMode){
			AW.ie5 = true;
			htmlc += " aw-ie5";
		}
		s = null;

		if (document.documentMode >= 10){
			AW.ms10 = true;
			htmlc += " aw-ms10";
		}
		else if (document.documentMode == 9){
			AW.ms9 = true;
			htmlc += " aw-ms9";
		}
		else if (document.documentMode == 8){
			AW.ms8 = true;
			htmlc += " aw-ms8";
		}
		else if (document.documentMode == 7 || (AW.ie7 && AW.strict)) {
			AW.ms7 = true;
			htmlc += " aw-ms7";
		}
		else if (AW.ie6 && AW.strict) {
			AW.ms6 = true;
			htmlc += " aw-ms6";
		}
		else {
			AW.ms5 = true;
			htmlc += " aw-ms5";
		}
	}

	if (AW.gecko) {
		if (window.mozRequestAnimationFrame){
			AW.ff4 = true;
			htmlc += " aw-ff4";
		}
		else if (document.elementFromPoint){
			AW.ff3 = true;
			htmlc += " aw-ff3";
		}
		else if (window.globalStorage){
			AW.ff2 = true;
			htmlc += " aw-ff2";
		}
		else if (window.XPCNativeWrapper){
			AW.ff15 = true;
			htmlc += " aw-ff15";
		}
		else {
			AW.ff1 = true;
			htmlc += " aw-ff1";
		}

		// recent firefox
		if (AW.ff4 || AW.ff3){
			AW.ff = true;
			htmlc += " aw-ff";
		}

		//old firefox
		if (AW.ff2 || AW.ff15 || AW.ff1){
			AW.ffx = true;
			htmlc += " aw-ffx";
		}
	}

	// png graphics support
	if (AW.ie5 || AW.ie6){ 	// alpha-channel png bug
		htmlc += " aw-png1 aw-" + AW.theme + "-png1";
	}
	else {					// good png support
		htmlc += " aw-png2";
	}


	AW._htmlClasses = htmlc;

	if (AW.strict) {
		AW.dx = 8;
		AW.dy = 4;
	}
	else {
		AW.dx = 0;
		AW.dy = 0;
	}

	AW.sx = 20;
	AW.sy = 20;

})();
