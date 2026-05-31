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

AW.Tree.Item = AW.Templates.ImageText.subclass();

AW.Tree.Item.create = function(){

	var obj = this.prototype;

	obj.setClass("tree", function(){
		return this.getViewProperty("count") ?  "folder" : "leaf";
	});

	obj.setClass("expanded", function(){
		return this.getViewProperty("expanded") ? "true" : "false";
	});

	var sign = new AW.HTML.SPAN;
	sign.setClass("tree", "sign");

	sign.setEvent("onclick", function(){
		this.raiseEvent("onTreeSignClicked");
	});

	obj.setContent("box/sign", sign);
};

