<%@ Control Language="VB" ClassName="Grid" Explicit="true" %>
<%@ Import Namespace="System.Data" %>
<div style="width:500px; height: 200px">

<!-- client-side data block -->
<script language="javascript">

    var myHeaders = <%= Headers %>;
    var myCells = <%= Cells %>;

</script>

<!-- grid initialization script  -->
<script language="javascript">

    //    create grid control
    var obj = new AW.UI.Grid;
    obj.setId("<%= ClientID %>");
    obj.setStyle("width", "100%");
    obj.setStyle("height", "100%");

    //    set grid text
    obj.setHeaderText(myHeaders);
    obj.setCellText(myCells);

    //    set number of columns/rows
    obj.setColumnCount(myHeaders.length);
    obj.setRowCount(myCells.length);

    //    write grid to the page
    document.write(obj);

    //    save reference to the grid object
    var <%= ClientID %> = obj;

</script>
</div>
<script runat="server">
    
    Private Headers As New StringBuilder("[]")
    Private Cells As New StringBuilder("[[]]")
    Private SourceID As String
    
    Property DataSourceID() As String
        Get
            Return SourceID
        End Get
        Set(ByVal value As String)
            SourceID = value
        End Set
    End Property
    
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs)
        Dim DataSource As Control = Page.FindControl(SourceID)
        If TypeOf DataSource Is SqlDataSource Then
            Dim Result = CType(DataSource, SqlDataSource).Select(DataSourceSelectArguments.Empty)
            If TypeOf Result Is DataView Then
                Dim Data As DataView = CType(Result, DataView)
                Dim i As Integer
                Dim Row As DataRowView
             
                Headers = New StringBuilder("[")
                For i = 0 To Data.Table.Columns.Count - 1
                    Headers.Append("""")
                    Headers.Append(Data.Table.Columns(i).Caption.Replace("\", "\\").Replace("""", "\"""))
                    Headers.Append(""",")
                Next
                Headers.Replace(",", "", Headers.Length - 1, 1)
                Headers.Append("]")

                Cells = New StringBuilder("[" + vbNewLine)
                For Each Row In Data
                    Cells.Append(vbTab + "[")
                    For i = 0 To Data.Table.Columns.Count - 1
                        Cells.Append("""")
                        Cells.Append(Row(i).ToString().Replace("\", "\\").Replace("""", "\"""))
                        Cells.Append(""",")
                    Next
                    Cells.Replace(",", "", Cells.Length - 1, 1)
                    Cells.Append("]," + vbNewLine)
                Next
                Cells.Replace("," + vbNewLine, vbNewLine, Cells.Length - 3, 3)
                Cells.Append("]")
            End If
        End If
    End Sub
</script>

