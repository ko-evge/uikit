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

AW.Grid.Controllers.Overflow = (function(){

//	calculates scroll width/height, content width/height (fixed headers/columns)

	function calcWidth(){

		var i, a = this.getColumnIndices();

		var left = 0, lc = this.$extended ? this.getFixedLeft() : 0;
		var center = 0, cc = this.getColumnCount();
		var right = 0, rc = this.$extended ? this.getFixedRight() : 0;

		left = this.getSelectorVisible() ? this.getSelectorWidth() : left;

		if (!this.$extended){
			center = left;
			left = 0;
		}

		for(i=0; i<lc; i++){
			left += this.getColumnWidth(a ? a[i] : i);
		}

		for(i=lc; i<cc-rc; i++){
			center += this.getColumnWidth(a ? a[i] : i);
		}

		for(i=cc-rc; i<cc; i++){
			right += this.getColumnWidth(a ? a[i] : i);
		}

		var total = left + center + right;

		if (total != this.getScrollWidth()){
			this.setScrollWidth(total);
		}

		if (left != this.getContentWidth("left")){
			this.setContentWidth(left, "left");
		}

		if (right != this.getContentWidth("right")){
			this.setContentWidth(right, "right");
		}
	}

	function calcHeight(){

		if (!this.getScrollWidth()){
			calcWidth.call(this);
		}

		var i, a, count;

		var headers = 0;
		count = this.$extended ? this.getHeaderCount() : 1;
		a = this.getHeaderIndices();

		if (this.getHeaderVisible()){
			for (i=0; i<count; i++){
				headers += this.getHeaderHeight(a ? a[i] : i);
			}
		}

		var rows = this.getRowHeight() * this.getRowCount();

		var footers = 0;
		count = this.$extended ? this.getFooterCount() : 1;
		a = this.getFooterIndices();

		if (this.getFooterVisible()){
			for (i=0; i<count; i++){
				footers += this.getFooterHeight(a ? a[i] : i);
			}
		}

		var total = headers + rows + footers;

		if (total != this.getScrollHeight()){
			this.setScrollHeight(total);
		}

		if (headers != this.getContentHeight("top")){
			this.setContentHeight(headers, "top");
		}

		if (footers != this.getContentHeight("bottom")){
			this.setContentHeight(footers, "bottom");
		}
	}

	function calcBars(){

		var s, x, y;

		var l = this.getScrollLeft();
		var t = this.getScrollTop();
		var w = this.getScrollWidth();
		var h = this.getScrollHeight();

		var ww = this.getContentWidth("total");
		var hh = this.getContentHeight("total");

		if (!ww || !hh){
			return;
		}

		if (w <= ww && h <= hh){
			s = "none";
			x = 0;
			y = 0;
		}
		else if (w <= ww - AW.sx){
			s = "vertical";
			x = AW.sx;
			y = 0;
		}
		else if (h <= hh - AW.sy){
			s = "horizontal";
			x = 0;
			y = AW.sy;
		}
		else {
			s = "both";
			x = AW.sx;
			y = AW.sy;
		}

		if (this.getScrollBars() != s) {
			this.setScrollBars(s);
		}

		if (w - l < ww - x){
			var ll = Math.max(0, w - ww + x);
			if (ll != l) {
				this.setScrollLeft(ll);
			}
		}

		if (h - t < hh - y){
			var tt = Math.max(0, h - hh + y);
			if (tt != t ) {
				this.setScrollTop(tt);
			}
		}

		var cw = ww - x - this.getContentWidth("left") - this.getContentWidth("right");
		var ch = hh - y - this.getContentHeight("top") - this.getContentHeight("bottom");

		if (cw != this.getContentWidth("center")){
			this.setContentWidth(cw, "center");
		}

		if (ch != this.getContentHeight("center")){
			this.setContentHeight(ch, "center");
		}
	}

	return {

		onColumnWidthChanged: calcWidth,
		onColumnCountChanged: calcWidth,
		onSelectorWidthChanged: calcWidth,
		onSelectorVisibleChanged: calcWidth,

		onRowHeightChanged: calcHeight,
		onRowCountChanged: calcHeight,
		onHeaderVisibleChanged: calcHeight,
		onHeaderHeightChanged: calcHeight,
		onHeaderCountChanged: calcHeight,
		onFooterVisibleChanged: calcHeight,
		onFooterHeightChanged: calcHeight,
		onFooterCountChanged: calcHeight,

		onScrollWidthChanged: calcBars,
		onScrollHeightChanged: calcBars,
		onContentWidthChanged: calcBars,
		onContentHeightChanged: calcBars

	};
})();
