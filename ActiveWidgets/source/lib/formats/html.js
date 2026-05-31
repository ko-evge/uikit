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

AW.Formats.HTML = AW.System.Format.subclass();

AW.Formats.HTML.create = function(){

/****************************************************************

	String data format.

*****************************************************************/

	var obj = this.prototype;

/****************************************************************

	Transforms the wire data into the primitive value.

	@param	data	(String) Wire data.
	@return		Primitive value.

*****************************************************************/

	obj.dataToValue = function(data){
		return data ? data.replace(AW.htmlPattern, AW.htmlReplace) : "";
	};

/****************************************************************

	Transforms the wire data into the readable text.

	@param	data	(String) Wire data.
	@return		Readable text.

*****************************************************************/

	obj.dataToText = function(data){
		return data;
	};

	obj.textToValue = obj.dataToValue;

	if ("".localeCompare){
		obj.comparator = function(values, greater, less, equal, error){
			return function(i, j){
				try {
					return greater * ("" + values[i]).localeCompare(values[j]) || equal(i, j);
				}
				catch(e){
					return error(i, j, e);
				}
			}
		};
	}

};

