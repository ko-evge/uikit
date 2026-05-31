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

AW.Templates.Input = AW.Templates.ImageText.subclass();

AW.Templates.Input.create = function(){

	var obj = this.prototype;

	obj.setClass("templates", "input");
	obj.setClass("input", "box");
//	obj.setClass("text", "");

};


