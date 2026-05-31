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

AW.Grid.Controllers.MultiRowMarker = (function(){

	var rr = ["getCurrentRow",	"getFirstRow", "getPreviousRow", "getNextRow", "getLastRow", "getPageUpRow", "getPageDownRow"];

	function kb(i, mode){
		return function(event){
			var row = this[rr[i]]();
			this.selectRow(row, mode);
			AW.setReturnValue(event, false);
		};
	}

	function refresh(v, i){
		this.getRow(i).refresh();
	}

	return {

		onKeyHome:			 kb(1, 3),
		onKeyUp:			 kb(2, 3),
		onKeyDown:			 kb(3, 3),
		onKeyEnd:			 kb(4, 3),
		onKeyPageUp:		 kb(5, 3),
		onKeyPageDown:		 kb(6, 3),

		onRowSelectedChanged: refresh
	};
})();


