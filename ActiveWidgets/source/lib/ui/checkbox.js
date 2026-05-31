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

AW.UI.CheckBox = AW.UI.ImageText.subclass();

AW.UI.CheckBox.create = function(){

	AW.Templates.CheckBox.create.call(this);

	var obj = this.prototype;

	obj.setClass("ui", "checkbox");
	obj.setControlProperty("value", false);
	obj.setEvent("onclick", "");

	var _toggle = function(){
		if (!this.getControlDisabled()){
			this.setControlValue(!this.getControlValue());
		}
	};

	obj.setController("checkbox", {
		onKeySpace: _toggle,
		onControlClicked: _toggle
	});

};

AW.UI.Checkbox = AW.UI.CheckBox;

