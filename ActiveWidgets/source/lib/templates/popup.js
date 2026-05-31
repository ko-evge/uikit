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

AW.Templates.Popup = AW.System.Template.subclass();

AW.Templates.Popup.create = function(){

	var obj = this.prototype;

	obj.setClass("popup", "normal");

	obj.showPopup = function(){

		unregisterPopupDoc();

		var popup = window.createPopup();
		this.$popup = popup;
		AW.$popup = this;

		var doc = popup.document;
		doc.open();

		if (AW.strict){
			doc.write("<!DOCTYPE HTML PUBLIC \"-\/\/W3C\/\/DTD HTML 4.01\/\/EN\" \"http:\/\/www.w3.org/TR/html4/strict.dtd\">");
		}

		doc.write("<html class=\"aw-popup-window aw-system-control " + AW._htmlClasses + " aw-popup-" + AW.theme + "\"><head>");

		AW.register(doc.parentWindow);

		for (var i=0; i<document.styleSheets.length; i++){
			doc.write(document.styleSheets[i].owningElement.outerHTML);
		}

		doc.write("</head><body onselectstart=\"return false\" oncontextmenu=\"return false\">");
		doc.write(this.getPopup().toString());
		doc.write("</body></html>");
		doc.close();

		var ref = this.element();

		var left = 0;
		var top = ref.offsetHeight;
		var width = ref.offsetWidth;
		var height = 1;

		popup.show(left, top, width, height, ref);

		function resizePopup(){
			try {
				if (popup.isOpen){
					var e = doc.body.firstChild;
					width = e.offsetWidth;
					height = e.offsetHeight;
					if (!width || !height){
						return this.setTimeout(resizePopup, 100);
					}
					popup.show(left, top, width, height, ref);
				}
				ref = null;
				popup = null;
				doc = null;
			}
			catch(err){
			}
		}

		this.setTimeout(resizePopup);
	};

	obj.hidePopup = function(){

		unregisterPopupDoc();

		if (this.$popup){
			this.$popup = null;
		}
		if (AW.$popup){
			AW.$popup = null;
		}
	};

	function unregisterPopupDoc(){
        try {
            if (AW.$popup){
                var popup = AW.$popup.$popup;

                if (popup && popup.isOpen){
                    popup.hide();
                }

                if (popup){
                    var i, docs = AW.docs;
                    for(i=0; i<docs.length; i++) {
                        if (docs[i].body==popup.document.body){
                            docs.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
        catch(err){
            // ignore errors
        }
    }


if (!AW.ie){

	function onmousedown(event){
		if (event.target){
			event.preventDefault();
			return;
		}
	}

	obj.showPopup = function(){

		if (this.$popup){
			document.body.removeChild(this.$popup);
			this.$popup = null;
		}

		var ref = this.element() ? this.element() : document.body;

		var left = AW.getLeft(ref);
		var top = AW.getTop(ref) + ref.offsetHeight;

		var popup = document.createElement("div");
		this.$popup = popup;
		AW.$popup = this;

		document.body.appendChild(popup);
		popup.className = "aw-popup-window aw-system-control";
		popup.style.left = left + "px";
		popup.style.top = top + "px";
		popup.innerHTML = this.getPopup().toString();

		popup.addEventListener("mousedown", onmousedown, true);
	};

	obj.hidePopup = function(){
		if (this.$popup){
			this.$popup.removeEventListener("mousedown", onmousedown, true);
			this.setTimeout(function(){
				if (this.$popup){
					document.body.removeChild(this.$popup);
					this.$popup = null;
					AW.$popup = null;
				}
			});
		}
	};

	obj.onControlDeactivated = function(){
		this.hidePopup();
	}
}

};

