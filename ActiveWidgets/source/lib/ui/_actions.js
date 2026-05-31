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

AW.UI.Controllers.Actions = (function(){

	function clicked(event, index){
		return index;
	}

	function current(){
		return this.getCurrentItem();
	}

	function first(){
		var p = this.getViewOffset();
		var a = this.getViewIndices();
		return a ? a[p] : p;
	}

	function last(){
		var p = this.getViewOffset() + this.getViewCount() - 1;
		var a = this.getViewIndices();
		return a ? a[p] : p;
	}

	function next(){
		var i = this.getCurrentItem();
		var p = Math.min(this.getViewPosition(i) + 1, this.getViewOffset() + this.getViewCount() - 1);
		var a = this.getViewIndices();
		return a ? a[p] : p;
	}

	function previous(){
		var i = this.getCurrentItem();
		var p = Math.max(this.getViewPosition(i) - 1, this.getViewOffset());
		var a = this.getViewIndices();
		return a ? a[p] : p;
	}

	function go(i){
		this.setCurrentItem(i);
	}

	function select(i){
		this.setSelectedItems([i]);
		this.setCurrentItem(i);
	}

	function toggle(i){
		this.setItemSelected(!this.getItemSelected(i), i);
		if (i != this.getCurrentItem()){this.setCurrentItem(i)}
	}

	function f(action, item){
		return function(event, index){
			var i = item.call(this, event, index);
			AW.setReturnValue(event, false);
			if (event && event.type == "mousedown"){
				this.setTimeout(function(){
					if (this.$active){
						action.call(this, i);
					}
				});
			}
			else {
				if (this.$active){
					action.call(this, i);
				}
			}
			event = null;
		}
	}

	return {

		gotoClickedItem:	f(go, clicked),
		gotoPreviousItem:	f(go, previous),
		gotoNextItem:		f(go, next),
		gotoFirstItem:		f(go, first),
		gotoLastItem:		f(go, last),

		selectClickedItem:	f(select, clicked),
		selectPreviousItem:	f(select, previous),
		selectNextItem:		f(select, next),
		selectFirstItem:	f(select, first),
		selectLastItem:		f(select, last),

		toggleClickedItem:	f(toggle, clicked),
		toggleCurrentItem:	f(toggle, current)

	};

})();

