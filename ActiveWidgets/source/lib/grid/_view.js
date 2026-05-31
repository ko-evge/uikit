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

AW.Grid.Controllers.View = {

	onRowIndicesChanged: function(indices){
		
		var positions = [];
		for (var i=0; i<indices.length; i++){
			positions[indices[i]] = i;
		}
		this.setRowPosition(positions);
//		this.setRowCount(indices.length);
		this.refresh();
	},

	onColumnIndicesChanged: function(indices){
		
		var positions = [];
		for (var i=0; i<indices.length; i++){
			positions[indices[i]] = i;
		}
		this.setColumnPosition(positions);
		this.setColumnCount(indices.length);
		this.refresh();
	}

 };
