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

AW.Grid.Control = AW.System.Control.subclass();

AW.Grid.Control.create = function(){

	var obj = this.prototype;
	var _super = this.superclass.prototype;

	obj.setClass("grid", "control");
	obj.setClass("selectors", function(){return this.getSelectorVisible() ? "visible" : "hidden"});

	var focus = new AW.HTML.TEXTAREA;
	focus.setClass("control", "focus");
	focus.setAttribute("tabIndex", function(){return this.getTabProperty("index")});
	//focus.setAttribute("readonly", "true");

	var sample = new AW.HTML.SPAN;
	sample.setClass("row", "sample");
	sample.setClass("grid", "row");

	var box = new AW.HTML.SPAN;
	box.setClass("grid", "box");

	box.setContent("focus", focus);
	box.setContent("html", function(){return this.getLayout()});
	box.setContent("sample", sample);
	obj.setContent("box", box);



//	---

	var Grid = AW.Grid.Controllers;

	obj.setController("size", Grid.Size);
	obj.setController("cell", Grid.Cell);
	obj.setController("edit", Grid.Edit);
	obj.setController("row", Grid.Row);
	obj.setController("view", Grid.View);
	obj.setController("navigation", Grid.Navigation);
	obj.setController("selection", Grid.SingleCell);
	obj.setController("sort", Grid.Sort);
	obj.setController("overflow", Grid.Overflow);
	obj.setController("scroll", Grid.Scroll);
	obj.setController("content", Grid.Content);
	obj.setController("virtual", Grid.Virtual);
	obj.setController("grid", Grid.Grid);

//	---

	obj.defineTemplate("layout", function(){return this.getScrollTemplate()});
	obj.defineTemplate("scroll", new AW.Scroll.Bars);
	obj.defineTemplate("view", new AW.Panels.Horizontal);
	obj.defineTemplate("panel", function(){return ""});
	obj.defineTemplate("rows", new AW.Grid.Rows);
	obj.defineTemplate("row", new AW.Grid.Row);
	obj.defineTemplate("cell", new AW.Templates.Cell);
	obj.defineTemplate("headers", new AW.Grid.Row);
	obj.defineTemplate("footers", new AW.Grid.Row);
	obj.defineTemplate("header", new AW.Grid.Header);
	obj.defineTemplate("footer", new AW.Templates.ImageText);
	obj.defineTemplate("separator", new AW.Grid.Separator);
	obj.defineTemplate("selector", new AW.Templates.ImageText);
	obj.defineTemplate("topSelector", new AW.Templates.ImageText);
	obj.defineTemplate("bottomSelector", new AW.Templates.ImageText);
	obj.defineTemplate("popup", new AW.System.Template);

//	---

	function value(i, j){
		var text = this.getCellText(i, j);
		var format = this.getCellFormat(i, j);
		return format ? format.textToValue(text) : AW.textToValue(text);
	}

	function position(i){
		return Number(i);
	}

//	---

	var models = {
		scroll		: {left:0, top:0, width:0, height:0, bars:"both"},
		cell		: {text:"", image:"", link:"", value:value, data:"", format:"", tooltip:"", state:"", selected:false, editable:false},
		header		: {text:"", image:"", link:"", value:value, data:"", format:"", tooltip:"", state:"", count:1, offset:0, height:20, visible:true},
		selector	: {text:"", image:"", link:"", value:value, data:"", format:"", tooltip:"", state:"", width:20, resizable:false, visible:false},
		top			: {text:"",	image:"", link:"", value:value, data:"", format:"", tooltip:"",	state:""},
		column		: {offset:0, count:0, position:position, state:"", selected:false, resizable:true, width:100, virtualOffset:0, virtualCount:0, virtualScroll:0},
		row			: {offset:0, count:0, position:position, state:"", selected:false, height:18, virtualOffset:0, virtualCount:0, virtualScroll:0},
		current		: {row:0, column:0, selection:"cell"},
		selected	: {},
		selection	: {mode:"rows", multiple:false},
		sort		: {column:-1, direction:""},
		fixed		: {left:1, right:0},
		virtual		: {mode: true, top:0},
		content		: {width:0, height:0}
	};

	obj.defineModel("scroll", models.scroll);
	obj.defineModel("cell", models.cell);
	obj.defineModel("header", models.header);
	obj.defineModel("footer", models.header);
	obj.defineModel("selector", models.selector);
	obj.defineModel("top", models.top);
	obj.defineModel("bottom", models.top);
	obj.defineModel("column", models.column);
	obj.defineModel("row", models.row);
	obj.defineModel("current", models.current);
	obj.defineModel("selected", models.selected);
	obj.defineModel("selection", models.selection);
	obj.defineModel("sort", models.sort);
	obj.defineModel("virtual", models.virtual);
	obj.defineModel("content", models.content);
	obj.defineModel("panel", models.content);
	obj.defineModel("fixed", models.fixed);

	obj.defineColumnProperty("indices", "", true);
	obj.defineRowProperty("indices", "", true);
	obj.defineHeaderProperty("indices", "", true);
	obj.defineFooterProperty("indices", "", true);

	obj.defineSelectedProperty("rows", [], true);
	obj.defineSelectedProperty("columns", [], true);

	obj.setFooterVisible(false);
	obj.setContentWidth(100, "left");
	obj.setContentHeight(20, "top");


//	---

	obj.getFirstColumn = function(){
		var p = this.getColumnOffset();
		var a = this.getColumnIndices();
		return a ? a[p] : p;
	};

	obj.getLastColumn = function(){
		var p = this.getColumnOffset() + this.getColumnCount() - 1;
		var a = this.getColumnIndices();
		return a ? a[p] : p;
	};

	obj.getNextColumn = function(){
		var i = this.getCurrentColumn();
		var p = Math.min(this.getColumnPosition(i) + 1, this.getColumnOffset() + this.getColumnCount() - 1);
		var a = this.getColumnIndices();
		return a ? a[p] : p;
	};

	obj.getPreviousColumn = function(){
		var i = this.getCurrentColumn();
		var p = Math.max(this.getColumnPosition(i) - 1, this.getColumnOffset());
		var a = this.getColumnIndices();
		return a ? a[p] : p;
	};

//	---

	obj.getFirstRow = function(){
		var p = this.getRowOffset();
		var a = this.getRowIndices();
		return a ? a[p] : p;
	};

	obj.getLastRow = function(){
		var p = this.getRowOffset() + this.getRowCount() - 1;
		var a = this.getRowIndices();
		return a ? a[p] : p;
	};

	obj.getNextRow = function(){
		var i = this.getCurrentRow();
		var p = Math.min(this.getRowPosition(i) + 1, this.getRowOffset() + this.getRowCount() - 1);
		var a = this.getRowIndices();
		return a ? a[p] : p;
	};

	obj.getPreviousRow = function(){
		var i = this.getCurrentRow();
		var p = Math.max(this.getRowPosition(i) - 1, this.getRowOffset());
		var a = this.getRowIndices();
		return a ? a[p] : p;
	};

	obj.getPageUpRow = function(){
		var i = this.getCurrentRow();
		var p = Math.max(this.getRowPosition(i) - 10, this.getRowOffset());
		var a = this.getRowIndices();
		return a ? a[p] : p;
	};

	obj.getPageDownRow = function(){
		var i = this.getCurrentRow();
		var p = Math.min(this.getRowPosition(i) + 10, this.getRowOffset() + this.getRowCount() - 1);
		var a = this.getRowIndices();
		return a ? a[p] : p;
	};

//	---

	obj.selectRow = function(row, mode){

		// if in edit mode - move focus out, triggers end of edit
		if (this.$edit){
			this.focus();
		}
		// do not move selection if edit continues
		if (this.$edit){
			return;
		}

		this._startUpdate();

		if (this.getCurrentSelection() != "row"){
			this.setCurrentSelection("row");
		}

		var start, end, i, a;
		var rr = this.getSelectedRows();

		if (!mode){ // simple select

			if (rr.length != 1 || rr[0] != row){
				this.setSelectedRows([row]);
			}
		}
		else if (mode == 1) { // shift- range select

			if (!rr.length){
				this.setSelectedRows([row]);
			}
			else {
				start = this.getRowPosition(rr[0]);
				end = this.getRowPosition(row);
				a = this.getRowIndices();
				rr = [];
				if (start < end){
					for (i = start; i <= end; i++){
						rr.push(a ? a[i] : i);
					}
				}
				else {
					for (i = start; i >= end; i--){
						rr.push(a ? a[i] : i);
					}
				}
				this.setSelectedRows(rr);
			}
		}
		else if (mode == 2) { // ctrl- toggle selection
			this.setRowSelected(!this.getRowSelected(row), row);
		}


		if (row!=this.getCurrentRow()){
			this.setCurrentRow(row);
		}

		this._endUpdate();
	};

//	---

	obj.selectCell = function(col, row, mode){

		// if in edit mode - move focus out, triggers end of edit
		if (this.$edit){
			this.focus();
		}
		// do not move selection if edit continues
		if (this.$edit){
			return;
		}

		this._startUpdate();

		if (this.getCurrentSelection() != "cell"){
			this.setCurrentSelection("cell");
		}

		var start, end, i, a;
		var cc = this.getSelectedColumns();
		var rr = this.getSelectedRows();

		if (!mode){ // simple select

			if (cc.length != 1 || cc[0] != col){
				this.setSelectedColumns([col]);
			}

			if (rr.length != 1 || rr[0] != row){
				this.setSelectedRows([row]);
			}
		}
		else if (mode == 1) { // shift- range select

			if (!cc.length){
				this.setSelectedColumns([col]);
			}
			else {
				start = this.getColumnPosition(cc[0]);
				end = this.getColumnPosition(col);
				a = this.getColumnIndices();
				cc = [];
				if (start < end){
					for (i = start; i <= end; i++){
						cc.push(a ? a[i] : i);
					}
				}
				else {
					for (i = start; i >= end; i--){
						cc.push(a ? a[i] : i);
					}
				}
				this.setSelectedColumns(cc);
			}

			if (!rr.length){
				this.setSelectedRows([row]);
			}
			else {
				start = this.getRowPosition(rr[0]);
				end = this.getRowPosition(row);
				a = this.getRowIndices();
				rr = [];
				if (start < end){
					for (i = start; i <= end; i++){
						rr.push(a ? a[i] : i);
					}
				}
				else {
					for (i = start; i >= end; i--){
						rr.push(a ? a[i] : i);
					}
				}
				this.setSelectedRows(rr);
			}
		}

		if (col!=this.getCurrentColumn()){
			this.setCurrentColumn(col);
		}

		if (row!=this.getCurrentRow()){
			this.setCurrentRow(row);
		}

		this._endUpdate();

	};

//	---

	obj.calculateRowState = function(i){
		var state = "";
		if (this.getCurrentRow()==i){state = "current"}
		if (this.getRowSelected(i)){state = "selected"}
		this.setRowState(state, i);
	};

	obj.calculateCellState = function(i, j){
		var state = "";
		if (this.getCurrentColumn()==i && this.getCurrentRow()==j){state = "current"}
		if (this.getCellSelected(i, j)){state = "selected"}
		this.setCellState(state, i, j);
	};

//	---

	obj.startCellEdit = function(text){

		if (this.$edit){ 
			return;
		}

		var c = this.getCurrentColumn();
		var r = this.getCurrentRow();

		if (!this.getCellEditable(c, r)){
			return;
		}

		var cell = this.getCell(c, r);

		return AW._startEdit(cell, text);
	};

	obj.cancelCellEdit = function(){
		AW._cancelEdit();
		this.focus();
		return !AW._edit;
	};

	obj.endCellEdit = function(){
		this.focus();
		return !AW._edit;
	};


//	---


	box.setEvent("onactivate", function(event){
		try {
			if (event.srcElement.tagName == "SPAN"){
				var src = AW.object(event.srcElement.id, true);
				if (src && src.setController && src !== this){
					return;
				}
				var target = this;
				function onfocus(event){
					event.srcElement.detachEvent("onfocus", onfocus);
					target.focus();
					target = null;
				}
				event.srcElement.attachEvent("onfocus", onfocus);
			}
		}
		catch(err){
		}
	});

	focus.setEvent("onbeforedeactivate", function(event){
		try {
			if (this.getView().element().contains(event.toElement) &&
				event.toElement.tagName == "SPAN"){
				var src = AW.object(event.toElement.id, true);
				if (src && src.setController && src !== this){
					return;
				}
				event.returnValue = false;
				event.cancelBubble = true;
			}
		}
		catch(err){
		}
	});

	focus.setEvent("onselectstart", function(event){
		if (AW.ie) {
			event.cancelBubble = true;
		}
		else {
			event.stopPropagation();
		}
	});

	focus.setEvent("onbeforecopy", function(event){
		if (AW.webkit){
			expandFocus.call(this, false);
		}
	});

	obj.getSelectedText = function(){
		var c, r, a, text = [];
		var cols = this.getSelectedColumns();
		var rows = this.getSelectedRows();
		if (this.getCurrentSelection() == "row"){
			cols = [];
			var count = this.getColumnCount();
			var indices = this.getColumnIndices();
			for (c=0; c<count; c++){
				cols[c] = indices ? indices[c] : c;
			}
		}
		for (r=0; r<rows.length; r++){
			a = [];
			for (c=0; c<cols.length; c++){
				a[c] = this.getCellText(cols[c], rows[r]);
			}
			text[r] = a.join("\t");
		}
		return text.join("\r\n");
	};

	focus.setEvent("oncut", function(event){
		var txt = this.getSelectedText();
		if (AW.ie) {
			window.clipboardData.setData("Text", txt);
			event.returnValue = false;
		}
		else {
			var e = this.getContent("box/focus").element();
			e.value = txt;
			e.select();
		}
		this.startCellEdit("");
	});

	focus.setEvent("oncopy", function(event){
		var txt = this.getSelectedText();
		if (AW.ie) {
			window.clipboardData.setData("Text", txt);
			event.returnValue = false;
		}
		else {
			var e = this.getContent("box/focus").element();
			e.value = txt;
			e.select();
		}
	});

	focus.setEvent("onpaste", function(event){
		var txt;
		if (AW.ie) {
			txt = window.clipboardData.getData("Text");
			event.returnValue = false;
		}
		else if (AW.webkit) {
			txt = event.clipboardData.getData('text/plain');
			event.preventDefault();
			event.stopPropagation();
		}
		else {
			return; // no paste in FF/Opera
		}
		this.startCellEdit(txt);
	});

	obj.setEvent("oncontextmenu", function(event){
		if (AW.webkit){
			expandFocus.call(this, true);
		}
		if (AW.ffx){ //FF 1.0-2.0
			expandFocus.call(this, false);
			return ffCopy.call(this);
		}
		this.focus();
	});

	function ffCopy(){
		if (!AW._edit){
			var e = this.getContent("box/focus").element();
			e.value = this.getSelectedText();
			e.select();
			e.focus();
		}
	}

	if (AW.gecko) {
		obj.setController("copypaste", {
			onKeyCtrlC: AW.ffx ? ffCopy : null,
			onCellMouseUp: function(event){
				if (event.button == 2){ // right click
					expandFocus.call(this, true);
					if (AW.ff3 && !AW._edit){
						this.getContent("box/focus").element().select();
					}
					this.setTimeout(function(){ // in case oncontextmenu is cancelled
						expandFocus.call(this, false);
					});
				}
			}
		});
	}

	function expandFocus(on){
		try {
			var e = this.getContent("box/focus").element();
			e.style.zIndex = on ? 1 : 0;
			e.style.width = on ? "100%" : "1px";
			e.style.height = on ? "100%" : "1px";
			e = null;
		}
		catch(err){
		}
	}

	obj.focus = function(){
		try {
			if (this.getControlDisabled()){
				return;
			}
			var e = this.getContent("box/focus").element();
			e.value = " ";
			if (AW.opera) {
				e.focus();
			}
			else if (AW.webkit) {
				e.select();
				e.focus();
			}
			else {
				e.select();
			}
			e = null;
		}
		catch(err){
		}
	};

	obj.refresh = function(){

		var x = this.getScrollLeft();
		var y = this.getScrollTop();

		this.raiseEvent("onControlRefreshing");

		_super.refresh.call(this);

		this.getScroll().setStyle("visibility", "hidden");
		this.setScrollLeft(x);
		this.setScrollTop(y);
		this.getScroll().setStyle("visibility", "inherit");

		this.raiseEvent("onControlRefreshed");
	};

//	---

	obj.addRow = function(row){
		if (this.raiseEvent("onRowAdding", row)){
			return;
		}

		var i, count = this.getRowCount();
		var a = this.getRowIndices();

		if (typeof(row) == "undefined"){
			row = count;
		}

		if (this._cellModel && this._cellModel.addRow){
			this._cellModel.addRow(row);
		}

		if (!a) {
			a = [];
			for(i=0; i<count;i++){
				a[i]=i;
			}
		}

		a.push(row);

		var refresh = this.refresh;
		this.refresh = function(){};

		this.setRowIndices(a);
		this.setRowCount(count+1);
		this.setCurrentRow(row);
		this.setSelectedRows([row]);

		this.refresh = refresh;
		this.raiseEvent("onRowAdded", row);
	};

	obj.deleteRow = function(row){

		if (this.raiseEvent("onRowDeleting", row)){
			return;
		}

		if (this._cellModel && this._cellModel.deleteRow){
			this._cellModel.deleteRow(row);
		}

		var i, count = this.getRowCount();
		var a = this.getRowIndices();

		if (!a) {
			a = [];
			for(i=0; i<count;i++){
				a[i]=i;
			}
			i = row;
		}
		else {
			i = this.getRowPosition(row);
		}
		a.splice(i, 1);

		var refresh = this.refresh;
		this.refresh = function(){};

		this.setRowIndices(a);
		this.setRowCount(count-1);
		this.setCurrentRow(i>0 ? a[i-1] : -1);
		this.setSelectedRows(i>0 ? [a[i-1]] : []);

		this.refresh = refresh;
		this.raiseEvent("onRowDeleted", row);
	};

	obj.sort = function(column, direction){
		this.raiseEvent("doSort", direction, column);
	};

	var setCellModel = obj.setCellModel;

	obj.setCellModel = function(model){

		setCellModel.call(this, model);

		function dataToText(i, j){
			var data = this.getCellData(i, j);
			var format = this.getCellFormat(i, j);
			return format ? format.dataToText(data) : data;
		}

		function dataToValue(i, j){
			var data = this.getCellData(i, j);
			var format = this.getCellFormat(i, j);
			return format ? format.dataToValue(data) : data;
		}

		this.setCellText(dataToText);
		this.setCellValue(dataToValue);

	};

	obj.onControlDisabledChanged = function(value){
		this.setClass("disabled", value ? "control" : null);
		this.setAttribute("disabled", value ? true : null);
	};

	obj._scrollSerial = 0;
};

AW.UI.Grid = AW.Grid.Control;

