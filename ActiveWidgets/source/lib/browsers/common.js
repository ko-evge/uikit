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

(function(){

	AW.all = {id: 0};

	AW.docs = [document];

	AW.log = function(level, arg){
		try {
			var i, s = "";
			for(i=0; i<arg.length; i++){
				s += arg[i] + " ";
			}
			window.status = s;
		}
		catch(error){
			window.status = error.message;
		}
	};

	AW.debug = function(){AW.log("debug", arguments)};
	AW.info  = function(){AW.log("info",  arguments)};
	AW.warn  = function(){AW.log("warn",  arguments)};
	AW.error = function(){AW.log("error", arguments)};
	AW.fatal = function(){AW.log("fatal", arguments)};

	AW.forEach = function(array, handler){
		var i, custom = {};
		for(i in array){
			if (!custom[i]){
				handler(i, array[i]);
			}
		}
	};

	AW.element = function(id){
		if (!id || typeof(id) != "string") {return}
		var i, e, docs = AW.docs;
		for(i=0; i<docs.length; i++) {
			e = docs[i].getElementById(id);
			if(e) {return e}
		}
	};

	AW.object = function(id, skipContent){

		var parts = id.split("-");
		var tag = parts[0];
		var obj = AW.all[tag];

		if (!obj){
			return;
		}

		for (var i=1; i<parts.length; i++){

			var name = parts[i];

			if (obj["_" + name + "Content"]){
				if (!skipContent){
					for (var j=i; j<parts.length; j++){
						obj = obj.getContent(parts[j]);
					}
				}
				return obj; // content
			}

			tag += "-" + name;

			if (AW.element(tag)){
				obj = obj.getTemplate(name);
				continue;
			}

			var index1 = parts[++i];
			tag += "-" + index1;

			if (AW.element(tag)){
				obj = obj.getTemplate(name, index1);
				continue;
			}

			var index2 = parts[++i];
			tag += "-" + index2;

			if (AW.element(tag)){
				obj = obj.getTemplate(name, index1, index2);
				continue;
			}

			var index3 = parts[++i];
			tag += "-" + index3;

			if (AW.element(tag)){
				obj = obj.getTemplate(name, index1, index2, index3);
				continue;
			}
		}
		return obj; // control or template
	};

	var events = {
		"DOMFocusIn": "focus"
	};

	AW.dispatch = function(element, event){

		var type = "_on" + (events[event.type] || event.type) + "Event";
		var target = AW.object(element.id);
		var obj = target;

		while (obj._parent){
			obj = obj._parent;
		}

		return target[type].call(obj, event);
	};

	AW.camelCase = function(){

		var i, s = arguments[0];
		for (i=1; i<arguments.length; i++){
			s += arguments[i].substr(0,1).toUpperCase() + arguments[i].substr(1);
		}
		return s;
	};

	AW.textPattern = /(\"|&|<|>)/gm;
	AW.textTable   = {"\"":"&quot;", "&":"&amp;", "<":"&lt;", ">":"&gt;"};
	AW.textReplace = function(c){return AW.textTable[c] || ""};

	AW.htmlPattern = /(&quot;|&amp;|&lt;|&gt;|<[^<>]*>)/gm;
	AW.htmlTable   = {"&quot;":"\"", "&amp;":"&", "&lt;":"<", "&gt;":">"};
	AW.htmlReplace = function(e){return AW.htmlTable[e] || ""};

	AW.valueToText  = function(v){return v ? String(v).replace(AW.textPattern, AW.textReplace) : ""};
	AW.textToValue  = function(t){return t ? String(t).replace(AW.htmlPattern, AW.htmlReplace) : ""};

})();
