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

AW.Panels.Horizontal = AW.System.Template.subclass();

AW.Panels.Horizontal.create = function(){

	var obj = this.prototype;

	obj.setClass("hpanel", "template");

	var span = AW.HTML.SPAN;

	var box = new span;
	var top = new span;
	var middle = new span;
	var bottom = new span;

	box.setClass("hpanel", "box");
	top.setClass("hpanel", "top");
	middle.setClass("hpanel", "middle");
	bottom.setClass("hpanel", "bottom");

	if (AW.ms6) {
		middle.setStyle("height", "expression(this.parentElement.clientHeight-this.previousSibling.offsetHeight-this.nextSibling.offsetHeight)");
	}

	function panel(i){
		return function(){
			return this.getPanel(i);
		}
	}

	top.setContent("html", panel("top"));
	middle.setContent("html", panel("center"));
	bottom.setContent("html", panel("bottom"));

	box.setContent("top", top);
	box.setContent("middle", middle);
	box.setContent("bottom", bottom);

	obj.setContent("box", box);


	obj.changeScrollLeft = function(x){
		var e1 = this.getContent("box/middle").element();
		var e2 = this.getContent("box/top").element();
		var e3 = this.getContent("box/bottom").element();
		if (AW.gecko){AW.ignoreMouse = true}
		if (e1) {e1.scrollLeft = x}
		if (e2) {e2.scrollLeft = x}
		if (e3) {e3.scrollLeft = x}
		if (AW.gecko){this.setTimeout(function(){AW.ignoreMouse = false})}
	};

	obj.changeScrollTop = function(y){
		var e = this.getContent("box/middle").element();
		if (AW.gecko){AW.ignoreMouse = true}
		if (e) {e.scrollTop = y}
		if (AW.gecko){this.setTimeout(function(){AW.ignoreMouse = false})}
	};

	obj.changePanelWidth = function(){};

	obj.changePanelHeight = function(height, part){

		var h = height + "px";

		if (part=="top"){

			this.getContent("box/top").setStyle("height", h);
			this.getContent("box/top").setStyle("visibility", height ? "inherit" : "hidden");

			if (AW.ie && !AW.strict){
				this.getContent("box").setStyle("padding-top", h);
			}
			else {
				this.getContent("box/middle").setStyle("top", h);
			}
		}
		else if (part=="bottom"){

			this.getContent("box/bottom").setStyle("height", h);
			this.getContent("box/bottom").setStyle("display", height ? "block" : "none");

			if (AW.ie && !AW.strict){
				this.getContent("box").setStyle("padding-bottom", h);
			}
			else {
				this.getContent("box/middle").setStyle("bottom", h);
			}
		}
	};

	obj.changePanelHeight(20, "top");
	obj.changePanelHeight(0, "bottom");
};

