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

AW.Tree.View = AW.System.Template.subclass();

AW.Tree.View.create = function(){

	var obj = this.prototype;

	obj.setTag("span");

	obj.setClass("tree", "view");

	obj.setContent("start", function(){
		return this.$0 ? this.getItem() : "";
	});

	obj.setContent("items", function(){

		if (this.$0 && !this.getViewProperty("expanded")){
			return "";
		}

		var i, ii, a = [];
		var count = this.getViewProperty("count");
		var offset = this.getViewProperty("offset");
		var indices = this.getViewProperty("indices");

		var clone = this.$owner.$clone;
		this.$owner.$clone = false;

		for(i=0; i<count; i++){
			ii = indices ? indices[i+offset] : i+offset;
			a[i] = this.getView(ii).toString();
		}

		this.$owner.$clone = clone;

		return a.join("");
	});

	obj.setContent("end", "");

};

