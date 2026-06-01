//-----------------------------------------------------------------------------
//  message warehouse 
//-----------------------------------------------------------------------------
function mes_war_close() {
   MesWarPanel.setStyle("display", "none");  
   MesLbWarC.setStyle("display", "none");  
   MesWarLb1.setStyle("display", "none") ;    
   MesWarLb2.setStyle("display", "none") ;    
   MesWarLb3.setStyle("display", "none") ;    
   MesWarQuantity.setStyle("display", "none") ;    
   MesWarPrice.setStyle("display", "none") ;    
   MesWarPriceList.setStyle("display", "none") ;    
   MesWarCancel.setStyle("display", "none") ;    
   MesWarOk.setStyle("display", "none") ;    
}
//-----------------------------------------------------------------------------
// close                                   
//-----------------------------------------------------------------------------
function mes_war_open() {
   MesWarPanel.setStyle("display", "block");  
   MesLbWarC.setStyle("display", "block");  
   MesWarLb1.setStyle("display", "block") ;    
   MesWarLb2.setStyle("display", "block") ;    
   MesWarLb3.setStyle("display", "block") ;    
   MesWarQuantity.setStyle("display", "block") ;    
   MesWarPrice.setStyle("display", "block") ;    
   MesWarPriceList.setStyle("display", "block") ;    
   MesWarCancel.setStyle("display", "block") ;    
   MesWarOk.setStyle("display", "block") ;    
}; 
//-----------------------------------------------------------------------------
//  message panel
//-----------------------------------------------------------------------------
                             var mes_war_obj = AW.HTML.SPAN.subclass();  
                             mes_war_obj.create = function(){  
                                  var obj = this.prototype;  
                                  var _super = this.superclass.prototype;  
      
                                  obj.init = function(argument){  
                                       _super.init.call(this);  
         
                                       obj.setStyle("position", "absolute"); 
                                       obj.setStyle("moz-user-focus","normal"); 
           
                                       obj.setStyle("background", "#bbbbbb"); 
                                       obj.setStyle("z-index", "12000"); 
    
                                       var workarea = new AW.HTML.DIV;  
                                       workarea.setContent("text", argument.toString());  
  
                                       obj.setContent("html",  workarea);         
                                  }  
                             }  

                             var mes_war_panel = new AW.UI.Group;
                             mes_war_panel.setId("mes_war_panel");
                             var MesWarPanel = new mes_war_obj(mes_war_panel); 
                             MesWarPanel.setStyle("display", "none") ;    
                             document.write(MesWarPanel); 

                             var mes_lb_war_c = new AW.UI.Label;
                             mes_lb_war_c.setId("mes_lb_war_c");
                             mes_lb_war_c.setControlText("Select quantity good");
                             mes_lb_war_c.setStyle("font-size", "10pt");   
                             mes_lb_war_c.setStyle("text-decoration", "underline");   
                             var MesLbWarC = new mes_war_obj(mes_lb_war_c); 
                             MesLbWarC.setStyle("display", "none") ;    
                             document.write(MesLbWarC); 

                             var mes_war_lb1 = new AW.UI.Label;
                             mes_war_lb1.setId("mes_war_lb1");
                             mes_war_lb1.setControlText("Enter quantity.");
                             mes_war_lb1.setControlImage([""]);
                             var MesWarLb1 = new mes_war_obj(mes_war_lb1);
                             MesWarLb1.setStyle("display", "none") ;    
                             document.write(MesWarLb1); 

                             var mes_war_lb2 = new AW.UI.Label;
                             mes_war_lb2.setId("mes_war_lb2");
                             mes_war_lb2.setControlText("Price:");
                             mes_war_lb2.setControlImage([""]);
                             var MesWarLb2 = new mes_war_obj(mes_war_lb2);
                             MesWarLb2.setStyle("display", "none") ;    
                             document.write(MesWarLb2); 

                             var mes_war_lb3 = new AW.UI.Label;
                             mes_war_lb3.setId("mes_war_lb3");
                             mes_war_lb3.setControlText("Price List:");
                             mes_war_lb3.setControlImage([""]);
                             var MesWarLb3 = new mes_war_obj(mes_war_lb3);
                             MesWarLb3.setStyle("display", "none") ;    
                             document.write(MesWarLb3); 
                             //---------------------
                             var mes_war_quantity = new AW.UI.Input;
                             mes_war_quantity.setId("mes_war_quantity");
                             mes_war_quantity.setControlText("");
                             var MesWarQuantity = new mes_war_obj(mes_war_quantity);
                             MesWarQuantity.setStyle("display", "none") ;    
                             document.write(MesWarQuantity); 

                             var mes_war_price = new AW.UI.Input;
                             mes_war_price.setId("mes_war_price");
                             mes_war_price.setControlText("");
                             var MesWarPrice = new mes_war_obj(mes_war_price);
                             MesWarPrice.setStyle("display", "none") ;    
                             document.write(MesWarPrice); 
            
                             var mes_war_price_list = new AW.UI.Input;
                             mes_war_price_list.setId("mes_war_price_list");
                             mes_war_price_list.setControlText("");
                             var MesWarPriceList = new mes_war_obj(mes_war_price_list);
                             MesWarPriceList.setStyle("display", "none") ;    
                             document.write(MesWarPriceList); 
                             //-----------------------
                             var mes_war_ok = new AW.UI.Button;
                             mes_war_ok.setId("mes_war_ok");
                             mes_war_ok.setControlText("Ok");
                             var MesWarOk = new mes_war_obj(mes_war_ok);
                             MesWarOk.setStyle("display", "none") ;    
                             document.write(MesWarOk); 
mes_war_ok.onClick = function(){
   
};
                             var mes_war_cancel = new AW.UI.Button;
                             mes_war_cancel.setId("mes_war_cancel");
                             mes_war_cancel.setControlText("Cancel");
                             var MesWarCancel = new mes_war_obj(mes_war_cancel);
                             MesWarCancel.setStyle("display", "none") ;    
                             document.write(MesWarCancel); 

mes_war_cancel.onClick = function(){
 mes_war_close();  
};
//-----------------------------------------------------------------------------
//  
//-----------------------------------------------------------------------------