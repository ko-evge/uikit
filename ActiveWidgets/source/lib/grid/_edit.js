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

AW.Grid.Controllers.Edit = (function(){

	function startEdit(event){

		if (AW._edit){
			return;
		}

		var s;

		if (event && event.type == "keypress"){
			if (event.keyCode == 27 || event.keyCode == 13){
				return; // Escape, Enter
			}
			s = String.fromCharCode(event.keyCode || event.charCode);
		}

		if (this.startCellEdit(s)){
			AW.setReturnValue(event, false);
		}
	}

	function startOrEnd(event){
		if (!AW._edit){
			this.startCellEdit();
		}
		else {
			this.endCellEdit();
		}
		AW.setReturnValue(event, false);
	}

	function endEdit(event){
		this.endCellEdit();
		AW.setReturnValue(event, false);
	}

	function cancelEdit(event){
		this.cancelCellEdit();
		this.endCellEdit();
		AW.setReturnValue(event, false);
	}

	return {

		onKeyF2:				startEdit,
		onCellDoubleClicked:	startEdit,
		onKeyPress:				startEdit,
		onKeyEnter:				startOrEnd,
		onKeyEscape:			cancelEdit,

		editCurrentCell:		startEdit // for compatibility with 2.0
	};

})();

