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

AW.Templates.Frame = AW.System.Template.subclass();

AW.Templates.Frame.create = function(){

	var obj = this.prototype;

	obj.setClass("frame", "template");
	obj.setClass("flow", "vertical");
	obj.setClass("text", "normal");

	var box = new AW.HTML.SPAN;

	box.setClass("frame", "box");
	box.setClass("list", "box");

	if (AW.ie && AW.strict){
		box.setStyle("width", "expression(this.parentElement.offsetWidth-4)");
	}

	box.setContent("html", function(){
		return this.getLayout();
	});

	obj.setContent("box", box);

};

