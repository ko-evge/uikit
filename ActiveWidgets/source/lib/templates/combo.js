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

AW.Templates.Combo = AW.Templates.ImageText.subclass();

AW.Templates.Combo.create = function(){

	AW.Templates.Popup.create.call(this);

	var obj = this.prototype;

	obj.setClass("templates", "combo");
	obj.setClass("combo", "box");

	var button = new AW.HTML.TABLE;

	button.setClass("combo", "button");
	button.setAttribute("cellspacing", "0");

	button.setEvent("onclick", function(event){

		if ((!this.$owner && !this.$active) || (this.$owner && !this.$owner.$active)) {
			return;
		}

		if (this.$owner && this.$name == "cell"){
			this.$owner.startCellEdit();
		}

		this.showPopup();
	});

	obj.setContent("box/sign", button);
	obj.setContent("box/sign/html", "<tr class=\"aw-cb-1\"><td></td></tr><tr class=\"aw-cb-2\"><td>&nbsp;</td></tr><tr class=\"aw-cb-3\"><td></td></tr>");

	AW._addMouseEvents(obj, "combo");
};

