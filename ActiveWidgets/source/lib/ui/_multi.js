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

AW.UI.Controllers.Multi = {

		// keyboard

		onKeyHome:			"selectFirstItem",
		onKeyEnd:			"selectLastItem",
		onKeyUp:			"selectPreviousItem",
		onKeyDown:			"selectNextItem",
		onKeyPageUp:		"selectPreviousPage",
		onKeyPageDown:		"selectNextPage",

		onKeyCtrlHome:		"gotoFirstItem",
		onKeyCtrlEnd:		"gotoLastItem",
		onKeyCtrlUp:		"gotoPreviousItem",
		onKeyCtrlDown:		"gotoNextItem",
		onKeyCtrlPageUp:	"gotoPreviousPage",
		onKeyCtrlPageDown:	"gotoNextPage",

		onKeyCtrlSpace:		"toggleCurrentItem",
		onKeySpace:			"toggleCurrentItem",

		// mouse

		onItemClicked:		"toggleClickedItem"

};

