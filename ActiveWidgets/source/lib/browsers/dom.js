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

	if (!AW.ie){

		var capture;

		AW.attachEvent = function(target, name, handler){
			if (capture){
				handler[name] = function(event){return handler.call(target, event)};
				window.addEventListener(name.replace(/^on/, ""), handler[name], true);
			}
			else{
				target.addEventListener(name.replace(/^on/, ""), handler, false);
			}
		};

		AW.detachEvent = function(target, name, handler){
			if (capture){
				window.removeEventListener(name.replace(/^on/, ""), handler[name], true);
				handler[name] = null;
			}
			else{
				target.removeEventListener(name.replace(/^on/, ""), handler, false);
			}
		};

		AW.srcElement = function(event){
			try {
				return (event.target && event.target.nodeType==3) ? event.target.parentNode : event.target;
			}
			catch(e){
				return event.target;
			}
		};

		AW.toElement = function(event){
			try {
				return (event.relatedTarget && event.relatedTarget.nodeType==3) ? event.relatedTarget.parentNode : event.relatedTarget;
			}
			catch(e){
				return event.relatedTarget;
			}
		};

		AW.setReturnValue = function(event, value){
			if (event && event.preventDefault && !value) {
				event.preventDefault();
			}
		};

		AW.setCapture = function(element){
			capture = element;
		};

		AW.releaseCapture = function(element){
			capture = null;
		};

		AW.addRule = function(stylesheet, selector, rule){
			var i = stylesheet.cssRules.length;
			stylesheet.insertRule(selector + "{" + rule + "}", i);
			stylesheet.cssRules[i].style.cssText = rule; 
		};

		AW.getRules = function(stylesheet){
			return stylesheet.cssRules;
		};

		AW.setOuterHTML = function(element, html){
		   var range = element.ownerDocument.createRange();
		   range.setStartBefore(element);
		   var fragment = range.createContextualFragment(html);
		   element.parentNode.replaceChild(fragment, element);
		};


		AW.createXMLHttpRequest = function(){
			return new XMLHttpRequest;
		};

		AW.getLeft = function(element){
			return getRectangle(element).left - getScroll(element).left;
		};

		AW.getTop = function(element){
			return getRectangle(element).top - getScroll(element).top;
		};

		var getRectangle = function(e){

			var t = e, x = 0, y = 0;

			function getPos(el){
				if (!el) {
					return {x:0, y:0};
				}
				if (el == document.body.parentNode){
					return {x:0, y:0};
				}
				if (el == document.body){
					return {x:el.offsetLeft, y:el.offsetTop};
				}

				var p = el.offsetParent;

				var pp = getPos(p);

				return {
					x: el.offsetLeft + pp.x,
					y: el.offsetTop + pp.y };
			}

			var pp = getPos(e);

			return {
				left: pp.x,
				right: pp.x + e.offsetWidth,
				top: pp.y,
				bottom: pp.y + e.offsetHeight };
		};

		var getScroll = function(e){

			var s = {left: 0, top: 0};

			if (!AW.webkit) {
				return s;
			}

			e = e.parentNode;

			while (e && e !== document.body && e !== document.documentElement){
				s.left += e.scrollLeft;
				s.top += e.scrollTop;
				e = e.parentNode;
			}

			return s;
		};


		AW.contains = function(parent, child){
			while(child){
				if(parent==child){
					return true;
				}
				child = child.parentNode;
			}
			return false;
		};
	}

	if (AW.gecko){

		AW.getLeft = function(element){
			var doc = document.getBoxObjectFor(document.body);
			return document.getBoxObjectFor(element).screenX - doc.screenX + doc.x;
		};

		AW.getTop = function(element){
			var doc = document.getBoxObjectFor(document.body);
			return document.getBoxObjectFor(element).screenY - doc.screenY + doc.y;
		};
	}

	if (document.documentElement.getBoundingClientRect){ // IE, FF3, Safari 4, Opera 10

		AW.getLeft = function(element){
			return element.getBoundingClientRect().left +
			document.documentElement.scrollLeft + document.body.scrollLeft;
		};

		AW.getTop = function(element){
			return element.getBoundingClientRect().top +
			document.documentElement.scrollTop + document.body.scrollTop;
		};
	}
	if (AW.webkit || AW.opera){

		AW.setOuterHTML = function(element, html){
			element.outerHTML = html;
		};
	}
})();

