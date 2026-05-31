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

AW.UI.CheckedList = AW.UI.List.subclass();

AW.UI.CheckedList.create = function(){

	var obj = this.prototype;

	obj.setClass("ui", "checkedlist");
	obj.setItem(new AW.Templates.CheckedItem);
	obj.setController("selection", AW.UI.Controllers.Checked);

};

