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

AW.Templates.List = AW.System.Template.subclass();

AW.Templates.List.create = function(){

	var obj = this.prototype;

	obj.setTag("span");
	obj.setClass("templates", "list");

	obj.setContent("start", "");

	obj.setContent("items", function(){

		var i, ii, a = [];
		var count = this.getViewProperty("count");
		var offset = this.getViewProperty("offset");
		var indices = this.getViewProperty("indices");

		var clone = this.$owner.$clone;
		this.$owner.$clone = false;

		for(i=0; i<count; i++){
			ii = indices ? indices[i+offset] : i+offset;
			a[i] = this.getItem(ii).toString();
		}

		this.$owner.$clone = clone;

		return a.join("");
	});

	obj.setContent("end", "");

};

