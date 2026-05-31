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

AW.Grid.Controllers.Grid = {

	onRowsTemplateChanged : function(rows){
		rows.mapTemplate("item", "row");
		rows.mapModel("view", "row");
	},

	onRowTemplateChanged : function(row){
		row.setClass("grid", "row");
		row.setClass("row", function(){return this.$0});
		row.setClass("rows", function(){return this.getRowProperty("state") || "normal"});
		row.setClass("alternate", function(){return this.getRowProperty("position") % 2 ? "odd" : "even"});
		row.mapTemplate("item", function(i){return this.$owner.getCell(i, this.$0)});
		row.mapTemplate("selector", function(){return this.$owner.getSelector(this.$0)});
		row.mapModel("view", "column");
	},

	onCellTemplateChanged : function(cell){
		cell.setAttribute("title", "");
		cell.setClass("grid", "cell");
		cell.setClass("column", function(){return this.$0});
		cell.setClass("cells", function(){return this.getControlProperty("state") || "normal"});
		cell.mapModel("control", "cell");

		cell.getStateProperty = function(p){return this.$owner.getRowProperty(p, this.$1)};
		cell.setStateProperty = function(p, v){this.$owner.setRowProperty(p, v, this.$1)};
	},

	onHeadersTemplateChanged : function(headers){
		headers.setClass("grid", "headers");
		headers.setClass("header", function(){return this.$0 || "0"});
		headers.setStyle("height", function(){return this.getHeaderProperty("height") - AW.dy + "px"});
		headers.getContent("end").setClass("grid", "header");
		headers.mapTemplate("item", function(i){
			return this.$owner.getHeader(i, this.$0) +
				   this.$owner.getSeparator(i, this.$0);
		});

		headers.mapTemplate("selector", function(){
			return this.$owner.getTopSelector(this.$0) +
				   (this.$owner.getSelectorResizable() && !this.$0 ? this.$owner.getSeparator("selector") : "");
		});

		headers.mapModel("view", "column");
		headers._raiseEvents = false;
	},

	onFootersTemplateChanged : function(footers){
		footers.setClass("grid", "footers");
		footers.setClass("footer", function(){return this.$0 || "0"});
		footers.setStyle("height", function(){return this.getFooterProperty("height") - AW.dy + "px"});
		footers.mapTemplate("item", function(i){return this.$owner.getFooter(i, this.$0)});
		footers.mapTemplate("selector", "bottomSelector");
		footers.mapModel("view", "column");
		footers._raiseEvents = false;
	},

	onHeaderTemplateChanged : function(header){
		header.setClass("grid", "header");
		header.setClass("column", function(){return this.$0});
		header.mapModel("control", "header");

		header.getStateProperty = function(p){return this.$owner.getColumnProperty(p, this.$0)};
		header.setStateProperty = function(p, v){this.$owner.setColumnProperty(p, v, this.$0)};

	},

	onFooterTemplateChanged : function(footer){
		footer.setClass("grid", "footer");
		footer.setClass("column", function(){return this.$0});
		footer.mapModel("control", "footer");
	},

	onSelectorTemplateChanged : function(selector){
		selector.setClass("row", "selector");
		selector.mapModel("control", "selector");
		selector.mapModel("state", "row");
	},

	onTopSelectorTemplateChanged : function(selector){
		selector.setClass("grid", "header");
		selector.setClass("row", "selector");
		selector.mapModel("control", "top");
	},

	onBottomSelectorTemplateChanged : function(selector){
		selector.setClass("row", "selector");
		selector.mapModel("control", "bottom");
	},

	onViewTemplateChanged : function(view){
		view.mapModel("panel", "content");
		view.mapTemplate("panel", function(i){
			switch(i){
				case "top": return this.getHeaders();
				case "center": return this.getRows();
				case "bottom": return this.getFooters();
			}
		});
	},

	onScrollTemplateChanged : function(scroll){
		scroll.setStyle("visibility", "hidden");
	},

	onPopupTemplateChanged : function(popup){
		popup.onItemClicked = function(event, i){
			try {
				var s = this.getItemText(i);
				this.$owner.setCellText(s, this.$0, this.$1);
				AW.$popup.hidePopup();
			}
			catch(e){
				//
			}
		}
	}
};
