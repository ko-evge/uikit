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

AW._addMouseEvents = function(obj, name){

	function clear(){
		var e = this.element();
		if (e) {e.className = e.className.replace(/ aw-mouse(over|down)-\w+/g, "")}
		e = null;
	}

	if (obj.setController) { // control
		if (name) {
			obj.setController("highlight", {
				onControlMouseOver: function(){
					if (this._controlDisabled){return}
					var e = this.element();
					if (e) {e.className += " aw-mouseover-" + name}
					e = null;
				},
				onControlMouseDown: function(){
					if (this._controlDisabled){return}
					var e = this.element();
					if (e) {e.className += " aw-mousedown-" + name}
					e = null;
				},
				onControlMouseOut: clear,
				onControlMouseUp: clear
			});
		}
	}
	else { // template

		obj._raiseEvents = true;

		obj.onMouseOver = function(){
			if (this.$owner && this.$owner._controlDisabled){return}
			var e = this.element();
			if (e) {
				e.className += " aw-mouseover-" + this.$name + (name ? " aw-mouseover-" + name : "");
				if (AW.ie) {var h = e.offsetHeight}
			}
			e = null;
		};

		obj.onMouseDown = function(){
			if (this.$owner && this.$owner._controlDisabled){return}
			var e = this.element();
			if (e) {
				e.className += " aw-mousedown-" + this.$name + (name ? " aw-mousedown-" + name : "");
				if (AW.ie) {var h = e.offsetHeight}
			}
			e = null;
		};

		obj.onMouseOut = clear;
		obj.onMouseUp = clear;
	}
};

AW._startEventManager = function(){

	var keyNames = {
		8:  "Backspace",
		9:  "Tab",
		13: "Enter",
		27: "Escape",
		32: "Space",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "Left",
		38: "Up",
		39: "Right",
		40: "Down",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12"};

	function keydown(event){
		var key = keyNames[event.keyCode];
		if (event.keyCode >= 48 && event.keyCode <= 90){
			key = String.fromCharCode(event.keyCode);
		}
		if (key) {
			if (event.shiftKey) {key = "Shift" + key;}
			if (event.altKey) {key = "Alt" + key;}
			if (event.ctrlKey) {key = "Ctrl" + key;}
			raiseKbEvent("onKey" + key, event);
		}
	}

	var excludeOperaKeys = {35:1, 36:1, 45:1, 46:1};

	function keypress(event){
		if ((AW.ie ||
			(AW.opera && event.which && (event.keyCode > 31 || event.keyCode == 13) && !excludeOperaKeys[event.keyCode]) ||
			(event.charCode && event.charCode < 63000)) &&
			!(event.altKey || event.ctrlKey)){
			raiseKbEvent("onKeyPress", event);
		}
	}

	function keyup(){
		AW._scrollWait = false;
	}

	function raiseKbEvent(name, event){
		try {

			var target = event.srcElement || event.target;
			var obj, e = target;

			while(e) {
				if (e.id && typeof(e.id) == "string"){
					obj = AW.object(e.id, true);
					if (obj && obj.setController) {
						obj.raiseEvent(name, event);
						e = obj.element();
					}
				}
				e = e.parentNode;
			}
		}
		catch(err){
			// ignore errors
		}
	}

	function raiseControlEvent(name, obj, event){

		var name0, name1;

		if (obj.setController){ // control
			if ((AW.webkit || AW.opera || AW.konqueror) && !event.done) {

				if (name.match("MouseDown") && event.target.tagName != "INPUT" && event.target.tagName != "SELECT" && !AW.safari2) {
					event.preventDefault();
				}

				if (name=="Clicking"){
					if (obj.getId() != AW._edit) {
						obj.focus();
					}
					event.done = true;
				}
			}

			if ((!obj.$active || AW._edit) && (name.indexOf("Click") > -1)){
				return;
			}

			name1 = "onControl" + name;
			return obj.raiseEvent(name1, event, obj.$0, obj.$1, obj.$2);
		}

		if (obj.$name && obj.raiseEvent) { // template
			if ((AW.webkit || AW.opera || AW.konqueror) && !event.done) {

				if (name.match("MouseDown") && event.target.tagName != "INPUT" && event.target.tagName != "SELECT" && !AW.safari2) {
					event.preventDefault();
				}

				if (name=="Clicking") {
				 	if (obj.getId() != AW._edit && obj.$owner.$name != "popup"){
						obj.$owner.focus();
					}
					event.done = true;
				}
			}
			if (!obj._raiseEvents) {
				return;
			}

			if (!AW.$popup && (!obj.$owner.$active || AW._edit) && (name.indexOf("Click") > -1)){
				return;
			}

			name0 = "on" + name;
			if (typeof obj[name0] == "function") {
				obj[name0](event);
			}

			name1 = AW.camelCase("on", obj.$name, name);
			return obj.$owner.raiseEvent(name1, event, obj.$0, obj.$1, obj.$2);
		}
	}

	var targets = {};

	function handleMouse(e, event){
		try{

			if (AW.ignoreMouse){
				return;
			}

			var i, obj, temp = {};

			while(e) {
				if (e.id && typeof(e.id) == "string"){
					obj = AW.object(e.id, true);
					if (obj) {
						e = obj.element();
						temp[e.id] = true;
					}
				}
				e = e.parentNode;
			}

			for (i in targets){
				if (!temp[i]){
					obj = AW.object(i, true);
					if (obj){
						raiseControlEvent("MouseOut", obj, event);
					}
				}
			}

			for (i in temp){
				if (!targets[i]){
					obj = AW.object(i, true);
					if (obj){
						raiseControlEvent("MouseOver", obj, event);
					}
				}
			}
			targets = temp;
		}
		catch(error){
			//
		}
	}

	function copyEvent(e, type){
		if (AW.ie && e.type != "mousedown"){
			return document.createEventObject(e);
		}		else if (AW.webkit || AW.opera || AW.konqueror || e.type == "mousedown") {
			return {
				type: e.type,
				ctrlKey: e.ctrlKey,
				altKey: e.altKey,
				shiftKey: e.shiftKey,
				button: e.button,
				target: e.target,
				srcElement: e.target || e.srcElement
			};
		}		else {
			var event = document.createEvent("MouseEvents");
			event.initMouseEvent(type || e.type, true, true, e.view, 1, e.screenX, e.screenY,
				e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);
			event.srcElement = e.target; // FF does not allow setting target
			return event;
		}
	}

	var clickingEvent = null;

	function raiseClickingEvent(){
		if (clickingEvent) {
			mouseClicks("Clicking")(clickingEvent);
			clickingEvent = null;
		}
	}

	var mouseDownId = "";

	function mouseClicks(name){
		return function(event){
			try{

				if (name == "MouseUp" && clickingEvent) {
					raiseClickingEvent();
				}

				var target = event.srcElement || event.target;
				var inside = false;

				var s = (event.ctrlKey ? "Ctrl" : "") +
						(event.altKey ? "Alt" : "") +
						(event.shiftKey ? "Shift" : "") + name;

				var obj, e = target;

				while(e) {
					if (e.id && typeof(e.id) == "string"){
						obj = AW.object(e.id, true);
						if (obj) {
							raiseControlEvent(s, obj, event);
							e = obj.element();
							inside = true;
						}
					}
					e = e.parentNode;
				}


				// simulated 'clicking' event
				if (name == "MouseDown" && inside) {
					clickingEvent = copyEvent(event);
					window.setTimeout(raiseClickingEvent, 10);
				}


				if (name == "MouseDown") {
					mouseDownId = "";
				}

				// remember target element if it is replaced in mousedown or clicking event
				if ((name == "MouseDown" || name == "Clicking") && inside && (target !== AW.element(target.id))) {
					mouseDownId = target.id;
				}


				// simulated click event if one is lost due to refresh()
				if (name == "MouseUp" && mouseDownId && (mouseDownId == target.id)){
					if (AW.ie){
						event.srcElement.fireEvent("onclick", copyEvent(event));
					}
					else {
						event.target.dispatchEvent(copyEvent(event, "click"));
					}
				}

				e = null;
				target = null;

			}
			catch(err){
			}
		}
	}

	function focusIE(name){
		return function(event){
			try {

				if (event.srcElement.document !== document){
					return; // popup
				}

				if (name == "Deactivating" && AW._edit) {
					if (!AW._endEdit()){
						return false;
					}
				}

				var obj, e = AW.srcElement(event);
				while(e) {
					if (e.id && typeof(e.id) == "string"){
						obj = AW.object(e.id, true);
						if (obj && obj.setController) { // control

							switch(name){
								case "Deactivating":
									if(!obj.element().contains(event.toElement)){
										if(AW.ie5){
											obj._deactivate = true;
										}
										if(raiseControlEvent(name, obj, event)){
											event.returnValue = false;
										}
									}
									else if(AW.ie5){
										obj._deactivate = false;
									}
									break;
								case "Activating":
									if(!obj.$active){
										if(raiseControlEvent(name, obj, event)){
											event.returnValue = false;
										}
									}
									break;
								case "Deactivated":
									if(!obj.element().contains(event.toElement)){
										if(AW.ie5 && !obj._deactivate) {
											break; // IE5 does not set toElement
										}
										obj.$active = false;
										if(raiseControlEvent(name, obj, event)){
											event.returnValue = false;
										}
									}
									break;
								case "Activated":
									if(!obj.$active){
										obj.$active = true;
										if(raiseControlEvent(name, obj, event)){
											event.returnValue = false;
										}
									}
									break;
							}

							e = obj.element();
						}
					}
					e = e.parentNode;
				}
			}
			catch(err){
			}
		}
	}

	var handlers = {

		onkeypress:	 keypress,
		onkeydown:	 keydown,
		onkeyup:	 keyup,

		onmousemove: function(event){handleMouse(AW.srcElement(event), event)},
		onmouseover: function(event){handleMouse(AW.srcElement(event), event)},
		onmouseout: function(event){handleMouse(AW.toElement(event), event)},

		onmousedown: mouseClicks("MouseDown"),
		onmouseup:	 mouseClicks("MouseUp"),
		onclick:	 mouseClicks("Clicked"),
		ondblclick:  mouseClicks("DoubleClicked"),

		onbeforeactivate:	focusIE("Activating"),
		onbeforedeactivate: focusIE("Deactivating"),
		onactivate: 		focusIE("Activated"),
		ondeactivate: 		focusIE("Deactivated")
	};

	var activeElements = {}, blurFlag;

	function focusemu(event){
		try{

			if (AW.opera && event.srcElement === document.body ){
				return; // opera 9.2
			}

			if (AW.opera && event.srcElement === document ){
				return; // opera 9.5
			}

			if (AW.gecko && event.target === document && event.type){
				return bluremu(event);
			}

			blurFlag = false;

			if (AW.lockFocus){
				return;
			}

			var e = event.target;
			var prevFocus = AW._focus;
			AW._focus = e.id;

			var obj, a = {};

			while(e) {
				if (e.id && typeof(e.id) == "string"){
					obj = AW.object(e.id, true);
					if (obj && obj.setController && !obj.getControlDisabled()) { // control
						e = obj.element();
						a[e.id] = true;
					}
				}
				e = e.parentNode;
			}

			function raiseEvents(a1, a2, name, state){
				var i, obj, x = {};
				for (i in a1){
					if (!a2[i] && !x[i]){
						obj = AW.object(i);
						if (obj && obj.setController){
							if (state !== undefined){
								obj.$active = state;
							}
							if (raiseControlEvent(name, obj, event)){
								return true;
							}
						}
					}
				}
			}

			obj = AW._focus && AW.object(AW._focus, true);

			if (AW._edit && (!obj || (obj && obj.getId() != AW._edit)) && !AW._endEdit()) { // goes out of editor
				AW.element(prevFocus).focus();
				return true;
			}

			if (raiseEvents(activeElements, a, "Deactivating")){
				AW.element(prevFocus).focus();
				return;
			}
			if (raiseEvents(a, activeElements, "Activating")){
				AW.element(AW._focus).blur();
				return;
			}
			raiseEvents(activeElements, a, "Deactivated", false);
			raiseEvents(a, activeElements, "Activated", true);

			activeElements = a;
		}
		catch(err){
			//
		}
	}

	function bluremu(event) {

		if (AW.opera && event.srcElement === document.body ){
			return; // opera 9.2
		}

		if (AW.opera && event.srcElement === document ){
			return; // opera 9.5
		}

		blurFlag = true;

		window.setTimeout(function(){
			window.setTimeout(function(){
				if(blurFlag){
					focusemu({target:document});
				}
			}, 0);
		}, 0);
	}

	function mousewheelemu(event){
		try{
			var e = event.target;
			while(e) {
				if (e.getAttribute && e.getAttribute("onDOMMouseScroll")){
					return AW(e, event);
				}
				e = e.parentNode;
			}
			e = null;
		}
		catch(err){
			//
		}
	}
	function scrollemu(event){
		try{
			var e = event.target;
			if (e.getAttribute && e.getAttribute("onscroll")){
				return AW(e, event);
			}
			e = null;
		}
		catch(err){
			//
		}
	}
	AW.register = function(win){

		if (win !== window){
			win.AW = AW;
			AW.docs.push(win.document);
		}

		var target = AW.ie ? win.document.documentElement : win.document;

		AW.forEach(handlers, function(name, handler){
			AW.attachEvent(target, name, handler);
		});

		if (!AW.ie) {
			target.addEventListener("focus", focusemu, true);
		}
		if (AW.ff || AW.webkit || AW.opera || AW.konqueror){
			target.addEventListener("blur", bluremu, true);
		}
		if (AW.gecko) {
			target.addEventListener("DOMMouseScroll", mousewheelemu, true);
		}
		if (AW.konqueror){ // konqueror 3.5.5 does not support onscroll attribute
			target.addEventListener("scroll", scrollemu, true);
		}
		function unregister(){
			AW.unregister(win);
			AW.detachEvent(win, "onunload", unregister);
			win = null;
		}

		AW.attachEvent(win, "onunload", unregister);
	};

	AW.unregister = function(win){

		var target = AW.ie ? win.document.documentElement : win.document;

		AW.forEach(handlers, function(name, handler){
			AW.detachEvent(target, name, handler);
		});

		if (!AW.ie) {
			target.removeEventListener("focus", focusemu, true);
		}
		if (AW.ff || AW.webkit || AW.opera || AW.konqueror){
			target.removeEventListener("blur", bluremu, true);
		}
		if (AW.gecko) {
			target.removeEventListener("DOMMouseScroll", mousewheelemu, true);
		}
		if (AW.konqueror){
			target.removeEventListener("scroll", scrollemu, true);
		}
		if (win != window){
			var i, docs = AW.docs;
			for(i=0; i<docs.length; i++) {
				if (docs[i]===win.document){
					docs.splice(i, 1);
					return;
				}
			}

			win.AW	= null;
		}
	};

	AW.register(window);

};

})();