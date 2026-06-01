//-----------------------------------------------------------------------------
// ALL DOCUMENTS 
//-----------------------------------------------------------------------------
function sale_close() {
   AllDocPanel.setStyle("display", "none");  
   P2BoxSale1.setStyle("display", "none");  
   Lb1GridSale.setStyle("display", "none");  
   GridSale.setStyle("visibility","hidden");  
}
//-----------------------------------------------------------------------------
//                                    
//-----------------------------------------------------------------------------
function sale_open() {
   SalePanel.setStyle("display", "block");  
   P2BoxSale1.setStyle("display", "block");  
   Lb1GridSale.setStyle("display", "block");  
   GridSale.setStyle("visibility","visible");  

   grid_sale.element().focus(); 
   grid_sale.selectCell(2,0);
   grid_sale.refresh();
} 
//-----------------------------------------------------------------------------
//  
//-----------------------------------------------------------------------------
var HeaderSale = ["Goods", "Cost"];

                             var sale_obj = AW.HTML.SPAN.subclass();  
                             sale_obj.create = function(){  
                                  var obj = this.prototype;  
                                  var _super = this.superclass.prototype;  
      
                                  obj.init = function(argument){  
                                       _super.init.call(this);  
         
                                       obj.setStyle("position", "absolute"); 
                                       obj.setStyle("moz-user-focus","normal"); 
           
                                       obj.setStyle("background", "#bbbbbb"); 
                                       obj.setStyle("z-index", "1000"); 
    
                                       var workarea = new AW.HTML.DIV;  
                                       workarea.setContent("text", argument.toString());  
  
                                       obj.setContent("html",  workarea);         
                                  }  
                             }  

                             var sale_panel = new AW.UI.Group;
                             sale_panel.setId("sale_panel");
                             var SalePanel = new sale_obj(sale_panel); 
                             SalePanel.setStyle("display", "none") ;    
                             document.write(SalePanel); 

sale_panel.flag = true;
                             var p2_box_sale1 = new AW.UI.Group;
                             p2_box_sale1.setId("p2_box_sale1");
                             var P2BoxSale1 = new sale_obj(p2_box_sale1); 
                             P2BoxSale1.setStyle("display", "none") ;    
                             document.write(P2BoxSale1); 

                             var lb1_grid_sale = new AW.UI.Label;
                             lb1_grid_sale.setId("lb1_grid_sale");
                             lb1_grid_sale.setControlText("Point Of Sale: ");
                             lb1_grid_sale.setControlImage([""]);
                             var Lb1GridSale = new sale_obj(lb1_grid_sale); 
                             Lb1GridSale.setStyle("display", "none") ;    
                             document.write(Lb1GridSale); 

                             var grid_sale = new AW.UI.Grid;
                             grid_sale.setId("grid_sale");
                             grid_sale.setHeaderText(HeaderAlldoc);
                             grid_sale.setHeaderHeight(30);
                             grid_sale.setRowHeight(26);
                             grid_sale.setColumnCount(2);
                             grid_sale.setRowCount(25);
                             grid_sale.setRowHeight(40);
                          
                             grid_sale.getRowTemplate().setClass("text", "wrap");
                             grid_sale.setCellTemplate(new AW.Templates.ImageText);
  
                             grid_sale.setSelectorVisible(true);
                             grid_sale.setSelectorWidth(35);
                             grid_sale.setSelectorText(function(i){return this.getRowPosition(i)+1});
    
grid_sale.getSeparatorTemplate().setEvent("ondblclick", function(event){
        this.raiseEvent("onSeparatorDoubleClicked", event, this.$0);
 });

grid_sale.onSeparatorDoubleClicked = function(event, column){
        
 };
                             var bt_delete_grid_sale = new AW.UI.Button;
                             bt_delete_grid_sale.setId("bt_delete_grid_sale");
                             bt_delete_grid_sale.setControlText("Delete");

bt_delete_grid_sale.onClick = function pres_delete_sale () {
  if (sale_panel.flag) {
     sale_panel.flag = false;

  };  
};
                             var bt_clear_grid_sale = new AW.UI.Button;
                             bt_clear_grid_sale.setId("bt_clear_grid_sale");
                             bt_clear_grid_sale.setControlText("Clear");

bt_clear_grid_sale.onClick = function pres_clear_sale(){
  if (sale_panel.flag) {
     sale_panel.flag = false;
     
  };   
};
                             var bt_check_grid_sale = new AW.UI.Button;
                             bt_check_grid_sale.setId("bt_check_grid_sale");
                             bt_check_grid_sale.setControlText("Check")

bt_check_grid_sale.onClick = function pres_check_sale(){
  if (sale_panel.flag) {
     sale_panel.flag = false;
  };
};

                             var bt_quantity_grid_sale = new AW.UI.Button;
                             bt_quantity_grid_sale.setId("bt_quantity_grid_sale");
                             bt_quantity_grid_sale.setControlText("Quantity");

bt_quantity_grid_sale.onClick = function pres_quantity_sale(){
  if (sale_panel.flag) {
     sale_panel.flag = false;
  };   
};
                             var bt_search_grid_sale = new AW.UI.Button;
                             bt_search_grid_sale.setId("bt_search_grid_sale");
                             bt_search_grid_sale.setControlText("Search");

bt_search_grid_sale.onClick = function pres_search_sale(){
 sale_close();
};
//------------------------------------------------------------------------------
                             var lb_payment_sale = new AW.UI.Label;
                             lb_payment_sale.setId("lb_payment_sale");
                             lb_payment_sale.setControlText("Payment");
                             lb_payment_sale.setControlImage([""]);
                             var LbPaymentSale = new sale_obj(lb_payment_sale); 
                             LbPaymentSale.setStyle("display", "none") ;    
                             document.write(LbPaymentSale); 

                             var lb_price_sale = new AW.UI.Label;
                             lb_price_sale.setId("lb_price_sale");
                             lb_price_sale.setControlText("Price List");
                             lb_price_sale.setControlImage([""]);
                             var LbPriceSale = new sale_obj(lb_price_sale); 
                             LbPriceSale.setStyle("display", "none") ;    
                             document.write(LbPriceSale); 

//-------------------------------------------------------------------------------
                             var bt_cach_sale = new AW.UI.Button;
                             bt_cach_sale.setId("bt_cach_sale");
                             bt_cach_sale.setControlText("Cach");
                             bt_cach_sale.setStyle("display", "none") ;    
                             var BtCachSale = new sale_obj(bt_cach_sale); 
                             LbCachSale.setStyle("display", "none") ;    
                             document.write(LbCachSale); 

bt_cach_sale.onClick = function pres_cach_sale(){
  if (sale_panel.flag) {
  };   
};      
                             var bt_debit_sale = new AW.UI.Button;
                             bt_debit_sale.setId("bt_debit_sale");
                             bt_debit_sale.setControlText("Debit");
                             bt_debit_sale.setStyle("display", "none") ;    
                             var BtDebitSale = new sale_obj(bt_debit_sale); 
                             LbDebitSale.setStyle("display", "none") ;    
                             document.write(LbDebitSale); 

                             var bt_visa_sale = new AW.UI.Button;
                             bt_visa_sale.setId("bt_visa_sale");
                             bt_visa_sale.setControlText("Visa");
                             bt_visa_sale.setStyle("display", "none") ;    
                             var BtVisaSale = new sale_obj(bt_visa_sale); 
                             LbVisaSale.setStyle("display", "none") ;    
                             document.write(LbVisaSale); 

                             var bt_mastercard_sale = new AW.UI.Button;
                             bt_mastercard_sale.setId("bt_mastercard_sale");
                             bt_mastercard_sale.setControlText("Visa");
                             bt_mastercard_sale.setStyle("display", "none") ;    
                             var BtMastercardSale = new sale_obj(bt_mastercard_sale); 
                             LbMastercardSale.setStyle("display", "none") ;    
                             document.write(LbMastercardSale); 

                             var bt_mastercard_sale = new AW.UI.Button;
                             bt_mastercard_sale.setId("bt_mastercard_sale");
                             bt_mastercard_sale.setControlText("Master Card");
                             bt_mastercard_sale.setStyle("display", "none") ;    
                             var BtMastercardSale = new sale_obj(bt_mastercard_sale); 
                             LbMastercardSale.setStyle("display", "none") ;    
                             document.write(LbMastercardSale); 

                             var bt_amexpress_sale = new AW.UI.Button;
                             bt_amexpress_sale.setId("bt_amexpress_sale");
                             bt_amexpress_sale.setControlText("Am.express");
                             bt_amexpress_sale.setStyle("display", "none") ;    
                             var BtAmexpressSale = new sale_obj(bt_amexpress_sale); 
                             LbAmexpressSale.setStyle("display", "none") ;    
                             document.write(LbAmexpressSale); 

                             var bt_otherpay_sale = new AW.UI.Button;
                             bt_otherpay_sale.setId("bt_otherpay_sale");
                             bt_otherpay_sale.setControlText("Other Pay");
                             bt_otherpay_sale.setStyle("display", "none") ;    
                             var BtOtherpaySale = new sale_obj(bt_otherpay_sale); 
                             LbOtherpaySale.setStyle("display", "none") ;    
                             document.write(LbOtherpaySale); 


                             // var bt_page_up_grid_sale = new AW.UI.Button;
                             // bt_page_up_grid_sale.setId("bt_page_up_grid_sale");
                             // bt_page_up_grid_sale.setControlText("Page Up");
        
//bt_page_up_grid_sale.onClick = function pres_page_up_sale(){
//            
// };
                             // var bt_page_dn_grid_sale = new AW.UI.Button;
                             // bt_page_dn_grid_sale.setId("bt_page_dn_grid_sale");
                             // bt_page_dn_grid_sale.setControlText("Page Dn");
        
// bt_page_dn_grid_sale.onClick = function pres_page_dn_sale(){
//              
// };
                             var toolbar_grid_sale = new AW.HTML.DIV;
                             toolbar_grid_sale.setContent("button1", function(){return bt_add_grid_sale});
                             toolbar_grid_sale.setContent("button2", function(){return bt_delete_grid_sale});
                             toolbar_grid_sale.setContent("button3", function(){return bt_select_grid_sale});
                             toolbar_grid_sale.setContent("button4", function(){return bt_report_grid_sale});
                             toolbar_grid_sale.setContent("button7", function(){return bt_close_grid_sale});
                             // toolbar_grid_sale.setContent("button5", function(){return bt_page_up_grid_sale});
                             // toolbar_grid_sale.setContent("button6", function(){return bt_page_dn_grid_sale});
                             grid_sale.defineTemplate("toolbar", toolbar_grid_sale);
                             grid_sale.setLayoutTemplate(new AW.Panels.Horizontal);

grid_sale.setPanelTemplate(function(i){
    switch(i){
       case "top":     return this.getToolbarTemplate();
       case "center":  return this.getScrollTemplate();
    };                    
 });

grid_sale.onPanelWidthChanged = function(width, panel){
   this.getLayoutTemplate().changePanelWidth(width, panel);
 };

grid_sale.onPanelHeightChanged = function(height, panel){
    this.getLayoutTemplate().changePanelHeight(height, panel);
 };
                             grid_sale.setPanelHeight(40, "top"); 

                             var GridAlldoc = new sale_obj(grid_sale); 
                             GridAlldoc.setStyle("visibility","hidden");
                             document.write(GridAlldoc);
    
//-----------------------------------------------------------------------------
//  
//-----------------------------------------------------------------------------