<%@ Page Language="VB" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="System.Data.OleDb" %>
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
	<h3>ASP.NET, ADO.NET</h3>
	<p>DataReader + StringBuilder code</p>

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

    Dim Headers As StringBuilder
    Dim Cells As StringBuilder

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs)

        Dim ConnectionString As String = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("App_Data/database.mdb")
        Dim Sql As String = "SELECT * FROM authors"

        Dim Connection As New OleDbConnection(ConnectionString)
        Connection.Open()

        Dim Command As New OleDbCommand(Sql, Connection)
        Dim DataReader As OleDbDataReader = Command.ExecuteReader()

        Dim i As Integer
        Headers = New StringBuilder("[")

        For i = 0 To DataReader.FieldCount - 1
            Headers.Append("""")
            Headers.Append(DataReader.GetName(i).Replace("\", "\\").Replace("""", "\"""))
            Headers.Append(""",")
        Next
        Headers.Replace(",", "", Headers.Length - 1, 1)
        Headers.Append("]")

        Cells = New StringBuilder("[" + vbNewLine)
        While (DataReader.Read())
            Cells.Append(vbTab + "[")
            For i = 0 To DataReader.FieldCount - 1
                Cells.Append("""")
                Cells.Append(DataReader(i).ToString().Replace("\", "\\").Replace("""", "\"""))
                Cells.Append(""",")
            Next
            Cells.Replace(",", "", Cells.Length - 1, 1)
            Cells.Append("]," + vbNewLine)
        End While
        Cells.Replace("," + vbNewLine, vbNewLine, Cells.Length - 3, 3)
        Cells.Append("]")
        
        DataReader.Close()
        Connection.Close()

    End Sub

</script>