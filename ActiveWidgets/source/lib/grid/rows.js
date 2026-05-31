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

AW.Grid.Rows = AW.Templates.List.subclass();

AW.Grid.Rows.create = function(){

	var obj = this.prototype;
	var _super = this.superclass.prototype;

	obj.setClass("grid", "view");

	var init = new AW.System.HTML;
	init.setTag("marquee");
	init.setClass("grid", "init");
	init.setAttribute("behavior", "slide");
	init.setEvent("onstart", waitInit);
	init.setEvent("onresize", waitInit);
	obj.setContent("init", AW.ie ? init : "");

	function initialize(){
		if (AW.ie){
			var e = this.getContent("init").element();
			if (e){
				e.parentNode.removeChild(e);
				e = null;
			}
			this.setContent("init", "");
		}
		if (this.$owner._initialized){return}
		this.$owner._initialized = true;
		this.setTimeout(function(){
			this.raiseEvent("paint");
		});
	}

	function waitInit(){
		var e = this.element();
		if ((e && e.offsetWidth && e.offsetHeight) || this.$owner._initialized ){
			initialize.call(this);
		}
		else {
			this.setTimeout(waitInit, 1000);
		}
		e = null;
	}

	obj.setContent("items", function(){

		if (!this.$owner._initialized){
			if (!AW.ie || AW.ie8){
				this.setTimeout(waitInit, 100);
			}
			return "";
		}

		var i, ii, a = [];
		var virtual = this.getVirtualProperty("mode");
		var indices = this.getViewProperty("indices");
		var count, offset;

		if (virtual) {
			count = this.getViewProperty("virtualCount");
			offset = this.getViewProperty("virtualOffset");
		}
		else {
			count = this.getViewProperty("count");
			offset = this.getViewProperty("offset");
		}

		var clone = this.$owner.$clone;
		this.$owner.$clone = false;

		for(i=0; i<count; i++){
			ii = indices ? indices[i+offset] : i+offset;
			a[i] = this.getItem(ii).toString();
		}

		this.$owner.$clone = clone;

		return a.join("");
	});

	var span = AW.HTML.SPAN;

	var top = new span;
	top.setClass("view", "top");
	top.setStyle("height", function(){
		return this.getVirtualProperty("mode") ? this.getViewProperty("virtualScroll") + "px" : 0;
	});

	obj.setContent("start", top);

	var space = new span;
	var box = new span;

	space.setClass("item", "template");
	space.setClass("row", "selector");
	space.setClass("selector", "space");
	box.setClass("item", "box");

	space.setContent("box", box);
	obj.setContent("end", space);

	obj.refresh = function(){
		if (this.$owner && this.$owner.$active) {
			this.$owner.focus();
		}

		if (typeof(this.$0) == "undefined" && this.$owner.$extended){
			_super.refresh.call(this.$owner.getRows("left"));
			_super.refresh.call(this.$owner.getRows("center"));
			_super.refresh.call(this.$owner.getRows("right"));
		}
		else {
			_super.refresh.call(this);
		}
	};


	obj.refreshVirtual = function(){

		if (this.$owner && this.$owner.$active) {
			this.$owner.focus();
		}

		var undef; //undefined
		var panel = this.$owner.$extended ? "center" : undef;

		var se = this.getRows(panel).getContent("start").element();
		var ee = this.getRows(panel).getContent("end").element();

		if (!se || !ee || se.nextSibling == ee){
			se = null;
			ee = null;
			return this.refresh();
		}

		var si = AW.object(se.nextSibling.id).$0;
		var ei = AW.object(ee.previousSibling.id).$0;

		var start1 = this.getRowProperty("position", si);
		var end1 = this.getRowProperty("position", ei);

		var start2 = this.getRowProperty("virtualOffset");
		var end2 = start2 + this.getRowProperty("virtualCount") - 1;


		var h = {};

		se = this.getRow(si, panel).getContent("start").element();
		ee = this.getRow(si, panel).getContent("end").element();

		if (!se || !ee || se.nextSibling == ee){
			se = null;
			ee = null;
			return this.refresh();
		}

		si = AW.object(se.nextSibling.id).$0;
		ei = AW.object(ee.previousSibling.id).$0;

		h.start1 = this.getColumnProperty("position", si);
		h.end1 = this.getColumnProperty("position", ei);

		h.start2 = this.getColumnProperty("virtualOffset");
		h.end2 = h.start2 + this.getColumnProperty("virtualCount") - 1;

		if (start2 > end1 || end2 < start1 ||
		    h.start2 > h.end1 || h.end2 < h.start1){
			se = null;
			ee = null;
			return this.refresh();
		}

		var i, ii, j;
		var indices = this.getRowProperty("indices");

		var panels = this.$owner.$extended ? ["left", "center", "right"] : [undef];

		for(j=0; j<panels.length; j++){

			panel = panels[j];

			se = this.getRows(panel).getContent("start").element();
			ee = this.getRows(panel).getContent("end").element();

			se.style.height = this.getRowProperty("virtualScroll") + "px";

			for(i=start1; i<start2; i++){
				se.parentNode.removeChild(se.nextSibling);
			}

			for(i=end1; i>end2; i--){
				ee.parentNode.removeChild(ee.previousSibling);
			}
		}

		var a = [];
		var p = document.createElement("span");
		var start3 = Math.max(start1, start2);
		var end3 = Math.min(end1, end2);

		panel = this.$owner.$extended ? "center" : undef;

		if (h.start1 != h.start2 || h.end1 != h.end2){
			for(i=start3; i<=end3; i++){
				ii = indices ? indices[i] : i;
				this.getRow(ii, panel).refreshVirtual1(h, a);
			}

			p.innerHTML = a.join("");

			for(i=start3; i<=end3; i++){
				ii = indices ? indices[i] : i;
				this.getRow(ii, panel).refreshVirtual2(h, p);
			}
		}

		for(j=0; j<panels.length; j++){

			panel = panels[j];

			se = this.getRows(panel).getContent("start").element();
			ee = this.getRows(panel).getContent("end").element();

			var k=0;
			a = [];

			var clone = this.$owner.$clone;
			this.$owner.$clone = false;

			for(i=start1-1; i>=start2; i--){
				ii = indices ? indices[i] : i;
				a[k++] = this.getRow(ii, panel).toString();
			}

			for(i=end1+1; i<=end2; i++){
				ii = indices ? indices[i] : i;
				a[k++] = this.getRow(ii, panel).toString();
			}

			this.$owner.$clone = clone;

			p.innerHTML = a.join("");

			for(i=start1-1; i>=start2; i--){
				se.parentNode.insertBefore(p.firstChild, se.nextSibling);
			}

			for(i=end1+1; i<=end2; i++){
				ee.parentNode.insertBefore(p.firstChild, ee);
			}

			se = null;
			ee = null;
		}

		p = null;
	};
};

