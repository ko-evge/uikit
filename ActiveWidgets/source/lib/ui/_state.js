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

AW.UI.Controllers.State = (function(){

	function itemSelected(value, index){

		this.calculateItemState(index);

		var i, a = this.getSelectedItems();

		for(i=0; i<a.length; i++){
			if(a[i]==index){
				if(!value){
					a = a.concat();
					a.splice(i, 1);
					this.setSelectedItems(a);
				}
				return;
			}
		}

		if(value){
			a = a.concat(index);
			this.setSelectedItems(a);
		}
	}

	var select = [], unselect = [];

	function selectedItems1(a){

		var b = this.getSelectedItems();

		var i, before = {}, after = {};

		select = [];
		unselect = [];

		for (i=0; i<b.length; i++){
			before[b[i]] = true;
		}

		for (i=0; i<a.length; i++){
			after[a[i]] = true;
		}

		for (i=0; i<b.length; i++){
			if(!after[b[i]]){
				unselect.push(b[i]);
			}
		}

		for (i=0; i<a.length; i++){
			if(!before[a[i]]){
				select.push(a[i]);
			}
		}
	}

	function selectedItems2(){

		var i;

		for (i=0; i<unselect.length; i++){
			if (this.getItemSelected(unselect[i])){
				this.setItemSelected(false, unselect[i]);
			}
		}

		for (i=0; i<select.length; i++){
			if (!this.getItemSelected(select[i])){
				this.setItemSelected(true, select[i]);
			}
		}
	}

	var current;

	function currentItem1(){
		current = this.getCurrentItem();
	}

	function currentItem2(index){

		this.calculateItemState(current);
		var e1 = this.getItem(current).getContent("box/text").element();
		if (e1 && index != current) {
			e1.tabIndex = -1;
		}
		e1 = null;

		this.calculateItemState(index);
		var e2 = this.getItem(index).getContent("box/text").element();
		if (e2 && e2.focus && !AW.opera && !AW.$popup) {
			e2.tabIndex = this.getTabIndex();
			e2.focus();
		}
		e2 = null;
	}

	return {

		onItemSelectedChanged	: itemSelected,

		onCurrentItemChanging	: currentItem1,
		onCurrentItemChanged	: currentItem2,

		onSelectedItemsChanging	: selectedItems1,
		onSelectedItemsChanged	: selectedItems2

	};

})();

