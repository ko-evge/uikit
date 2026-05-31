<%@ LANGUAGE = VBScript %>
<%
    Dim oConnection
    Dim oRecordset

' connect to the database
    Set oConnection = Server.CreateObject("ADODB.Connection")
    oConnection.Open "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("database.mdb")

' retrieve the grid data
    Set oRecordset = oConnection.Execute("SELECT * FROM table")

' encodes control characters for javascript
function aw_string(s)

    s = Replace(s, "\", "\\")
    s = Replace(s, """", "\""") 'replace javascript control characters - ", \
    s = Replace(s, vbCr, "\r")
    s = Replace(s, vbLf, "\n")

    aw_string = """" & s & """"

end function

' returns the field names from the recordset formatted as javascript array
function aw_headers(oRecordset)

    Dim i, count, headers()

    count = oRecordset.fields.count
    ReDim headers(count-1)

    For i=0 to count-1
        headers(i) = aw_string(oRecordset(i).name)
    Next

    Response.write("[" & Join(headers, ", ") & "];")

end function

' returns the recordset data formatted as javascript array
function aw_cells(oRecordset)

    Dim i, col_count, row_count, columns(), rows()

    row_count = 0
    col_count = oRecordset.fields.count
    ReDim columns(col_count-1)

    Do while (Not oRecordset.eof)

        For i=0 to col_count-1
            columns(i) = aw_string(oRecordset(i))
        Next

        ReDim preserve rows(row_count)

        rows(row_count) = vbTab & "[" & Join(columns, ", ") & "]"
        row_count = row_count + 1

        oRecordset.MoveNext
    Loop

    Response.write("[" & vbNewLine & Join(rows, "," & vbNewLine) & vbNewLine & "];" & vbNewLine)

end function

%>
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
	#myGrid {height: 150px}
</style>
</head>
<body>

	<h3>ASP classic - VBScript, ADO</h3>
	<p>Make VBScript functions returning the data formatted as javascript arrays,<br />
	Insert the results inside Javascript data block</p>
	<pre>    var myHeaders = &lt;%= aw_headers(oRecordset) %&gt;
    var myCells = &lt;%= aw_cells(oRecordset) %&gt;</pre>

<!-- insert control tag -->
	<span id="myGrid"></span>

<!-- add data block -->
<script type="text/javascript">
//    insert javascript arrays produced by ASP functions
    var myHeaders = <%= aw_headers(oRecordset) %>
    var myCells = <%= aw_cells(oRecordset) %>

</script>

<!-- create and configure the grid control -->
<script type="text/javascript">

//    create grid control
    var grid = new AW.UI.Grid;

//    assign the grid id (same as placeholder tag above)
    grid.setId("myGrid");

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
<%
    oRecordset.close
    oConnection.close
%>