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

AW.Scroll.Bars = AW.System.Template.subclass();

AW.Scroll.Bars.create = function(){

	var obj = this.prototype;

	obj.setClass("scroll", "bars");
	obj.setClass("scrollbars", "both");

	var span = AW.HTML.SPAN;

	var box = new span;
	var spacer = new span;
	var content = new span;

	if (AW.gecko){
		box.setAttribute("tabIndex", "-1");
		content.setAttribute("tabIndex", "-1");
	}

	box.setClass("bars", "box");
	spacer.setClass("bars", "spacer");
	content.setClass("bars", "content");

	obj.setContent("box", box);
	obj.setContent("box/spacer", spacer);
	obj.setContent("content", content);
	obj.setContent("content/html", function(){

		this.lock();
		this._initialized = false;
		this.setTimeout(function(){
			this._initialized = true;
		}, 1000);

		return this.getView();
	});

	var serial = 0;

	obj.setEvent("onresize", function(){

		if (!this._initialized){
			return;
		}

		serial = (serial + 1) % 1000;
		var s = serial;

		this.setTimeout(function(){
			if (s == serial) {
				if (this.element()) {

					var w = this.element().offsetWidth;
					if (w != this.getContentProperty("width", "total")) {
						this.setContentProperty("width", w, "total");
					}

					var h = this.element().offsetHeight;
					if (h != this.getContentProperty("height", "total")) {
						this.setContentProperty("height", h, "total");
					}
				}
			}
		});
	});

	box.setEvent("onscroll", function(){

		if (!this._initialized){
			return;
		}

		var e = this.getContent("box").element();

		var left = this.getScrollProperty("left");
		var top = this.getScrollProperty("top");

		if (e.scrollLeft != left) {
			this.setScrollProperty("left", e.scrollLeft);
		}

		if (e.scrollTop != top) {
			this.setScrollProperty("top", e.scrollTop);
		}

		e = null;
	});

	if (AW.ff3){
		box.setEvent("onmousemove", function(){
			box._onscrollEvent.call(this);
		});
	}

	function mousewheel(event){
			var top = this.getScrollProperty("top");
			top -= !AW.gecko ? event.wheelDelta/2 : event.detail * (-10);
			var e = this.element();
			if (e){
				var max = this.getScrollProperty("height") - e.offsetHeight;
				var bars = this.getScrollProperty("bars");
				max += (bars == "horizontal" || bars == "both") ? 16 : 0;
				top = top > max ? max : top;
			}
			top = top < 0 ? 0 : top;
			this.setScrollProperty("top", top);
			AW.setReturnValue(event, false);
	}

	obj.setEvent(!AW.gecko ? "onmousewheel" : "onDOMMouseScroll", mousewheel);

	obj.adjustSize = function(){

		var e = this.getContent("box").element();

		var sx = e.offsetWidth - e.clientWidth;
		var sy = e.offsetHeight - e.clientHeight;

		e = null;

		if (sx > 0 && sy > 0 && sx < 50 && sy < 50 ) {

			AW.sx = sx;
			AW.sy = sy;

			if (AW.ie && !AW.strict){
				this.getContent("content").setStyle("margin-right", sx + "px");
				this.setStyle("padding-bottom", sy + "px");
			}
			else {
				this.getContent("content").setStyle("right", sx + "px");
				this.getContent("content").setStyle("bottom", sy + "px");
			}
		}
	}
};

