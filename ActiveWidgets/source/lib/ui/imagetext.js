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

AW.UI.ImageText = AW.System.Control.subclass();

AW.UI.ImageText.create = function(){

	AW.Templates.ImageText.create.call(this);

	var obj = this.prototype;
	var _super = this.superclass.prototype;

	obj.setClass("templates", "");
	obj.setClass("ui", "imagetext");
	obj.setClass("item", "control");
	obj.setClass("text", "expand");

	function _tabIndex(){
		return this.getTabProperty("index");
	}

	if (AW.ie || AW.gecko) {
		obj.getContent("box/text").setAttribute("tabIndex", _tabIndex);
	}

	obj.refresh = function(){
		if (this.getContent("box/text").element()){
			this.refreshClasses();
			this.refreshStyles();
			this.refreshAttributes();
			this.getContent("box/image").refreshClasses();
			this.getContent("box/text").refreshAttributes();
			this.getContent("box/text").refreshContents();

			if (this.getContent("data")) {
				this.getContent("data").refreshAttributes();
			}
		}
		else {
			_super.refresh.call(this);
		}
	};

	var _refresh = function(){this.refresh()};

	var itemController = {
		onControlTextChanged:	_refresh,
		onControlImageChanged:	_refresh,
		onControlValueChanged:	_refresh,
		onControlLinkChanged:	_refresh,
		onControlTooltipChanged:_refresh,
		onControlStateChanged:	_refresh };

	obj.setController("item", itemController);

	obj.setEvent("onactivate", function(event){
		var e = this.getContent("box/text").element();
		if (e && event.srcElement != e ){
			this.setTimeout(function(){
				if (this.$active) {
					e.setActive();
				}
			});
		}
	});

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
			this.getContent("box/text").element().focus();
		}
		catch(err){
		}
	};

	obj.onControlDisabledChanged = function(value){
		this.setClass("disabled", value ? "control" : null);
		this.setAttribute("disabled", value ? true : null);
		this.getContent("box/text").setAttribute("disabled", value ? true : null);
	};

	obj.setSize = function(width, height){

		if (typeof(width) != "undefined") {
			if (AW.ms5 || AW.ms6 || this._textClass != "expand"){
				this.setStyle("width", width - AW.dx + "px");
			}
			else {
				if (AW.ff2 || AW.ff15 || AW.ff1) { //firefox bug
					this.setStyle("min-width", width + "px");
				}
				else if (AW.opera && opera.version() < 9.5 && this._uiClass == "button") { // opera bug - always uses content-box for min-width
					this.setStyle("min-width", width - 8 + "px");
				}
				else {
					this.setStyle("min-width", width - AW.dx + "px");
				}
				if (AW.ms7 || AW.ms8){
					this.getContent("box").setStyle("min-width", width - AW.dx + "px");
				}
			}
		}

		if (typeof(height) != "undefined") {
			this.setStyle("height", height - AW.dy + "px");
		}
	};

};


