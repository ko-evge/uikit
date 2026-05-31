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
	<h3>ASP.NET, ADO.NET (old)</h3>
	<p>This is an old ADO ASP/VBScript code converted to ASP.NET/VB</p>

<!-- insert empty control tag -->
	<span id="grid"></span>

	<p>Back to <a href="index.htm">ASP.NET examples</a>, <a href="../index.htm">all examples</a></p>

<!-- insert data block -->
<script type="text/javascript">

//    insert javascript arrays produced by ASP.NET functions
    var myHeaders = <%= aw_headers(oDataReader) %>
    var myCells = <%= aw_cells(oDataReader) %>

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

//    write grid to the page
    grid.refresh();

</script>
</body>
</html>
<script runat="server">

    Dim strConnection As String = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("App_Data/database.mdb")
    Dim strCommand As String = "SELECT * FROM authors"
    
    Dim oConnection As OleDbConnection
    Dim oCommand As OleDbCommand
    Dim oDataReader As OleDbDataReader
    
    Sub page_load()
       
        oConnection = New OleDbConnection(strConnection)
        oConnection.Open()
        
        oCommand = New OleDbCommand(strCommand, oConnection)
        oDataReader = oCommand.ExecuteReader()
    End Sub

    Sub page_unload()

        oDataReader.Close()
        oConnection.Close()
    End Sub

    Private Function aw_string(ByVal s As String) As String

        s = s.Replace("\", "\\")
        s = s.Replace("""", "\""") 'replace javascript control characters - ", \
        rem s = s.Replace(vbCr, "\r")
        rem s = s.Replace(vbLf, "\n")

        Return """" & s & """"
    End Function

    Function aw_headers(ByVal oDataReader As OleDb.OleDbDataReader) As String

        Dim i, count, headers()

        count = oDataReader.FieldCount
        
        ReDim headers(count - 1)

        For i = 0 To count - 1
            headers(i) = aw_string(oDataReader.GetName(i))
        Next

        Response.Write("[" & Join(headers, ", ") & "];")
        
        Return ""
    End Function

    Function aw_cells(ByVal oDataReader As OleDbDataReader) As String

        Dim i, col_count, row_count, columns(), rows()

        row_count = 0
        col_count = oDataReader.FieldCount
        
        ReDim columns(col_count - 1)

        While (oDataReader.Read())

            For i = 0 To col_count - 1
                columns(i) = aw_string(oDataReader(i).ToString())
            Next

            ReDim Preserve rows(row_count)

            rows(row_count) = vbTab & "[" & Join(columns, ", ") & "]"
            row_count = row_count + 1

        End While

        Response.Write("[" & vbNewLine & Join(rows, "," & vbNewLine) & vbNewLine & "];" & vbNewLine)
        Return ""
        
    End Function

</script>