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

AW.Grid.Controllers.Navigation = (function(){

	var serial = 1;

	function syncSelected(){

		serial = serial % 1000 + 1;

		var s = serial;

		if (!this._columnsSelected || this._columnsSelected.$ !== this){
			this._columnsSelected = {$:this};
		}

		if (!this._rowsSelected || this._rowsSelected.$ !== this){
			this._rowsSelected = {$:this};
		}

		var cc = this._columnsSelected;
		var rr = this._rowsSelected;

		var mode = this.getCurrentSelection();
		var cols = this.getSelectedColumns();
		var rows = this.getSelectedRows();

		var i, j, col, row, ext = {$:1};

		if (mode == "cell") {

			var added = [], unchanged = [], removed = [];

			for (i=0; i<cols.length; i++){
				col = cols[i];
				(cc[col] ? unchanged : added).push(col);
				cc[col] = s;
			}

			for (col in cc){
				if (cc[col] && cc[col] !== s && !ext[col]) {
					delete cc[col];
					removed.push(col);
				}
			}

			for(i=0; i<rows.length; i++){
				row = rows[i];
				if (!rr[row]){ // added rows
					rr[row] = s;
					for (j=0; j<unchanged.length; j++){ // unchanged cols
						col = unchanged[j];
						this.setCellSelected(true, col, row);
					}
					for (j=0; j<added.length; j++){ // added columns
						col = added[j];
						this.setCellSelected(true, col, row);
					}
				}
				else { // unchanged rows
					rr[row] = s;
					for (j=0; j<added.length; j++){ // added columns
						col = added[j];
						this.setCellSelected(true, col, row);
					}

					for (j=0; j<removed.length; j++){ // removed columns
						col = removed[j];
						this.setCellSelected(false, col, row);
					}
				}
			}

			for (row in rr){ // removed rows
				if (rr[row] && rr[row] !== s && !ext[row]) {
					delete rr[row];
					for (j=0; j<unchanged.length; j++){ // unchanged cols
						col = unchanged[j];
						this.setCellSelected(false, col, row);
					}
					for (j=0; j<removed.length; j++){ // removed columns
						col = removed[j];
						this.setCellSelected(false, col, row);
					}
				}
			}
		}
		else {
		 	// rows
			for(i=0; i<rows.length; i++){
				row = rows[i];
				if (!rr[row]){
					rr[row] = s;
					this.setRowSelected(true, row);
				}
				else {
					rr[row] = s;
				}
			}

			for (row in rr){
				if (rr[row] && rr[row] !== s && !ext[row]) {
					delete rr[row];
					this.setRowSelected(false, row);
				}
			}
		}
	}


	function syncRow(value, row){
		if (!this._rowsSelected || (!this._rowsSelected[row]) != (!value)){

			var i, rows = this.getSelectedRows().concat();

			if (value) {
				rows.push(row);
			}
			else {
				for(i=0; i<rows.length; i++){
					if(rows[i] == row){
						rows.splice(i--, 1);
					}
				}
			}
			this.setSelectedRows(rows);
		}
	}

	var Grid = AW.Grid.Controllers;

	return {

		onSelectedColumnsChanged:	syncSelected,
		onSelectedRowsChanged:		syncSelected,
		onRowSelectedChanged: 		syncRow,

		onSelectionModeChanged: function(mode){

			switch(mode){
				case "none":
					this.setController("selection", {});
					this.setController("edit", {});
					this.setCurrentSelection("none");
					break;

				case "single-cell":
					this.setController("selection", Grid.SingleCell);
					this.setController("edit", Grid.Edit);
					this.setCurrentSelection("cell");
					break;

				case "single-row":
					this.setController("selection", Grid.SingleRow);
					this.setController("edit", {});
					this.setCurrentSelection("row");
					break;

				case "multi-cell":
					this.setController("selection", Grid.MultiCell);
					this.setController("edit", Grid.Edit);
					this.setCurrentSelection("cell");
					break;

				case "multi-row":
					this.setController("selection", Grid.MultiRow);
					this.setController("edit", {});
					this.setCurrentSelection("row");
					break;

				case "multi-row-marker":
					this.setController("selection", Grid.MultiRowMarker);
					this.setController("edit", {});
					this.setCurrentSelection("row");

					var checkbox = new AW.Templates.CheckedItem;
					this.setCell(checkbox, 0);

					break;
			}
		}
	};

})();

