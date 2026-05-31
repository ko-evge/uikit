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

AW.Grid.Controllers.SingleCell = (function(){

	var cc = ["getCurrentColumn", "getFirstColumn", "getPreviousColumn", "getNextColumn", "getLastColumn"];
	var rr = ["getCurrentRow",	"getFirstRow", "getPreviousRow", "getNextRow", "getLastRow", "getPageUpRow", "getPageDownRow"];

	function kb(i, j){
		return function(event){
			var col = this[cc[i]]();
			var row = this[rr[j]]();
			this.selectCell(col, row);
			AW.setReturnValue(event, false);
		};
	}

	function ms(){
		return function(event, col, row){
			this.selectCell(col, row);
		};
	}

	return {

		onKeyCtrlUp:		 kb(0, 1),	// select single cell
		onKeyUp:			 kb(0, 2),
		onKeyDown:			 kb(0, 3),
		onKeyCtrlDown:		 kb(0, 4),
		onKeyPageUp:		 kb(0, 5),
		onKeyPageDown:		 kb(0, 6),
		onKeyCtrlLeft:		 kb(1, 0),
		onKeyLeft:			 kb(2, 0),
		onKeyRight:			 kb(3, 0),
		onKeyCtrlRight:		 kb(4, 0),
		onKeyHome:			 kb(1, 0),
		onKeyEnd:			 kb(4, 0),
		onKeyCtrlHome:		 kb(1, 1),
		onKeyCtrlEnd:		 kb(4, 4),

		onCellClicking:		 ms()
	};
})();