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

AW.Templates.ImageText = AW.System.Template.subclass();

AW.Templates.ImageText.create = function(){

	var obj = this.prototype;

	function _image(){return this.getControlProperty("image") || "none"}
	function _text(){return this.getControlProperty("text")}
	function _tooltip(){return this.getControlProperty("tooltip")}

	var span = AW.HTML.SPAN;

	var image = new span;
	image.setClass("item", "image");
	image.setClass("image", _image);

	var ruler = new span;
	ruler.setClass("item", "ruler");

	var text = new span;
	text.setClass("item", "text");
	text.setContent("html", _text);

	var box = new span;
	box.setClass("item", "box");
	box.setContent("sign", "");
	box.setContent("marker", "");
	box.setContent("image", image);
	box.setContent("ruler", ruler);
	box.setContent("text", text);

	obj.setTag("span");
	obj.setClass("item", "template");
	obj.setClass("templates", "imagetext");
	obj.setAttribute("title", _tooltip);
	obj.setContent("box", box);

	obj.refresh = function(){

		this.refreshStyles();
		this.getContent("box/image").refreshClasses();

		if (AW._edit == this.getId()){
			AW._updateEdit();
		}
		else {
			this.refreshClasses();
			this.getContent("box/text").refreshContents();
		}
	};

	AW._addMouseEvents(obj);

	if (AW.gecko){
		obj.setAttribute("tabIndex", "-1");
	}

	obj.startEdit = function(text){
		AW._startEdit(this, text);
	};
};

