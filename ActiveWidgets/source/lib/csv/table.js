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

AW.CSV.Table = AW.HTTP.Request.subclass();

AW.CSV.Table.create = function(){

/****************************************************************

	Table model for loading and parsing data in CSV text format.

*****************************************************************/

	var obj = this.prototype;

/****************************************************************

	Allows to process the received text.

	@param text (String) The downloaded text.

*****************************************************************/

	obj.response = function(text){

		this._rows = text.split(/\r*\n/);
		if (!this._rows[this._rows.length-1]){
			this._rows.pop();		// remove the last line if empty
		}
		this._data = [];

		if (this.$owner) {
	        this.$owner.clearScrollModel();
			this.$owner.clearSelectedModel();
			this.$owner.clearSortModel();
			this.$owner.clearRowModel();
			this.$owner.setRowCount(this.getCount());
			this.$owner.refresh();
		}
	};

	obj._rows = [];
	obj._data = [];

/****************************************************************

	Returns the number of data rows.

*****************************************************************/

	obj.getCount = function(){
		return this._rows.length;
	};

/****************************************************************

	Returns the cell text.

	@param c (Index) Column index.
	@param r (Index) Row index.

*****************************************************************/

	obj.getData = function(c, r){

		if (!this._data[r]){
			if (!this._rows[r]){return ""}
			this._data[r] = this._rows[r].replace(x1, s1).replace(x2, s2).split(s3);
		}

		return this._data[r][c] || "";
	};

	var x1 = /(([^,\t\"]*)|\"(([^\"]|\"\")*)\")(,|\t|$)/g;
	var x2 = /\"\"/g;
	var s1 = "$2$3\x01";
	var s2 = "\"";
	var s3 = "\x01";

};

