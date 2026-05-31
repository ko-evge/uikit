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

AW.UI.List = AW.System.Control.subclass();

AW.UI.List.create = function(){

	var obj = this.prototype;
	var _super = this.superclass.prototype;

	obj.setClass("ui", "list");
	obj.setClass("list", "control");
	obj.setClass("flow", "vertical");
	obj.setClass("text", "normal");

	var box = new AW.HTML.SPAN;
	box.setClass("list", "box");

	if (AW.gecko){
		box.setAttribute("tabIndex", "-1");
	}

	if (AW.ie && AW.strict){
		box.setStyle("width", "expression(this.parentElement.offsetWidth-4)");
	}

	box.setContent("html", function(){return this.getLayout()});
	obj.setContent("box", box);

//	---

	var UI = AW.UI.Controllers;

	obj.setController("list", UI.List);
	obj.setController("actions", UI.Actions);
	obj.setController("changes", UI.Changes);
	obj.setController("selection", UI.Single);
	obj.setController("state", UI.State);

//	---

	obj.defineTemplate("layout", function(){return this.getScroll()});
	obj.defineTemplate("scroll", function(){return this.getView()});
	obj.defineTemplate("view", new AW.Templates.List);
	obj.defineTemplate("item", new AW.Templates.ImageText);


//	---

	function value(i){
		var text = this.getItemText(i);
		var format = this.getItemFormat(i);
		return format ? format.textToValue(text) : text;
	}

	function count(){
		return this.getItemCount();
	}

	function position(i){
		return Number(i);
	}

	var models = {
		item 		: {count:0, text:"", image:"", link:"", value:value, format:"", tooltip:"", state:"", selected:false},
		view 		: {count:count, position:position, offset:0, expanded:false},
		selection	: {mode:"single"},
		current		: {item:0}
	};

	obj.defineModel("item", models.item);
	obj.defineModel("view", models.view);
	obj.defineModel("current", models.current);
	obj.defineModel("selected", {});
	obj.defineModel("selection", models.selection);
	obj.defineModel("state", {});

	obj.defineViewProperty("indices", "", true);
	obj.defineSelectedProperty("items", [], true);


	obj.calculateItemState = function(i){

		var state = "";

		if (this.getCurrentItem()==i){state = "current"}
		if (this.getItemSelected(i)){state = "selected"}

		if (this.getItemState(i) != state){
			this.setItemState(state, i);
		}
	};

	obj.toString = function(){
		if (AW.ie || AW.gecko) {
			this.setTimeout(function(){
				try {
					var i = this.getCurrentItem();
					var t = this.getTabIndex();
					this.getItem(i).getContent("box/text").element().tabIndex = t;
				}
				catch(err){
				}
			});
		}
		return _super.toString.call(this);
	};

	if (AW.webkit || AW.opera || AW.konqueror) {

		var focus = new AW.HTML.SPAN;
		focus.setTag("a");
		focus.setClass("control", "focus");
		focus.setAttribute("tabIndex", function(){return this.getTabProperty("index")});

		if (AW.webkit) {focus.setAttribute("href", "#");}
		if (AW.opera) {focus.setContent("html", "&nbsp;");}

		obj.setContent("focus", focus);
	}

	obj.focus = function(){
		try {

			if (this.getControlDisabled()){
				return;
			}
			if (AW.webkit || AW.opera || AW.konqueror) {
				this.getContent("focus").element().focus();
				return;
			}
			var i = this.getCurrentItem();
			this.getItem(i).getContent("box/text").element().focus();
		}
		catch(err){
		}
	};

	obj.onControlDisabledChanged = function(value){
		this.setClass("disabled", value ? "control" : null);
		this.setAttribute("disabled", value ? true : null);
	}

};

