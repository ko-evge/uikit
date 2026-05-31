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

AW.Grid.Controllers.SingleRow = (function(){

	var rr = ["getCurrentRow",	"getFirstRow", "getPreviousRow", "getNextRow", "getLastRow", "getPageUpRow", "getPageDownRow"];

	function kb(i){
		return function(event){
			var row = this[rr[i]]();
			this.selectRow(row);
			AW.setReturnValue(event, false);
		};
	}

	function ms(){
		return function(event, row){
			this.selectRow(row);
		};
	}

	return {

		onKeyHome:			 kb(1),	// select single row
		onKeyUp:			 kb(2),
		onKeyDown:			 kb(3),
		onKeyEnd:			 kb(4),

		onKeyCtrlHome:		 kb(1),
		onKeyCtrlEnd:		 kb(4),
		onKeyPageUp:		 kb(5),
		onKeyPageDown:		 kb(6),

		onRowClicking: 		 ms()
	};
})();

