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

AW.Tree.Control = AW.UI.List.subclass();

AW.Tree.Control.create = function(){

	var obj = this.prototype;

	obj.defineTemplate("group", new AW.Tree.Group);

	obj.setItem(new AW.Tree.Item);
	obj.setScroll(function(){return this.getGroup(0)});

	obj.getView().mapTemplate("item", function(i){
		return this.$owner.getGroup(i);
	});

	obj.defineViewProperty("expanded", false);

	obj.onTreeSignClicked = function(src, i){
		if (this.getViewIndices(i)) {
			this.setViewExpanded(!this.getViewExpanded(i), i);
		}
	};

	obj.onViewExpandedChanged = function(e, i){
		this.getGroup(i).refresh();
	};
};

AW.UI.Tree = AW.Tree.Control;