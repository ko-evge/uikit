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

AW.Grid.Controllers.MultiRow = (function(){

	var rr = ["getCurrentRow",	"getFirstRow", "getPreviousRow", "getNextRow", "getLastRow", "getPageUpRow", "getPageDownRow"];

	function kb(i, mode){
		return function(event){
			var row = this[rr[i]]();
			this.selectRow(row, mode);
			AW.setReturnValue(event, false);
		};
	}

	function ms(mode){
		return function(event, row){
			if (event.button == 2 && this.getRowSelected(row)){
				return; // right click on existing selection
			}
			this.selectRow(row, mode);
			if (AW.gecko && mode) {
				try {window.getSelection().collapseToEnd()}
				catch(err){}
			}
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

		onKeyShiftHome:		 kb(1, 1),
		onKeyShiftUp:		 kb(2, 1),
		onKeyShiftDown:		 kb(3, 1),
		onKeyShiftEnd:		 kb(4, 1),
		onKeyCtrlShiftHome:	 kb(1, 1),
		onKeyCtrlShiftEnd:	 kb(4, 1),
		onKeyShiftPageUp:	 kb(5, 1),
		onKeyShiftPageDown:	 kb(6, 1),

		onRowClicking: 		 ms(),
		onRowShiftClicking:	 ms(1),
		onRowCtrlClicking:	 ms(2)
	};
})();

