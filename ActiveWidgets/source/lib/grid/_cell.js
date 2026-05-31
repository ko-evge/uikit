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

AW.Grid.Controllers.Cell = (function(){

	function refresh(value, col, row){
		this.getCell(col, row).refresh();
	}

	function refreshClasses(value, col, row){
		this.getCell(col, row).refreshClasses();
	}

	function cellData(val, col, row){

		function dataToText(i, j){
			var data = this.getCellData(i, j);
			var format = this.getCellFormat(i, j);
			return format ? format.dataToText(data) : data;
		}

		function dataToValue(i, j){
			var data = this.getCellData(i, j);
			var format = this.getCellFormat(i, j);
			return format ? format.dataToValue(data) : data;
		}

		this.setCellText(dataToText, col, row);
		this.setCellValue(dataToValue, col, row);

	}

	function tooltip(event, col, row){
		var e = this.getCell(col, row).element();
		var s = this.getCellTooltip(col, row);
		if (e) {e.setAttribute("title", s)}
		e = null;
	}

	function calcState(v, i, j){
		this.calculateCellState(i, j);
	}

	return {

		onCellMouseOver:		tooltip,
		onCellSelectedChanged:	calcState,
		onCellDataChanged:		cellData,
		onCellTextChanged:		refresh,
		onCellLinkChanged:		refresh,
		onCellImageChanged:		refresh,
		onCellValueChanged:		refresh,
		onCellStateChanged:		refreshClasses

	};

})();

