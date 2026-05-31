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

AW.Grid.Controllers.Virtual = (function(){

	var oldScrollTop, oldScrollLeft, scrollTime = new Date();


	function calcVirtual(dir){

		if (!this.getVirtualMode()){
			return;
		}

		dir = dir || 0;

		var scrollTop = this.getScrollTop();
		var scrollLeft = this.getScrollLeft();

		var totalHeight = this.getContentHeight("center");
		var totalWidth = this.getContentWidth("center");

		if (!totalHeight || !totalWidth){
			return;
		}

		var delta1 = dir < 0 ? 10 : 1;
		var delta2 = dir > 0 ? 10 : 1;

		var rowCount = this.getRowCount();
		var rowOffset = this.getRowOffset();
		var rowHeight = this.getRowHeight();

		var firstRow = Math.floor(scrollTop/rowHeight);
		var lastRow = Math.floor((scrollTop+totalHeight)/rowHeight);

		var start = Math.max(0, Math.min(rowCount - 1, firstRow - delta1)); //first row
		var end = Math.max(0, Math.min(rowCount - 1, lastRow + delta2)); //last row

		var rvScroll = start * rowHeight;
		var rvOffset = start + rowOffset;
		var rvCount = Math.min(rowCount, end-start+1);

		var i, ii;
		var columnCount = this.getColumnCount();
		var columnOffset = this.getColumnOffset();
		var columnIndices = this.getColumnIndices();

		if (this.$extended){
			columnCount -= this.getFixedLeft() + this.getFixedRight();
			columnOffset += this.getFixedLeft();
		}
		else if (this.getSelectorVisible()){
			scrollLeft -= this.getSelectorWidth();
		}

		var w = 0, wp = 0, ww;

		for(i=0; i<columnCount; i++){
			ii = columnIndices ? columnIndices[i+columnOffset] : i+columnOffset;
			ww = this.getColumnWidth(ii);
			if (w + ww > scrollLeft) {
				break;
			}
			wp = w; // previous
			w += ww;
		}


		var k = i ? i-1 : 0;

		for(i = k+1; i<columnCount; i++){
			ii = columnIndices ? columnIndices[i+columnOffset] : i+columnOffset;
			w += this.getColumnProperty("width", ii);
			if (w > totalWidth + scrollLeft) {
				break;
			}
		}

		this._startUpdate();

		this.setRowVirtualScroll(rvScroll);
		this.setRowVirtualOffset(rvOffset);
		this.setRowVirtualCount(rvCount);

		this.setColumnVirtualScroll(wp);
		this.setColumnVirtualOffset(columnOffset + k);
		this.setColumnVirtualCount(Math.min(i+2, columnCount) - k);

		this._endUpdate();
	}

	function startVirtual(dir){

		var s = ++this._scrollSerial;
		scrollTime = new Date();

		var wait = function(){
			if (s == this._scrollSerial) {
				if ((new Date()) - scrollTime > 200 || !AW._scrollWait){
					calcVirtual.call(this, dir);
					this.getRows().refreshVirtual();
				}
				else {
					this.setTimeout(wait, 20);
				}
			}
		};

		this.setTimeout(wait, 50);
	}

	return {

		paint: function(){
			calcVirtual.call(this);
		},

		onControlRefreshing: function(){
			calcVirtual.call(this);
		},

		onScrollLeftChanging: function(){
			oldScrollLeft = this.getScrollLeft();
		},

		onScrollTopChanging: function(){
			oldScrollTop = this.getScrollTop();
		},

		onScrollLeftChanged: function(scrollLeft){

			if (this.getVirtualMode() && scrollLeft != oldScrollLeft){
				AW._scrollWait = true;
				startVirtual.call(this);
			}
		},

		onScrollTopChanged: function(scrollTop){

			if (this.getVirtualMode() && scrollTop != oldScrollTop){

				AW._scrollWait = true;

				if (Math.abs(scrollTop - oldScrollTop) > this.getScrollHeight()/5){
					AW._scrollWait = false;
				}

				var dir = scrollTop > oldScrollTop ? 1 : -1;

				startVirtual.call(this, dir);
			}
		},

		onCurrentRowChanged: function(i){

			var current = this.getCurrentRow();
			var scroll = this.getScrollProperty("top");
			var height = this.getRowProperty("height");
			var top = (this.getRowPosition(current)-this.getRowOffset()) * height;
			var bottom = top + height;
			var max = this.getContentHeight("center");

			if (!max) {
				return;
			}

			if(top < scroll) {
				this.setScrollTop(top);
			}

			if (max + scroll < bottom){
				this.setScrollTop(bottom - max);
			}

			if(AW.ie && this.element()){
				var h = this.element().offsetHeight;
			}
		},

		onCurrentColumnChanged: function(index){

			var scroll = this.getScrollProperty("left");
			var col = this.getColumnPosition(index);
			var max = this.getContentWidth("center");

			if (!max) {
				return;
			}

			var i, a = this.getColumnIndices();

			var lw = 0, lc = this.$extended ? this.getFixedLeft() : 0;
			var mw = 0, c = this.getColumnCount();
			var rw = 0, rc = this.$extended ? this.getFixedRight() : 0;

			lw = this.getSelectorVisible() ? this.getSelectorWidth() : lw;

			if (!this.$extended){
				mw = lw;
				lw = 0;
			}

			for(i=0; i<lc; i++){
				lw += this.getColumnWidth(a ? a[i] : i);
			}

			for(i=lc; i<Math.min(col, c-rc-1); i++){
				mw += this.getColumnWidth(a ? a[i] : i);
			}

			for(i=c-rc; i<c; i++){
				rw += this.getColumnWidth(a ? a[i] : i);
			}

			if (!col) {
				mw = 0;
			}

			if (mw < scroll){
				this.setScrollLeft(mw);
				return;
			}

			var right = mw + this.getColumnWidth(index);

			if (max + scroll < right){
				this.setScrollLeft(right - max);
			}
		}
	};

})();

