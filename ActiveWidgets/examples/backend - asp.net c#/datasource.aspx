<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data" %>
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

<!-- ASP.NET DataSource control -->
        <asp:AccessDataSource 
            ID="AccessDataSource1" 
            runat="server" 
            DataFile="~/App_Data/database.mdb"
            SelectCommand="SELECT * FROM [Authors]">
        </asp:AccessDataSource>

<!-- insert empty control tag -->
	<span id="grid"></span>

	<p>Back to <a href="index.htm">ASP.NET examples</a>, <a href="../index.htm">all examples</a></p>

<!-- insert data block -->
<script type="text/javascript">

//    javascript arrays produced by ASP.NET
    var myHeaders = <%= Headers %>;
    var myCells = <%= Cells %>;

</script>

<!-- create grid control -->
<script type="text/javascript">

//    create grid control
    var grid = new AW.UI.Grid;
    grid.setId("grid");

//    set grid text
    grid.setHeaderText(myHeaders);
    grid.setCellText(myCells);

//    set number of columns/rows
    grid.setColumnCount(myHeaders.length);
    grid.setRowCount(myCells.length);

//    replace the placeholder tag with the grid html
    grid.refresh();

</script>
</body>
</html>
<script runat="server">

    StringBuilder Headers = new StringBuilder("[]");
    StringBuilder Cells = new StringBuilder("[[]]");
    string SourceID = "AccessDataSource1";

    protected void  Page_Load(object sender, EventArgs e){
        Control DataSource  = Page.FindControl(SourceID);
        if(DataSource is SqlDataSource){
            object Result = ((SqlDataSource)DataSource).Select(DataSourceSelectArguments.Empty);
            if(Result is DataView){
                DataView Data = (DataView) Result;
                int i;
             
                Headers = new StringBuilder("[");
                for(i = 0; i < Data.Table.Columns.Count; i++){
                    Headers.Append("\"");
                    Headers.Append(Data.Table.Columns[i].Caption.Replace("\\", "\\\\").Replace("\"", "\\\""));
                    Headers.Append("\",");
                }
                Headers.Replace(",", "", Headers.Length - 1, 1);
                Headers.Append("]");

                Cells = new StringBuilder("[\n");
                foreach(DataRowView Row in Data){
                    Cells.Append("\t[");
                    for(i = 0; i < Data.Table.Columns.Count; i++){
                        Cells.Append("\"");
                        Cells.Append(("" + Row[i]).Replace("\\", "\\\\").Replace("\"", "\\\""));
                        Cells.Append("\",");
                    }
                    Cells.Replace(",", "", Cells.Length - 1, 1);
                    Cells.Append("],\n");
                }
                Cells.Replace(",\n", "\n", Cells.Length - 3, 3);
                Cells.Append("]");
            }
        }
    }
</script>