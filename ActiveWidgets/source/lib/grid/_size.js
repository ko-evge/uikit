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

AW.Grid.Controllers.Size = (function(){

	var initFlag = false;

	function init(){

		initFlag = true;

		try {

			var height = this.getContent("box/sample").element().offsetHeight;

			var i, ii, n = this.getColumnCount(), a = this.getColumnIndices();

			var hrow = this.$extended ? 0 : undefined;

			var width = [];

			for (i=0; i<n; i++){
				ii = a ? a[i] : i;
				width[ii] = this.getHeader(ii, hrow).element().offsetWidth; 
			}

			var w = this.getScroll().element().offsetWidth;
			var h = this.getScroll().element().offsetHeight;

			var left = this.getScrollLeft();
			var top = this.getScrollTop();

			this.getScroll().adjustSize();
			this.getScroll().setStyle("visibility", "inherit");

			this._startUpdate();

			this.setRowHeight(height);
			this.setColumnWidth(width);
			this.setContentWidth(w, "total");
			this.setContentHeight(h, "total");
			this.setScrollLeft(left);
			this.setScrollTop(top);

			this._endUpdate();
		}
		catch(err){
		}

		try {

			this.getScroll().setStyle("visibility", "inherit");

			this.setTimeout(function(){
				this.getRows().refresh();
			});
		}
		catch(err){
		}

		initFlag = false;

	}


	function setStyle(selector, attribute, value){

		try{
			if (AW.webkit && document.styleSheets.length === 0){
				window.setTimeout(function(){
					setStyle(selector, attribute, value);
				}, 100);
				return;
			}
			var i, ss = document.styleSheets[document.styleSheets.length-1];
			var rules = AW.getRules(ss);

			if (AW.webkit && AW.quirks) {
				selector = selector.toLowerCase(); // Safari returns selectorText in lower case
			}

			for(i=rules.length-1; i>=0; i--){
				if(rules[i].selectorText == selector){
					rules[i].style[attribute] = value;
					return;
				}
			}

			AW.addRule(ss, selector, attribute + ":" + value);

		}
		catch(err){

		}
	}

	return {

		paint: init,

		onColumnWidthChanged : function(width, column){

			if (initFlag){
				return;
			}

			if (typeof(width)=="object"){
				if (this.element()){
					this.element().innerHTML = "";
				}
				var i, a = [];
				for(i in width){
					if (!a[i]) {
						setStyle("#" + this.getId() + " .aw-column-" + i, "width", (width[i] - AW.dx) + "px");
					}
				}
				if (this.element()){
					this.refresh();
				}
				return;
			}

			if (AW.ie && this.getView().element()){
				this.getView().element().firstChild.className += ""; /* fixes column resize in tables */
			}

			if (column===undefined) {
				setStyle("#" + this.getId() + " .aw-grid-cell", "width", (width - AW.dx) + "px");
				setStyle("#" + this.getId() + " .aw-grid-header", "width", (width - AW.dx) + "px");
				setStyle("#" + this.getId() + " .aw-grid-footer", "width", (width - AW.dx) + "px");
			}
			else {
				setStyle("#" + this.getId() + " .aw-column-" + column, "width", (width - AW.dx) + "px");
			}
		},

		onSelectorWidthChanged : function(width){
			setStyle("#" + this.getId() + " .aw-row-selector", "width", (width - AW.dx) + "px");
		},

		onRowHeightChanged : function(height){

			if (initFlag){
				return;
			}

			setStyle("#" + this.getId() + " .aw-grid-row", "height", (height - AW.dy) + "px");
			setStyle("#" + this.getId() + " .aw-grid-row", "lineHeight", height + "px");
		}
	}
})();
