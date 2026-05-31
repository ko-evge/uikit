<%@ WebService Language="VB" Class="webservice" %>

Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data
Imports System.Data.OleDb

<WebService(Namespace:="http://tempuri.org/")> _
Public Class webservice
    Inherits System.Web.Services.WebService
    
    <WebMethod()> _
    Public Function getDataSet(ByVal name As String) As DataSet

        Dim Connection As New OleDbConnection("Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("App_Data/database.mdb"))
        Dim Sql As String = "SELECT * FROM authors"

        Dim Data As DataSet = New DataSet()

        Dim Adapter As OleDbDataAdapter = New OleDbDataAdapter(Sql, Connection)
        Adapter.MissingSchemaAction = MissingSchemaAction.AddWithKey
        Adapter.Fill(Data, "Data")

        Return Data
    End Function
End Class
