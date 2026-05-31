<%@ Page Language="C#" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
	<title>ActiveWidgets Examples</title>

<!-- fix box model in firefox/safari/opera -->
<style type="text/css">
	.aw-quirks * {
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
</style>

<!-- include links to the script and stylesheet files -->
	<script src="runtime/lib/aw.js" type="text/javascript"></script>
	<link href="runtime/styles/system/aw.css" rel="stylesheet">

<!-- change default styles, set control size and position -->
<style type="text/css">

	#grid {width: 300px}

</style>
</head>
<body>
	<h3>ASP.NET WebService</h3>
	<p>WebService returning DataSet</p>

<!-- insert empty control tag -->
	<span id="grid"></span>

	<p>Back to <a href="index.htm">ASP.NET examples</a>, <a href="../index.htm">all examples</a></p>

<!-- create grid control -->
<script language="javascript">

	var table = new AW.XML.Table;
	table.setURL("webservice.asmx/getDataSet");
	table.setParameter("name", "value"); 
	table.setRequestMethod("POST");
	table.setRows("//NewDataSet/*"); // data rows XPath
	table.request();

	var grid = new AW.UI.Grid;
	grid.setId("grid");
	grid.setHeaderText(["ID", "Author", "Year Born"]);
	grid.setColumnCount(3);
	grid.setCellModel(table);
    grid.refresh();

</script>
</body>
</html>
