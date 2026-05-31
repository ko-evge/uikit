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

AW.UI.Button = AW.UI.ImageText.subclass();

AW.UI.Button.create = function(){

	var obj = this.prototype;

	obj.setClass("ui", "button");

	var _click = function(event){
		if (!this.getControlDisabled()){
			this.raiseEvent("onClick", event);
		}
	};

	obj.setController("button", {
		onControlClicked: _click,
		onKeySpace: _click,
		onKeyEnter: _click
	});

	AW._addMouseEvents(obj, "button");
};


