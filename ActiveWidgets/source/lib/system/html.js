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

AW.System.HTML = AW.System.Object.subclass();

AW.System.HTML.create = function(){

/****************************************************************

	Generic base class for building and manipulating HTML markup.

	Objects, which  have visual representation, are most likely
	subclasses of this generic HTML class. It provides a set of
	functions to define attributes, inline styles, stylesheet
	selectors, DOM events and inner HTML content either as static
	properties or calls to the object’s methods. Direct or implicit
	call to ‘toString’ method returns properly formatted HTML
	markup string, which can be used in document.write() call or
	assigned to the page innerHTML property.

	The two-way linking between original javascript object and
	it’s DOM counterpart is maintained through the use of unique ID for
	each object. This allows forwarding DOM events back to the
	proper javascript master object and, if necessary, updating
	the correct piece of HTML on the page.

*****************************************************************/

	var obj = this.prototype;

/****************************************************************

	Sets HTML tag for the object.

	@param	tag (String) The new tag.

	By default each HTML object is a DIV tag. This function allows
	to change the tag string.

	@example

	obj.setTag("SPAN");

*****************************************************************/

	obj.setTag = function(tag){
		this._tag = tag;
		resetHTMLCache(this);
	};

/****************************************************************

	Returns HTML tag for the object.

	@return	HTML tag string

*****************************************************************/

	obj.getTag = function(){
		return this._tag;
	};

	obj._tag = "span";

/****************************************************************

	Initializes the object.

*****************************************************************/

	obj.init = function(){
		if (this.$owner) {return}
		if (this._parent) {return}
		this._id = "aw" + AW.all.id++;
		AW.all[this._id] = this;
	};

/****************************************************************

	Returns unique ID for the object.

	@return	Unique ID string.

*****************************************************************/

	obj.getId = function(){
		return this._id;
	};

	obj._id = "";

/****************************************************************

	Sets ID string for an element.

	@param	id (String) New ID.

*****************************************************************/

	obj.setId = function(id){
		AW.all[this._id] = null;
		this._id = id;
		AW.all[this._id] = this;
		resetHTMLCache(this);
	};

/****************************************************************

	Returns a reference to the HTML element.

	@return Reference to the HTML element

	This function returns null if it is called before writing the
	object to the page.

*****************************************************************/

	obj.element = function(){
		var i, docs = AW.docs, id = this.getId(), e;
		if (!id) {return}
		for(i=0; i<docs.length; i++) {
			e = docs[i].getElementById(id);
			if(e) {return e}
		}
	};

/****************************************************************

	Returns CSS selector.

	@param	name (String) Selector name.
	@return	Selector value.

*****************************************************************/

	obj.getClass = function(name){
		var param = "_" + name + "Class";
		var value = this[param];
		return typeof(value)=="function" ? value.call(getParent(this)) : value;
	};

/****************************************************************

	Sets CSS selector.

	@param	name (String) Selector name.
	@param	value (String/Function) Selector value.

	The selector string is composed from the three parts - the prefix
	('aw'),	the name and the value, separated by the '-' character.
	Normally the object class string consists of several selectors
	separated by space.

	Selector values are stored and inherited separately within the
	object. This function allows easy access to single selector
	value without parsing the whole class string.

	The following example adds 'aw-template-list' stylesheet
	selector to the object class.

	@example

	obj.setClass("template", "list");

*****************************************************************/

	obj.setClass = function(name, value){
		var element = this.element();
		if (element) {
			var v = (typeof(value)=="function") ? value.call(getParent(this)) : value;
			var s = v || v === 0 || v === false ? " aw-" + name + "-" + v + " " : " ";
			element.className = element.className.replace(new RegExp("(aw-" + name + "-\\w* *| *$)", "g"), "") + s;
		}

		var param = "_" + name + "Class";
		if (this[param]==null) {this._classes += " " + name}
		this[param] = value;
		resetHTMLCache(this);
	};

	function resetHTMLCache(obj){
		obj._outerHTML = "";
		while(obj._parent){
			obj = obj._parent;
			obj._innerHTML = "";
			obj._outerHTML = "";
		}
		if (obj.lock) {obj.lock()}
	}

/****************************************************************

	Updates CSS selectors string for an element.

*****************************************************************/

	obj.refreshClasses = function(){
		var element = this.element();
		if (!element) {return}

		var i, name, value, s = "";
		var classes = this._classes.split(" ");

		for (i=1; i<classes.length; i++){
			name = classes[i];
			value = this["_" + name + "Class"];
			if (typeof(value)=="function") {
				value = value.call(getParent(this));
			}
			if (value || value === 0 || value === false){
				s += "aw-" + name + "-" + value + " ";
			}
		}
		element.className = s;
	};

	obj._classes = "";

/****************************************************************

	Returns inline CSS attribute.

	@param	name (String) CSS attribute name.
	@return	CSS attribute value.

*****************************************************************/

	obj.getStyle = function(name){
		var param = "_" + name + "Style";
		var value = this[param];
		return typeof(value)=="function" ? value.call(getParent(this)) : value;
	};

/****************************************************************

	Sets inline CSS attribute.

	@param	name (String) CSS attribute name.
	@param	value (String/Function) CSS attribute value.

*****************************************************************/

	obj.setStyle = function(name, value){

		var param = "_" + name + "Style";
		if (this[param]==null) {this._styles += " " + name}
		this[param] = value;

		resetHTMLCache(this);

		var element = this.element();
		if (element) {
			if (!styleNames[name]){
				styleNames[name] = AW.camelCase.apply(AW, name.split("-"));
			}
			if (typeof(value)=="function") {
				value = value.call(getParent(this));
			}
			element.style[styleNames[name]] = value;
		}
	};

/****************************************************************

	Updates style values which were defined with a function.

*****************************************************************/

	obj.refreshStyles = function(){
		var element = this.element();
		if (!element) {return}

		var i, name, value;
		var styles = this._styles.split(" ");

		for (i=1; i<styles.length; i++){
			name = styles[i];
			value = this["_" + name + "Style"];
			if (typeof(value)=="function") {
				value = value.call(getParent(this));
				element.style[styleNames[name]] = value;
			}
		}
	};

	obj._styles = "";

	var styleNames = {};

/****************************************************************

	Returns HTML attribute.

	@param	name (String) HTML attribute name.
	@return	HTML attribute value.

*****************************************************************/

	obj.getAttribute = function(name){
		try {
			var param = "_" + name + "Attribute";
			var value = this[param];
			return typeof(value)=="function" ? value.call(getParent(this)) : value;
		}
		catch(error){
			this.handle(error);
		}
	};

/****************************************************************

	Sets HTML attribute.

	@param	name (String) HTML attribute name.
	@param	value (String/Function) HTML attribute value.

*****************************************************************/

	obj.setAttribute = function(name, value){
		try {

			var param = "_" + name + "Attribute";
			if (typeof this[param] == "undefined") {this._attributes += " " + name}
			if (specialAttributes[name] && (typeof value == "function")){
				this[param] = function(){
					return value.call(this._parent ? getParent(this) : this) ? true : null;
				};
			}
			else {
				this[param] = value;
			}

			resetHTMLCache(this);

			var element = this.element();
			if (element) {
				if (typeof(value)=="function"){
					value = value.call(getParent(this));
				}
				if (specialAttributes[name] && !value ){
					element.removeAttribute(name);
				}
				else {
					element.setAttribute(name, value);
				}
			}
		}
		catch(error){
			this.handle(error);
		}
	};

/****************************************************************

	Updates attribute values which were defined with a function.

*****************************************************************/

	obj.refreshAttributes = function(){
		var element = this.element();
		if (!element) {return}

		var i, name, value;
		var attributes = this._attributes.split(" ");

		for (i=1; i<attributes.length; i++){
			name = attributes[i];
			value = this["_" + name + "Attribute"];
			if (typeof(value)=="function") {
				value = value.call(getParent(this));
				if (specialAttributes[name] && !value ){
					element.removeAttribute(name);
				}
				else {
					element.setAttribute(name, value);
				}
			}
		}
	};

	obj._attributes = "";

	var specialAttributes = {
		checked	  : true,
		disabled  : true,
		hidefocus : true,
		readonly  : true
	};


/****************************************************************

	Returns HTML event handler.

	@param	name (String) HTML event name.
	@return	HTML event handler.

*****************************************************************/

	obj.getEvent = function(name){
		try {
			var param = "_" + name + "Event";
			var value = this[param];
			return value;
		}
		catch(error){
			this.handle(error);
		}
	};

/****************************************************************

	Sets HTML event handler.

	@param	name (String) HTML event name.
	@param	value (String/Function) HTML event handler.

*****************************************************************/

	obj.setEvent = function(name, value){
		try {
			var param = "_" + name + "Event";
			if (this[param]==null) {this._events += " " + name}
			this[param] = value;
			resetHTMLCache(this);
		}
		catch(error){
			this.handle(error);
		}
	};

	obj._events = "";

/****************************************************************

	Returns static HTML content.

	@param	name (String) content name.
	@return	content object or function.

*****************************************************************/

	obj.getContent = function(name){
		try {
			var split = name.match(/^(\w+)\W(.+)$/);
			if (split) {
				var ref = this.getContent(split[1]);
				return ref.getContent(split[2]);
			}
			else {
				var param = "_" + name + "Content";
				var value = this[param];
				if ((typeof value == "object") && (value._parent != this)) {
					value = value.clone();
					value._parent = this; 
					this[param] = value;
				}
				if (value && typeof value == "object" && !value.defineModel) {
					value._id = this._id + "-" + name; 
				}
				if (typeof(value)=="function"){
					value = value.call(getParent(this));
				}
				return value;
			}
		}
		catch(error){
			this.handle(error);
		}
	};

/****************************************************************

	Sets static HTML content.

	@param	name (String) content name.
	@param	value (Object/String/Function) static content.

*****************************************************************/

	obj.setContent = function(name, value){
		try {
			if (arguments.length==1) { // assigning array or single function
				
				this._content = "";
				if (typeof name == "object") {
					for (var i in name)	{
						if (typeof(i) == "string") {
							this.setContent(i, name[i]);
						}
					}
				}
				else {
					this.setContent("html", name);
				}
			}
			else {
				var split = name.match(/^(\w+)\W(.+)$/);
				if (split) {
					var ref = this.getContent(split[1]);
					ref.setContent(split[2], value);
				}
				else {
					var param = "_" + name + "Content";
					if (this[param]==null) {this._content += " " + name}
					if (value && typeof value == "object") {
						value._parent = this; 
						if (!value.defineModel){
							value._id = this._id + "-" + name; 
						}
					}
					this[param] = value;
					this._innerHTML = "";
					resetHTMLCache(this);
				}
			}
		}
		catch(error){
			this.handle(error);
		}
	};

/****************************************************************

	Updates innerHTML part of the element.

*****************************************************************/

	obj.refreshContents = function(){
		try {

			var element = this.element();
			if (!element || element.tagName.match(/input|textarea/i)) {
				return;
			}

			if (AW._edit && AW.contains(element, AW.element(AW._edit))) {
				return;
			}

			var i, s="", content = this._content.split(" ");

			for (i=1; i<content.length; i++){
				s += this.getContent(content[i]);
			}

			try {
				var focus = AW.element(AW._focus);
			}
			catch(err){
			}

			element.innerHTML = s;

			try {
				if (focus !== AW.element(AW._focus)){
					AW.element(AW._focus).focus();
				}
			}
			catch(err){
			}
		}
		catch(error){
			this.handle(error);
		}

	};


	obj._content = "";

//	------------------------------------------------------------

	var getParamStr = function(i){return "{#" + i + "}"};

//	------------------------------------------------------------

	var getControlFunc = function(v){return function(){return v}};

//	------------------------------------------------------------

	obj.innerHTML = function(){

		//	Returns 'inner HTML' string for an object.

		try {
			// just return cached value if available
			if (this._innerHTML) {return this._innerHTML}

			this._innerParamLength = 0;

			var i, j, name, value, param, param1, param2, html, item, s = "";

			var content = this._content.split(" ");
			for (i=1; i<content.length; i++){
				name = content[i];
				value = this["_" + name + "Content"];
				if (typeof(value)=="function") {
					param = getParamStr(this._innerParamLength++);
					this[param] = value;
					s += param;
				}
				else if (typeof(value)=="object" && value.defineModel) {
					param = getParamStr(this._innerParamLength++);
					this[param] = getControlFunc(value);
					s += param;
				}
				else if (typeof(value)=="object"){
					item = value;
					html = item.outerHTML().replace(/\{id\}/g, "{id}-" + name);
					for (j=item._outerParamLength-1; j>=0; j--){
						param1 = getParamStr(j);
						param2 = getParamStr(this._innerParamLength + j);
						if (param1 != param2) {html = html.replace(param1, param2)}
						this[param2] = item[param1];
					}
					this._innerParamLength += item._outerParamLength;
					s += html;
				}
				else {
					s += value;
				}
			}
			this._innerHTML = s;
			return s;
		}
		catch(error){
			this.handle(error);
		}
	};

//	------------------------------------------------------------

	obj.outerHTML = function(){

		//	Returns 'outer HTML' string for an object.

		try {

			// just return cached value if available
			if (this._outerHTML) {return this._outerHTML}

			// build inner HTML first
			var innerHTML = this.innerHTML();

			// reset param count
			this._outerParamLength = this._innerParamLength;

			// elementless templates
			if (!this._tag) {return innerHTML}

			var i, tmp, name, value, param;

			var html = "<" + this._tag + " id=\"{id}\"";

			tmp = "";
			var classes = this._classes.split(" ");
			for (i=1; i<classes.length; i++){
				name = classes[i];
				value = this["_" + name + "Class"];
				if (typeof(value)=="function") {
					param = getParamStr(this._outerParamLength++);
					this[param] = value;
					value = param;
				}
				if (value || value === 0 || value === false) {
					tmp += "aw-" + name + "-" + value + " ";
				}
			}
			if (tmp) {html += " class=\"" + tmp + "\""}

			tmp = "";
			var styles = this._styles.split(" ");
			for (i=1; i<styles.length; i++){
				name = styles[i];
				value = this["_" + name + "Style"];
				if (typeof(value)=="function") {
					param = getParamStr(this._outerParamLength++);
					this[param] = value;
					value = param;
				}
				tmp += name + ":" + value + ";";
			}
			if (tmp) {html += " style=\"" + tmp + "\""}

			tmp = "";
			var attributes = this._attributes.split(" ");
			for (i=1; i<attributes.length; i++){
				name = attributes[i];
				value = this["_" + name + "Attribute"];
				if (typeof(value)=="function") {
					param = getParamStr(this._outerParamLength++);
					this[param] = value;
					value = param;
				}
				else if (specialAttributes[name] && !value ){
					value = null;
				}
				if (value !== null ){
					tmp += " " + name + "=\"" + value + "\"";
				}
			}
			html += tmp;

			tmp = "";
			var events = this._events.split(" ");
			for (i=1; i<events.length; i++){
				name = events[i];
				value = this["_" + name + "Event"];
				if (typeof(value)=="function") {
					value = "AW(this, event)";
				}
				tmp += " " + name + "=\"" + value + "\"";
			}
			html += tmp;

			html += ">" + innerHTML + "</" + this._tag + ">";

			// save the result in cache and return
			this._outerHTML = html;
			return html;
		}
		catch(error){
			this.handle(error);
		}
	};

/****************************************************************

	Returns HTML markup string for the object.

	@return	HTML string.

	Direct or implicit
	call to ‘toString’ method returns properly formatted HTML
	markup string, which can be used in document.write() call or
	assigned to the page innerHTML property.

*****************************************************************/

	obj.toString = function(){
		try {

			var i, s = this._outerHTML;
			if (!s) {s = this.outerHTML()}
			s = s.replace(id_pattern, this._id);

			var max = this._outerParamLength;

			if (param_cache.length < max) {
				for(i=param_cache.length; i<max; i++) {
					param_cache[i] = getParamStr(i);
				}
			}

			for (i=0; i<max; i++){
				var param = param_cache[i];
				var value = this._parent ? this[param].call(getParent(this)) : this[param]();

				if (value === null ){
					value = "";
					param = specialParams[i];
					if (!param) {param = getSpecialParamStr(i);}
				}

				s = s.replace(param, value);
			}

			return s;
		}
		catch(error){
			this.handle(error);
		}
	};

	var id_pattern = /\{id\}/g;
	var param_cache = [];

	var specialParams = [];
	function getSpecialParamStr(i){return (specialParams[i] = new RegExp("[\\w\\x2D]*=?:?\\x22?\\{#" + i + "\\}[;\\x22]?"));}

	function getParent(obj){
		while(obj) {
			if (!obj._parent || obj.defineModel){
				return obj;
			}
			obj = obj._parent;
		}
	}

/****************************************************************

	Updates HTML on the page.

*****************************************************************/

	obj.refresh = function(){
		try {
			var element = this.element();
			if (element) {

				if (AW._edit && AW.contains(element, AW.element(AW._edit))) {
					return;
				}

				try {
					var focus = AW.element(AW._focus);
				}
				catch(err){
				}

				AW.setOuterHTML(element, this.toString());

				try {
					if (focus !== AW.element(AW._focus)){
						AW.element(AW._focus).focus();
					}
				}
				catch(err){
				}
			}
		}
		catch(error){
			this.handle(error);
		}
	};

//	------------------------------------------------------------

	obj.setSize = function(width, height){

		if (typeof(width) != "undefined") {
			this.setStyle("width", width - AW.dx + "px");
		}

		if (typeof(height) != "undefined") {
			this.setStyle("height", height - AW.dy + "px");
		}
	};

	obj.setPosition = function(left, top){

		this.setStyle("position", "absolute");

		if (typeof(left) != "undefined") {
			this.setStyle("left", left + "px");
		}

		if (typeof(top) != "undefined") {
			this.setStyle("top", top + "px");
		}

	};

	var errors = {
		101	: "non-supported doctype",
		102 : "non-supported browser",
		103 : "non-supported browser"
	};

	function hte(i){
		return function(){
			return "AW Error: <a href=\"http:\/\/www.activewidgets.com/error." + i + "/\">" + errors[i] + "</a>";
		}
	}

};


// -------------------------------------------------------------------------

