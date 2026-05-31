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

	var obj;
	var originalText;
	var originalNode;


	AW._startEdit = function(target, startText){

		obj = target;

		if (!obj.element() || raiseEvent("editStarting")){
			return false;
		}

		originalText = obj.getControlProperty("text");

		obj.element().className += " aw-edit-" + (obj.setController ? "control" : obj.$name);

		var e = obj.getContent("box/text").element();

		if (!e || !e.tagName.match(/input/i)){

			originalNode = e;
			e = document.createElement("input");
			e.setAttribute("id", originalNode ? originalNode.id : obj.getId() + "-box-edit");
			e.setAttribute("type", "text");
			e.setAttribute("class", originalNode ? originalNode.className : "aw-item-text");
			e.setAttribute("autocomplete", "off");
			e.setAttribute("value", originalText);
			e.style.width = calcWidth(originalNode);

			if (originalNode){
				if (AW.ie) {
					originalNode.parentNode.insertBefore(e, originalNode);
					e.focus();
					e.parentNode.removeChild(originalNode);
				}
				else {
					originalNode.parentNode.replaceChild(e, originalNode); // required for Safari 2.0
					e.focus();
				}
			}
			else {
				var parent = obj.element();
				parent.innerHTML = "<span class=\"aw-item-ruler\"></span>";
				parent.appendChild(e);
				e.focus();
			}
		}
		else {
			e.style.width = calcWidth(e);
		}

		if (AW.ie){
			if (!AW.ms8) {
				e.setExpression("aw-value", "this.value");
			}
			e.attachEvent("oncontextmenu", nobubble);
			e.attachEvent("onselectstart", nobubble);
			e.attachEvent("onpropertychange", oninput);
			e.attachEvent("onkeydown", onkeydown);
			e.attachEvent("onbeforedeactivate", onbeforedeactivate);
		}
		else {
			e.addEventListener("contextmenu", nobubble, false);
			e.addEventListener("input", oninput, false);
			e.addEventListener("keydown", onkeydown, false);
			obj.element().addEventListener("mousedown", onmousedown, true);
		}

		if (obj.$owner) {
			obj.$owner.$edit = true;
		}

		AW._edit = obj.getId();

		raiseEvent("editStarted");

		if (typeof(startText) == "string"){
			obj.setControlProperty("text", startText);
			e.value = startText;
		}
		else {
			e.select();
		}

		e.parentNode.scrollTop = 0;
		e.parentNode.scrollLeft = 0;

		e = null;

		return true;
	};

	AW._endEdit = function(){

		// prevent recursive calls in FF
		if (AW._endEditFlag){
			return false;
		}

		AW._endEditFlag = true;

		try {

			if (originalText != obj.getControlProperty("text") && !AW._commitEdit()){
				return false;
			}

			if (raiseEvent("editEnding")){
				return false;
			}

			if (AW.$popup){
				AW.$popup.hidePopup();
			}

			var e = obj.element().getElementsByTagName("INPUT")[0];

			if (AW.ie){
				if (!AW.ms8) {
					e.removeExpression("aw-value");
				}
				e.detachEvent("onselectstart", nobubble);
				e.detachEvent("oncontextmenu", nobubble);
				e.detachEvent("onpropertychange", oninput);
				e.detachEvent("onkeydown", onkeydown);
				e.detachEvent("onbeforedeactivate", onbeforedeactivate);
			}
			else {
				e.removeEventListener("contextmenu", nobubble, false);
				e.removeEventListener("input", oninput, false);
				e.removeEventListener("keydown", onkeydown, false);
				obj.element().removeEventListener("mousedown", onmousedown, true);
			}

			e.parentNode.scrollLeft = 0;

			var text = obj.getControlProperty("text");

			if (originalNode){
				originalNode.innerHTML = text;
				if (AW.ie) {
					e.parentNode.insertBefore(originalNode, e);
					removeElement(e);
				}
				else {
					e.parentNode.replaceChild(originalNode, e);
				}
				originalNode = null;
			}
			else if (!obj.getContent("box/text").element()){
				if (AW.ie) {
					e.parentNode.removeChild(e.previousSibling);
					e.insertAdjacentHTML("beforeBegin", text);
					removeElement(e);
				}
				else {
					e.parentNode.innerHTML = text;
				}
			}

			e = null;

			obj.element().className = obj.element().className.replace(/ aw-edit-\w+/ig, "");

			if (obj.$owner) {
				obj.$owner.$edit = false;
			}

			AW._edit = "";

			raiseEvent("editEnded");

			return true;

		}
		finally {
			AW._endEditFlag = false;
		}
	};

	AW._commitEdit = function(){

		if (!AW._edit){
			return false;
		}

		if (raiseEvent("validating")){
			return false;
		}

		originalText = obj.getControlProperty("text");

		raiseEvent("validated");
		return true;
	};

	AW._cancelEdit = function(){

		if (!AW._edit){
			return false;
		}

		obj.setControlProperty("text", originalText);

		obj.element().getElementsByTagName("INPUT")[0].value = originalText;

		return true;
	};

	AW._updateEdit = function(){
		obj.refreshClasses();
		obj.element().className += " aw-edit-" + obj.$name;

		var e = obj.element().getElementsByTagName("INPUT")[0];
		var text = obj.getControlProperty("text");
		if (e && e.value != text) {
			if (AW.ie) {
				var r = document.selection.createRange();
				r.collapse();
				r.select();
			}
			e.value = text;
		}
		e = null;
	};

	function raiseEvent(name){
		var item = obj.setController ? "control" : obj.$name;
		var fullname = AW.camelCase("on", item, name);
		var text = obj.getControlProperty("text");
		return obj.raiseEvent(fullname, text, obj.$0, obj.$1, obj.$2);
	}

	function nobubble(event){
		if (AW.ie) {
			event.cancelBubble = true;
		}
		else {
			event.stopPropagation();
		}
	}

	function oninput(event){
		var text1 = obj.getControlProperty("text");
		var text2 = (event.srcElement||event.target).value;
		if (text2 != text1){
			obj.setControlProperty("text", text2);
		}
		var text3 = obj.getControlProperty("text");
		if (text3 != text2 ) {
			(event.srcElement||event.target).value = text3;
		}
	}

	function onkeydown(event){
		if (AW.ie) {
			var	r = event.srcElement.createTextRange();
			var s = document.selection.createRange();

			if ((event.keyCode == 36 || event.keyCode == 37) && 	// home, left arrow
				(r.compareEndPoints("StartToEnd", s)||r.compareEndPoints("StartToStart", s))){
				event.cancelBubble = true;
				r = null;
				s = null;
				return;
			}
			if ((event.keyCode == 35 || event.keyCode == 39) && 	// end, right arrow
				(r.compareEndPoints("EndToEnd", s) || r.compareEndPoints("EndToStart", s))){
				event.cancelBubble = true;
				r = null;
				s = null;
				return;
			}
		}
		else {
			if ((event.keyCode == 36 || event.keyCode == 37) && 	// home, left arrow
				event.target.selectionEnd > 0){
				event.stopPropagation();
				return;
			}
			if ((event.keyCode == 35 || event.keyCode == 39) && 	// end, right arrow
				event.target.selectionStart < event.target.value.length){
				event.stopPropagation();
				return;
			}
		}
	}

	function onbeforedeactivate(event){
		if (obj.element().contains(event.toElement)){
			event.returnValue = false;
			event.cancelBubble = true;
		}
	}


	function onmousedown(event){
		if (event.target && event.target.tagName != "INPUT"){
			event.preventDefault();
			return;
		}
	}

	function calcWidth(e){
		if (!e) {
			return "100%";
		}
		var w = e.offsetWidth + e.parentNode.clientWidth - 5;
		var i, ee = e.parentNode.childNodes;
		for (i=0; i<ee.length; i++){
			w -= (ee[i].offsetWidth+1);
		}
		return w + "px";
	}

	function removeElement(node){
		document.selection.empty(); // removes ghost cursor in ie6
		node.id = "aw-edit"; 		// hide input
		window.setTimeout(function(){
			try {
				node.parentElement.removeChild(node);
			}
			catch(err){
			}
			node = null;
		}, 0);
	}
})();