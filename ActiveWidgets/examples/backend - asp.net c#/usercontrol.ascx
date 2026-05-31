<%@ Control Language="C#" ClassName="Grid" Explicit="true" %>
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
    
    StringBuilder Headers = new StringBuilder("[]");
    StringBuilder Cells = new StringBuilder("[[]]");
    string SourceID;
    
    public string DataSourceID {
        get {
            return SourceID;
        }
        set {
            SourceID = value;
        }
    }    
        
    protected void  Page_Load(object sender, EventArgs e){
        Control DataSource = Page.FindControl(SourceID);
        if (DataSource is SqlDataSource) {
            Object Result = ((SqlDataSource)DataSource).Select(DataSourceSelectArguments.Empty);
            if (Result is DataView){
                DataView Data = (DataView)Result;
                int i;
                
                Headers = new StringBuilder("[");
                for (i = 0; i< Data.Table.Columns.Count; i++) {
                    Headers.Append("\"");
                    Headers.Append(Data.Table.Columns[i].Caption.Replace("\\", "\\\\").Replace("\"", "\\\""));
                    Headers.Append("\",");
                }
                Headers.Replace(",", "", Headers.Length - 1, 1);
                Headers.Append("]");

                Cells = new StringBuilder("[\n");
                foreach(DataRowView Row in Data) {
                    Cells.Append("\t[");
                    for(i = 0; i < Data.Table.Columns.Count; i++) {
                        Cells.Append("\"");
                        Cells.Append(Row[i].ToString().Replace("\\", "\\\\").Replace("\"", "\\\""));
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

