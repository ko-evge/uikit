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

AW.Tree.Group = AW.System.Template.subclass();

AW.Tree.Group.create = function(){

	var obj = this.prototype;

	obj.setTag("span");
	obj.setClass("tree", "view");

	obj.setContent("start", function(){
		return this.$0 ? this.getItem() : "";
	});

	obj.setContent("items", function(){

		if (this.$0 && !this.getViewProperty("expanded")){
			return "";
		}
		else {
			return this.getView();
		}

	});

	obj.setContent("end", "");

};

