<%@ Page Language="C#" %>
<%@ Register Src="usercontrol.ascx" TagName="Grid" TagPrefix="ActiveWidgets" %>
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

</head>
<body>
    <form id="form1" runat="server">
    <div>

<!-- ASP.NET DataSource control -->
        <asp:AccessDataSource 
            ID="AccessDataSource1" 
            runat="server" 
            DataFile="~/App_Data/database.mdb"
            SelectCommand="SELECT * FROM [Authors]">
        </asp:AccessDataSource>

<!-- AW Grid UserControl -->
        <ActiveWidgets:Grid 
            ID="grid1" 
            runat="server" 
            DataSourceID="AccessDataSource1">
        </ActiveWidgets:Grid>

<!-- hidden fields for postback -->
        <asp:HiddenField ID="ClickedColumn" runat="server" />
        <asp:HiddenField ID="ClickedRow" runat="server" />
        <asp:Label ID="Label" runat="server" Text=""></asp:Label>
    </div>
   </form>

<script language="javascript">
    // client-side events (JavaScript)
    grid1.onCellDoubleClicked = function(event, col, row){
        // save clicked cell in the hidden fields and postback
        document.getElementById("clickedColumn").value = col;
        document.getElementById("clickedRow").value = row;
        form1.submit();
    }
</script>
</body>
</html>
<script runat="server">
    // sever-side events (C#) 
    protected void  Page_Load(object sender, EventArgs e){
        if (IsPostBack) {
            Label.Text = "DoubleClick: column-" + ClickedColumn.Value + " row-" + ClickedRow.Value;
        }
        else {
            Label.Text = "DoubleClick grid cell to post back";
        }
    }
</script>

