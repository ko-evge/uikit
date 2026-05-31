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

AW.Grid.Row = AW.System.Template.subclass();

AW.Grid.Row.create = function(){

	var obj = this.prototype;
	var _super = this.superclass.prototype;

	obj.setTag("span");
	obj.setClass("templates", "list");
	obj.setClass("text", "normal");

	if (AW.gecko){
		obj.setAttribute("tabIndex", "-1");
	}

	obj.setContent("selector", function(){
		return (!this.$1 || this.$1 == "left") && this.getSelectorProperty("visible") ? this.getSelector() : "";
	});

	var span = AW.HTML.SPAN;
	var start = new span;

	start.setClass("row", "start");
	start.setStyle("width", function(){
		if ((!this.$1 || this.$1 == "center") && this.$name == "row" && this.getVirtualProperty("mode")){
			return this.getViewProperty("virtualScroll")+"px";
		}
		return 0;
	});

	obj.setContent("start", start);

	obj.setContent("items", function(){

		var i, ii, a = [];
		var virtual = this.getVirtualProperty("mode");
		var indices = this.getViewProperty("indices");
		var offset, count;

		if (virtual && (!this.$1 || this.$1 == "center") && this.$name == "row") {
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

	var space = new span;
	var box = new span;

	space.setClass("item", "template");
	space.setClass("grid", "cell");
	space.setClass("column", "space");
	box.setClass("item", "box");

	space.setContent("box", box);
	obj.setContent("end", space);


	obj.refreshVirtual1 = function(h, a){

		var i, ii;

		var se = this.getContent("start").element();
		var ee = this.getContent("end").element();

		se.style.width = this.getViewProperty("virtualScroll") + "px";

		for(i=h.start1; i<h.start2; i++){
			se.parentNode.removeChild(se.nextSibling);
		}

		for(i=h.end1; i>h.end2; i--){
			ee.parentNode.removeChild(ee.previousSibling);
		}

		var indices = this.getViewProperty("indices");

		var clone = this.$owner.$clone;
		this.$owner.$clone = false;

		for(i=h.start1-1; i>=h.start2; i--){
			ii = indices ? indices[i] : i;
			a.push(this.getItem(ii).toString());
		}

		for(i=h.end1+1; i<=h.end2; i++){
			ii = indices ? indices[i] : i;
			a.push(this.getItem(ii).toString());
		}

		this.$owner.$clone = clone;

		se = null;
		ee = null;
	};

	obj.refreshVirtual2 = function(h, p){

		var i;

		var se = this.getContent("start").element();
		var ee = this.getContent("end").element();

		for(i=h.start1-1; i>=h.start2; i--){
			se.parentNode.insertBefore(p.firstChild, se.nextSibling);
		}

		for(i=h.end1+1; i<=h.end2; i++){
			ee.parentNode.insertBefore(p.firstChild, ee);
		}

		se = null;
		ee = null;
	};

	var rf = obj.refresh;

	obj.refresh = function(){
		if (typeof(this.$1) == "undefined" && this.$owner.$extended){
			rf.call(this.$owner.getRow(this.$0, "left"));
			rf.call(this.$owner.getRow(this.$0, "center"));
			rf.call(this.$owner.getRow(this.$0, "right"));
		}
		else {
			rf.call(this);
		}
	};

	var rc = obj.refreshClasses;

	obj.refreshClasses = function(){
		if (typeof(this.$1) == "undefined" && this.$owner.$extended){
			rc.call(this.$owner.getRow(this.$0, "left"));
			rc.call(this.$owner.getRow(this.$0, "center"));
			rc.call(this.$owner.getRow(this.$0, "right"));
		}
		else {
			rc.call(this);
		}
	};

	AW._addMouseEvents(obj);

	function extendEvent(name){
		var f = obj[name];
		obj[name] = function(){
			if (this.$owner.$extended){
				f.call(this.$owner.getRow(this.$0, "left"));
				f.call(this.$owner.getRow(this.$0, "center"));
				f.call(this.$owner.getRow(this.$0, "right"));
			}
			else {
				f.call(this);
			}
		}
	}

	extendEvent("onMouseOver");
	extendEvent("onMouseOut");
	extendEvent("onMouseDown");
	extendEvent("onMouseUp");
};

