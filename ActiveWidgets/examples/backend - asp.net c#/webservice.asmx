<%@ WebService Language="C#" Class="WebService" %>

using System;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Data;
using System.Data.OleDb;

[WebService(Namespace = "http://tempuri.org/")]
public class WebService  : System.Web.Services.WebService {

    [WebMethod()]
    public DataSet getDataSet(string name){
        
        OleDbConnection Connection = new OleDbConnection("Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + this.Server.MapPath("App_Data/database.mdb"));
        string Sql = "SELECT * FROM authors";
        
        DataSet Data = new DataSet();

        OleDbDataAdapter Adapter = new OleDbDataAdapter(Sql, Connection);
        Adapter.MissingSchemaAction = MissingSchemaAction.AddWithKey;
        Adapter.Fill(Data, "Data");

        return Data;
    }
}
