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

AW.Grid.Controllers.Row = (function(){

	function refresh(value, row){
		this.getRow(row).refreshClasses();
	}

	function addRow(row){
		var count = this.getRowCount();
		var a = this.getRowIndices();

		if (count<2){
			this.refresh();
			return;
		}

		var prev = a[count-2];
		var i, e;

		if (!this.$extended){
			e = this.getRow(prev).element();
			if (e) {AW.setOuterHTML(e, this.getRow(prev).toString() + this.getRow(row).toString())}
			e = null;
		}
		else {
			for(i=0; i<3; i++){
				e = this.getRow(prev, i).element();
				if (e) {AW.setOuterHTML(e, this.getRow(prev, i).toString() + this.getRow(row, i).toString())}
				e = null;
			}
		}
		this.raiseEvent("adjustScrollHeight");
	}

	function removeRow(row){
		var i, e;
		if (!this.$extended){
			e = this.getRow(row).element();
			if (e) {AW.setOuterHTML(e, "")}
			e = null;
		}
		else {
			for(i=0; i<3; i++){
				e = this.getRow(row, i).element();
				if (e) {AW.setOuterHTML(e, "")}
				e = null;
			}
		}
		this.raiseEvent("adjustScrollHeight");
	}

	function calcRowState(v, i){
		this.calculateRowState(i);
	}

	return {

		onRowAdded: addRow,
		onRowDeleted: removeRow,
		onRowSelectedChanged: calcRowState,
		onRowStateChanged:	refresh	};

})();

