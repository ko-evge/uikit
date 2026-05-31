<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="System.IO" %>
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
	<h3>ASP.NET, DataSourceControl</h3>
	<p>DataSourceControl</p>

<!-- insert empty control tag -->
	<span id="grid"></span>

	<p>Back to <a href="index.htm">ASP.NET examples</a>, <a href="../index.htm">all examples</a></p>

<!-- ASP.NET DataSource control -->
<asp:AccessDataSource 
    ID="AccessDataSource1" 
    runat="server" 
    DataFile="~/App_Data/database.mdb"
    SelectCommand="SELECT * FROM [Authors]">
</asp:AccessDataSource>

<!-- XML data block -->
<xml id="xmlDataIsland">
    <%= XML %>
</xml>

<!-- create grid control -->
<script language="javascript">

	var table = new AW.XML.Table;
	var xml = document.getElementById("xmlDataIsland");
	table.setXML(xml);

	var grid = new AW.UI.Grid;
	grid.setId("grid");
	grid.setHeaderText(["ID", "Author", "Year Born"]);
	grid.setColumnCount(3);
	grid.setRowCount(table.getCount());
	grid.setCellModel(table);
    grid.refresh();

</script>
</body>
</html>
<script runat="server">

    string SourceID = "AccessDataSource1";
    StringWriter XML = new StringWriter();
    
    protected void  Page_Load(object sender, EventArgs e){
        Control DataSource = Page.FindControl(SourceID);
        if (DataSource is SqlDataSource){
            object Result = ((SqlDataSource)DataSource).Select(DataSourceSelectArguments.Empty);
            if(Result is DataView){
                ((DataView)Result).ToTable().WriteXml(XML);
            }
        }
    }
</script>