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

AW.UI.Controllers.List = {

	onItemTemplateChanged: function(item){
		item.setClass("list", "item");
		item.setClass("items", function(){return this.getControlProperty("state") || "normal"});
		item.mapModel("control", "item");
		item.mapModel("state", "item");
	},

	onViewTemplateChanged: function(view){
		view.setClass("list", "template");
	}
};
