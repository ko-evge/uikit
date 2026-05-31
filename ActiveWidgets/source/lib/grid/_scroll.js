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

AW.Grid.Controllers.Scroll = (function(){

	// moves and resizes scrollbars

	return {

		onScrollLeftChanged: function(x){
			var e = this.getScroll().getContent("box").element();
			if (e) {e.scrollLeft = x}
		},

		onScrollTopChanged: function(y){
			var e = this.getScroll().getContent("box").element();
			if (e) {e.scrollTop = y}
		},

		onScrollWidthChanged: function(w){
			this.getScroll().getContent("box/spacer").setStyle("width", w + "px");
		},

		onScrollHeightChanged: function(h){
			this.getScroll().getContent("box/spacer").setStyle("height", h + "px");
		},

		onScrollBarsChanged: function(bars){
			this.getScroll().setClass("scrollbars", bars);
		}
	};
})();
