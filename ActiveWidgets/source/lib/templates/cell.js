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

AW.Templates.Cell = AW.Templates.ImageText.subclass();

AW.Templates.Cell.create = function(){

	var obj = this.prototype;
	obj.setClass("templates", "cell");

	obj.getContent("box").setTag("");
	obj.getContent("box/image").setTag("");
	obj.getContent("box/ruler").setTag("");
	obj.getContent("box/text").setTag("");

	obj.refresh = function(){
		if (AW._edit == this.getId()){
			AW._updateEdit();
		}
		else {
			this.refreshClasses();
			this.refreshContents();
		}
	}
};

AW.Templates.HTML = AW.Templates.Cell;