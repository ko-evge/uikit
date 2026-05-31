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

AW.UI.Controllers.Changes = (function(){

	function item(v, i){
		this.getItem(i).refresh();
	}

	function view(indices){
		var pos = [];
		for (var i=0; i<indices.length; i++){
			pos[indices[i]] = i;
		}
		this.setViewPosition(pos);
		this.refresh();
	}

	function selection(mode){
		switch(mode){
			case "single":
				this.setController("selection", AW.UI.Controllers.Single);
				break;
			case "multi":
				this.setController("selection", AW.UI.Controllers.Multi);
				break;
		}
	}

	return {

		onItemTextChanged:		item,
		onItemImageChanged:		item,
		onItemValueChanged:		item,
		onItemLinkChanged:		item,
		onItemTooltipChanged:	item,
		onItemStateChanged:		item,

		onViewIndicesChanged:	view,

		onSelectionModeChanged: selection
	};

})();

