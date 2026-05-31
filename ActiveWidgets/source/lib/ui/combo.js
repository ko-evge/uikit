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

AW.UI.Combo = AW.UI.List.subclass();

AW.UI.Combo.create = function(){

	AW.UI.ImageText.create.call(this);
	AW.UI.Input.create.call(this);
	AW.Templates.Combo.create.call(this);

	var obj = this.prototype;

	obj.setClass("ui", "combo");
	obj.setClass("input", "");

	obj.defineTemplate("popup", new AW.Templates.Frame);

	obj.onCurrentItemChanged = function(i){
		var text = this.getItemText(i);
		this.setControlText(text);
		this.hidePopup();
	};

	obj.setController("selection", {
		onKeyUp:			"selectPreviousItem",
		onKeyDown:			"selectNextItem",
		onItemClicked:		"selectClickedItem"
	});

};

