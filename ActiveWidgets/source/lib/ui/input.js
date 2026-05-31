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

AW.UI.Input = AW.UI.ImageText.subclass();

AW.UI.Input.create = function(){

	var obj = this.prototype;

	obj.setClass("ui", "input");
	obj.setClass("input", "box");
	obj.setClass("text", "");

	var text = new AW.HTML.INPUT;
	text.setClass("item", "text");
	text.setAttribute("type", "text");
	text.setAttribute("value", function(){
		return this.getControlProperty("text");
	});
	text.setAttribute("tabIndex", function(){
		return this.getTabProperty("index");
	});

	obj.setContent("box/text", text);

	var _edit = function(){
		this.setTimeout(function(){
			if (this.$active) {
				this.startEdit();
			}
		});
	};

	var _validate = function(){
		AW._commitEdit();
	};

	var _cancel = function(event){
		AW._cancelEdit();
		AW.setReturnValue(event, false);
	};

	var _refresh = function(){this.refresh()};

	var _text = function(){
		var e = this.getContent("box/text").element();
		var text = this.getControlProperty("text");
		if (e && e.value != text){
			if (AW.ie) {
				var r = document.selection.createRange();
				r.collapse();
				r.select();
			}
			e.value = text;
		}
		if (this.getContent("data")){
			e = this.getContent("data").element();
			if (e) {
				e.value = this.getControlData();
			}
		}
	};

	var itemController = {
		onKeyEnter:				_validate,
		onKeyEscape:			_cancel,
		onControlActivated:		_edit,
		onControlTextChanged:	_text,
		onControlValueChanged:	_text,
		onControlDataChanged:	_text,
		onControlImageChanged:	_refresh,
		onControlLinkChanged:	_refresh,
		onControlTooltipChanged:_refresh,
		onControlStateChanged:	_refresh };

	obj.setController("item", itemController);

	if (AW.webkit || AW.opera || AW.konqueror) {

		obj.setContent("focus", "");
	}

	obj.focus = function(){
		try {

			if (this.getControlDisabled()){
				return;
			}

			this.getContent("box/text").element().focus();
		}
		catch(err){
		}
	};

};


