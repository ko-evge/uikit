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

AW.Templates.CheckBox = AW.Templates.ImageText.subclass();

AW.Templates.CheckBox.create = function(){

	var obj = this.prototype;

	obj.setClass("value", function(){return this.getControlProperty("value") || false});
	obj.setClass("toggle", "checkbox");
	obj.setClass("templates", "checkbox");

	var marker = new AW.HTML.SPAN;
	marker.setClass("item", "marker");

	obj.setContent("box/marker", marker);

	obj.setEvent("onclick", function(){
		var value = this.getControlProperty("value");
		this.setControlProperty("value", !value);
	});

	obj.startEdit = null;

	AW._addMouseEvents(obj, "toggle");
};

AW.Templates.Checkbox = AW.Templates.CheckBox;