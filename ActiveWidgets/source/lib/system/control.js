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

AW.System.Control = AW.System.HTML.subclass();

AW.System.Control.create = function(){

/****************************************************************

	Generic user interface control class. Control is a screen element,
	which can have focus and responds to the keyboard or mouse commands.

	Typical control has a set of built-in or external data models
	and may also contain additional presentation templates.

*****************************************************************/

	AW.System.Template.create.call(this);

	var obj = this.prototype;
	var templates = AW.System.Template.prototype;

	obj.setTag("span");
	obj.setClass("system", "control");
	obj.setAttribute("tabIndex", "-1");
	obj.setAttribute("hideFocus", "true");

	obj.setEvent("oncontextmenu", "return false");
	obj.setEvent("onselectstart", "return false");

	obj.clear = function(){
		// empty
	};

	obj.mapTemplate = function(){};
	obj.mapModel = function(){};

/****************************************************************

	Returns the data model object. For a built-in model this method
	will create a temporary proxy attached to the template.

	@param	name	(String) Name of the data model.
	@return			A data model object.

*****************************************************************/

	obj.getModel = function(name){
		var getModel = AW.camelCase("get", name, "model");
		return this[getModel]();
	};

/****************************************************************

	Sets the external data model.

	@param	name	(String) Name of the data model.
	@param	model	(Object) Data model object.

*****************************************************************/

	obj.setModel = function(name, model){
		var setModel = AW.camelCase("set", name, "model");
		return this[setModel](model);
	};

/****************************************************************

	Creates a new data model.

	@param	name	(String) New data model name.

*****************************************************************/

	obj.defineModel = function(m, z){

		var ext = "_" + m + "Model";

		var defineProperty = AW.camelCase("define", m, "property");
		var getProperty = AW.camelCase("get", m, "property");
		var setProperty = AW.camelCase("set", m, "property");

		var getModel = AW.camelCase("get", m, "model");
		var setModel = AW.camelCase("set", m, "model");
		var clearModel = AW.camelCase("clear", m, "model");

		var getInt = {};
		var setInt = {};
		var getExt = {};
		var setExt = {};
		var changing = {};
		var changed = {};
		var error = {};

		var undef;

//		------------------------------------------------------------

		this[defineProperty] = function(p, v, arrayValue){

			var _p = "_" + AW.camelCase(m, p);

			var _p1 = _p + "1";
			var _p2 = _p + "2";
			var _p3 = _p + "3";

			var _x2 = _p + "2x";

			// internal
			var get = (getInt[p] = AW.camelCase("get", m, p));
			var set = (setInt[p] = AW.camelCase("set", m, p));

			// external
			var $get = (getExt[p] = AW.camelCase("get", p));
			var $set = (setExt[p] = AW.camelCase("set", p));

			var _changing = (changing[p] = AW.camelCase("on", m, p, "changing"));
			var _changed = (changed[p] = AW.camelCase("on", m, p, "changed"));
			var _error = (error[p] = AW.camelCase("on", m, p, "error"));


			this[get] = function(a, b, c){

				if (this[ext] && this[ext][$get]) {return this[ext][$get](a, b, c)}

				var r;
				if (c !== undef &&
					this[_p3] &&
					this[_p3][c] &&
					this[_p3][c][b] &&
					this[_p3][c][b][a] !== undef ) {
					r = this[_p3][c][b][a];
				}
				else if (b !== undef && (!this[_x2] || !this[_x2][a] || this[_x2][a][b]) &&
					this[_p2] &&
					this[_p2][b] &&
					this[_p2][b][a] !== undef ) {
					r = this[_p2][b][a];
				}
				else if (a !== undef &&
					this[_p1] &&
					this[_p1][a] !== undef ) {
					r = this[_p1][a];
				}
				else {
					r = this[_p];
				}
				return (typeof(r)=="function") ? r.call(this, a, b, c) : r;
			};

			function isArray(a){
				return a && typeof(a)=="object" && !a.constructor.subclass && !arrayValue;
			}

			var setProp = function (v, a, b, c){

				var i;

				if (isArray(v)) {
					for(i in v){
						if (typeof(v[i])=="function"){
							continue;
						}
						if (isArray(v[i])) {
							this[_p2] = v;
							delete this[_p3];
							delete this[_x2];
							return;
						}
						break;
					}
					if (a !== undef){
						if (!this[_p2]){this[_p2]={}}
						this[_p2][a] = v;
						delete this[_p3];
					}
					else {
						this[_p1] = v;
						delete this[_p2];
						delete this[_p3];
						delete this[_x2];
					}
					return;
				}

				if (c !== undef) {
					if (!this[_p3]){this[_p3]={}}
					if (!this[_p3][c]){this[_p3][c]={}}
					if (!this[_p3][c][b]){this[_p3][c][b]={}}
					this[_p3][c][b][a] = v;
				}
				else if (b !== undef) {
					if (!this[_p2]){this[_p2]={}}
					if (!this[_p2][b]){this[_p2][b]={}}
					this[_p2][b][a] = v;
					if (this[_x2] && this[_x2][a]){this[_x2][a][b]=true}
				}
				else if (a !== undef) {
					if (!this[_p1]){this[_p1]={$owner: this}}
					else if (this[_p1].$owner != this){
						var r = this[_p1]; this[_p1]={};
						for (i in r){this[_p1][i] = r[i]}
						this[_p1].$owner = this;
					}
					this[_p1][a] = v;

					if (this[_p2]){
						if(!this[_x2]){this[_x2]={}}
						this[_x2][a]={};
					}
				}
				else {
					this[_p] = v;
					delete this[_p1];
					delete this[_p2];
					delete this[_p3];
					delete this[_x2];
				}

			};


			this[set] = function(v, a, b, c){

				if (this._groupUpdate){
					this._groupUpdate.push({
						f: setProp,
						e1: _changing,
						e2: _changed,
						v: v,
						a: a,
						b: b,
						c: c
					});
					return;
				}


				if (this[ext] && this[ext][$set]) {return this[ext][$set](v, a, b, c)}

				var r = this.raiseEvent(_changing, v, a, b, c);
				if (r) {
					this.raiseEvent(_error, r, a, b, c);
					return false;
				}

				setProp.call(this, v, a, b, c);
				this.raiseEvent(_changed, v, a, b, c);
				return true;
			};

			setProp.call(this, v);

			var clearPrevious = this[clearModel];

			this[clearModel] = function(){

				delete this[_x2];
				delete this[_p3];
				delete this[_p2];
				delete this[_p1];
				delete this[_p];

				clearPrevious.call(this);
				setProp.call(this, v);
			}

		};

//		------------------------------------------------------------

		this[getProperty] = function(p, a, b, c){
			try {
				if (this[ext] && this[ext][getExt[p]]) {return this[ext][getExt[p]](a, b, c)}
				return this[getInt[p]](a, b, c);
			}
			catch(error){
				return this.handle(error);
			}
		};

//		------------------------------------------------------------

		this[setProperty] = function(p, v, a, b, c){
			try {
				if (this[ext] && this[ext][setExt[p]]) {return this[ext][setExt[p]](v, a, b, c)}
				return this[setInt[p]](v, a, b, c);
			}
			catch(error){
				return this.handle(error);
			}
		};

//		------------------------------------------------------------

		templates[getProperty] = function(p, a, b, c){
			if (a === undef) {return this.$owner[getProperty](p, this.$0, this.$1, this.$2)}
			if (b === undef) {return this.$owner[getProperty](p, a, this.$0, this.$1)}
			if (c === undef) {return this.$owner[getProperty](p, a, b, this.$0)}
			return this.$owner[getProperty](p, a, b, c);
		};

		templates[setProperty] = function(p, v, a, b, c){
			if (a === undef) {return this.$owner[setProperty](p, v, this.$0, this.$1, this.$2)}
			if (b === undef) {return this.$owner[setProperty](p, v, a, this.$0, this.$1)}
			if (c === undef) {return this.$owner[setProperty](p, v, a, b, this.$0)}
			return this.$owner[setProperty](p, v, a, b, c);
		};

//		------------------------------------------------------------


		this[getModel] = function(){
			return this[ext];
		};

		this[setModel] = function(model){
			this[ext] = model;
			if (model) {model.$owner = this}
		};

		this[clearModel] = function(){
			if (this[ext] && this[ext].$owner){
				delete this[ext].$owner;
			}
			delete this[ext];
		};

//		------------------------------------------------------------

		var clear = this.clear;

		this.clear = function(){
			clear.call(this);
			this[clearModel]();
		};

//		------------------------------------------------------------

		var i, zz = {};

		for (i in z){
			if (!zz[i]){
				this[defineProperty](i, z[i]);
			}
		}
	};


	obj._startUpdate = function(){
		this._groupUpdate = [];
	};

	obj._endUpdate = function(){
		var i, r, u = this._groupUpdate;
		this._groupUpdate = null;

		for(i=0; i<u.length; i++){
			r = u[i];
			this.raiseEvent(r.e1, r.v, r.a, r.b, r.c);
		}

		for(i=0; i<u.length; i++){
			r = u[i];
			r.f.call(this, r.v, r.a, r.b, r.c);
		}

		for(i=0; i<u.length; i++){
			r = u[i];
			this.raiseEvent(r.e2, r.v, r.a, r.b, r.c);
		}
	};


/****************************************************************

	Creates a link to the new content template (array).

	@param	name	(String) Template name.
	@param	template	(Object) Template object.

*****************************************************************/


	obj.defineTemplate = function(name, template){

		var ref = "_" + name + "Template";
		var ref1 = ref + "1", ref2 = ref + "2", ref3 = ref + "3";

		var get = AW.camelCase("get", name);
		var set = AW.camelCase("set", name);

		var get1 = AW.camelCase("get", name, "template");
		var set1 = AW.camelCase("set", name, "template");

		var name1 = "-" + name;
		var name2 = "-" + name + "-";

		var undef;

		this[get] = function(a, b, c){

//			if (typeof(this[ref])=="function") {
//				return this[ref](a, b, c);
//			}

			var r, id, clone;

			if (a === undef){
				id = this._id + name1;
				r = this[ref];
			}
			else if (b === undef) {
				id = this._id + name2 + a;
				r = this[ref1] && this[ref1][a];

				if (!r) {
					r = this[ref];
					clone = true;
				}
			}
			else if (c === undef) {
				id = this._id + name2 + a + "-" + b;
				r = this[ref2] && this[ref2][a] && this[ref2][a][b];

				if (!r) {
				 	r = (this[ref1] && this[ref1][a]) || this[ref];
				 	clone = true;
				}
			}
			else {
				id = this._id + name2 + a + "-" + b + "-" + c;
				r = this[ref3] && this[ref3][a] && this[ref3][a][b] && this[ref3][a][b][c];

				if (!r) {
					r = (this[ref2] && this[ref2][a] && this[ref2][a][b]) || (this[ref1] && this[ref1][a]) || this[ref];
					clone = true;
				}
			}

			if (typeof(r)=="function") {
				return r.call(this, a, b, c);
			}

			if ((this.$clone) && (clone || r.$owner != this)){
				r = r.clone();
			}

			r.$owner = this;
			r.$0 = a;
			r.$1 = b;
			r.$2 = c;
			r._id = id;
			return r;

		};

		templates[get] = function(a, b, c){
			if (a === undef) {return this.$owner[get](this.$0, this.$1, this.$2)}
			if (b === undef) {return this.$owner[get](a, this.$0, this.$1)}
			if (c === undef) {return this.$owner[get](a, b, this.$0)}
			return this.$owner[get](a, b, c);
		};

		this[set] = function(template, a, b, c){

			var previous;

			if (a === undef) {

				previous = this[ref];
				this[ref] = template;

			}
			else if (b === undef) {

				if (!this[ref1]){this[ref1] = {}}

				previous = this[ref1][a];
				this[ref1][a] = template;

			}
			else if (c === undef) {

				if (!this[ref2]){this[ref2] = {}}
				if (!this[ref2][a]){this[ref2][a] = {}}

				previous = this[ref2][a][b];
				this[ref2][a][b] = template;

			}
			else {

				if (!this[ref3]){this[ref3] = {}}
				if (!this[ref3][a]){this[ref3][a] = {}}
				if (!this[ref3][a][b]){this[ref3][a][b] = {}}

				previous = this[ref3][a][b][c];
				this[ref3][a][b][c] = template;

			}

			if (template) {
				template.$name = name;
				template.$0 = a;
				template.$1 = b;
				template.$2 = c;

				if (template.$owner !== this && template !== previous){
					template.$owner = this;
					this.raiseEvent(AW.camelCase("on", name, "templateChanged"), template, a, b, c);
				}
			}
		};

		this[set](template);

		this[get1] = this[get]; // alias for get/setXXXTemplate
		this[set1] = this[set];
		templates[get1] = templates[get];
	};

	obj.$clone = true;

//	---

	function controlValue(){
		var text = this.getControlText();
		var format = this.getControlFormat();
		return format ? format.textToValue(text) : text;
	}

	function controlData(){
		var value = this.getControlValue();
		var format = this.getControlFormat();
		return format ? format.valueToData(value) : value;
	}

//	---

	obj.defineModel("tab", {index:0});
	obj.defineModel("control", {text:"", image:"", link:"", value:controlValue, data:controlData, format:"", tooltip:"", state:"", visible:true, disabled:false});

	obj.setControlSize = obj.setSize;
	obj.setControlPosition = obj.setPosition;

	obj.onControlVisibleChanged = function(value){
		this.setClass("visible", value);
	};

	obj.focus = function(){};

//	---

	obj.setName = function(name){
		var hidden = new AW.HTML.INPUT;
		hidden.setAttribute("type", "hidden");
		hidden.setAttribute("name", name);
		hidden.setAttribute("value", function(){
			return AW.valueToText(this.getControlData());
		});
		this.setContent("data", hidden);
	};

//	---

	obj.setController = function(name, controller){
		var i, n = "_" + name + "Controller";
		this[n] = controller;
		for(i=0; i<this._controllers.length; i++){
			if (this._controllers[i] == n) {
				return;
			}
		}
		this._controllers = this._controllers.concat();
		this._controllers.push(n);
	};

	obj._controllers = [];

	obj.raiseEvent = function(name, source, a, b, c){
		var i, r;
		var handler = this[name];
		if (typeof(handler)=="function"){
			r = handler.call(this, source, a, b, c);
			if (r) {return r}
		}
		for (i=0; i<this._controllers.length; i++){
			handler = this[this._controllers[i]] ? this[this._controllers[i]][name] : null;
			if (typeof(handler)=="function") {
				r = handler.call(this, source, a, b, c);
				if (r) {return r}
			}
			else if (typeof(handler) == "string" && handler != name) {
				r = this.raiseEvent(handler, source, a, b, c);
				if (r) {return r}
			}
		}
	};

//	obsolete - do not use
	obj.action = function(name, source, a, b, c){
		this.raiseEvent(AW.camelCase("on", name), source, a, b, c);
	};

	obj.$active = false;

	AW._startEventManager();
};


