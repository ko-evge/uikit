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

	if (AW.ie) {

		try {
			document.execCommand("BackgroundImageCache", false, true);
		}
		catch(err) {
		}

		AW.attachEvent = function(element, name, handler){
			return element.attachEvent(name, handler);
		};

		AW.detachEvent = function(element, name, handler){
			return element.detachEvent(name, handler);
		};

		AW.srcElement = function(event){
			if (event) {
				return event.srcElement;
			}
		};

		AW.toElement = function(event){
			if (event) {
				return event.toElement;
			}
		};

		AW.setReturnValue = function(event, value){
			if (event) {
				event.returnValue = value;
			}
		};

		AW.setCapture = function(element){
			return element.setCapture();
		};

		AW.releaseCapture = function(element){
			return element.releaseCapture();
		};

		AW.addRule = function(stylesheet, selector, rule){
			return stylesheet.addRule(selector, rule);
		};

		AW.getRules = function(stylesheet){
			return stylesheet.rules;
		};

		AW.setOuterHTML = function(element, html){
			element.outerHTML = html;
		};

		AW.createXMLHttpRequest = function(){
			try {
				return new ActiveXObject("MSXML2.XMLHTTP");
			}
			catch(err){
			}
			try {
				return new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(err){
			}
			try {
				return new XMLHttpRequest;
			}
			catch(err){
			}
		};

		AW.getLeft = function(element){
			return element.getBoundingClientRect().left +
			document.documentElement.scrollLeft + document.body.scrollLeft;
		};

		AW.getTop = function(element){
			return element.getBoundingClientRect().top +
			document.documentElement.scrollTop + document.body.scrollTop;
		};

		AW.contains = function(parent, child){
			return parent && child ? parent.contains(child) : false;
		}
	}

})();
