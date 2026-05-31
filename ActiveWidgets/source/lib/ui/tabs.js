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

AW.UI.Tabs = AW.UI.List.subclass();

AW.UI.Tabs.create = function(){

	var obj = this.prototype;

	obj.setClass("ui", "tabs");
	obj.setClass("text", "expand");
	obj.setClass("flow", "horizontal");

	if (AW.opera) {

		// fixes opera repaint bug
		obj.setController("repaint", {
			onCurrentItemChanged : function(){
				var n = document.createElement("div");
				var e = this.element();
				var p = e.parentNode;
				p.insertBefore(n, e);
				p.removeChild(n);
			}
		});
	}
};

