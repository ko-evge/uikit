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

AW.Grid.Controllers.Content = {

	onScrollLeftChanged: function(x){
		this.getView().changeScrollLeft(x);
	},

	onScrollTopChanged: function(y){
		this.getView().changeScrollTop(y);
	},

	onContentWidthChanged: function(width, panel){
		this.getView().changePanelWidth(width, panel);
	},

	onContentHeightChanged: function(height, panel){
		this.getView().changePanelHeight(height, panel);
	}

};
