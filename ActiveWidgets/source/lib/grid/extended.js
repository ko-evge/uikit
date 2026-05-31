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

AW.Grid.Extended = AW.Grid.Control.subclass();

AW.Grid.Extended.create = function(){

	var obj = this.prototype;

	obj.$extended = true;

	obj.setController("extended", AW.Grid.Controllers.Extended);

	obj.setView(new AW.Panels.Grid);

	obj.defineTemplate("top", new AW.Templates.List);
	obj.defineTemplate("bottom", new AW.Templates.List);


//	---

	var splitColumns = function(p, j){
		var left = this.$owner._fixedLeft, right = this.$owner._fixedRight;
		var i = this.$1;
		switch(p) {
			case "count":
				if (i == "left") {return left}
				if (i == "center") {return this.$owner.getColumnProperty("count") - left - right}
				if (i == "right") {return right}
				return 0;
			case "offset":
				if (i == "left") {return 0}
				if (i == "center") {return left}
				if (i == "right") {return this.$owner.getColumnProperty("count") - right}
				return 0;
			default:
				return this.$owner.getColumnProperty(p, j);
		}
	};

	obj.getHeaders().mapModel("view", splitColumns);
	obj.getFooters().mapModel("view", splitColumns);
	obj.getRow().mapModel("view", splitColumns);

};

