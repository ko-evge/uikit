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

AW.Grid.Controllers.Extended = {

	onViewTemplateChanged : function(view){
		view.mapModel("panel", "content");
		view.mapTemplate("panel", function(i, j){
			switch(i){
				case "top": return this.$owner.getTop(j);
				case "center": return this.$owner.getRows(j);
				case "bottom": return this.$owner.getBottom(j);
			}
		});
	},

	onTopTemplateChanged : function(top){
		top.mapTemplate("item", "headers");
		top.mapModel("view", "header");
	},

	onBottomTemplateChanged : function(bottom){
		bottom.mapTemplate("item", "footers");
		bottom.mapModel("view", "footer");
	}
};
