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

AW.HTML.define = function(name, tag, type){
	if (!tag) {tag = name.toLowerCase()}
	AW.HTML[name] = AW.System.HTML.subclass();
	AW.HTML[name].create = function(){this.prototype.setTag(tag)};
};

(function(){
	var i, tags = ["DIV", "SPAN", "IMG", "INPUT", "BUTTON", "TEXTAREA", "TABLE", "TR", "TD"];
	for(i=0; i<tags.length; i++){
		AW.HTML.define(tags[i]);
	}
})();

