//-----------------------------------------------------------------------------
// BAZA  
//-----------------------------------------------------------------------------
function baza_close() {
   BazaPanel.setStyle("display", "none");  
   P2BoxBaza1.setStyle("display", "none");  
   Lb1GridBaza.setStyle("display", "none");  
   GridBaza.setStyle("visibility","hidden");  
}
//-----------------------------------------------------------------------------
//                                    
//-----------------------------------------------------------------------------
function baza_open() {
   BazaPanel.setStyle("display", "block");  
   P2BoxBaza1.setStyle("display", "block");  
   Lb1GridBaza.setStyle("display", "block");  
   GridBaza.setStyle("visibility","visible");  
   // зависит от типа
   ar_records_baza = pipe.event({action:'get_baza'},true);
   grid_baza.setCellText(ar_records_baza);
   grid_baza.setRowCount(ar_records_baza.length);

   grid_baza.element().focus(); 
   grid_baza.selectCell(2,0);
   grid_baza.refresh();
} 
//-----------------------------------------------------------------------------
//  
//-----------------------------------------------------------------------------
var HeaderBaza = ["Number", "Data", "Operation", "Order", "Company", "Warehause", "Bank", "Warehouse(out)","Contact","Comment"];

                             var baza_obj = AW.HTML.SPAN.subclass();  
                             baza_obj.create = function(){  
                                  var obj = this.prototype;  
                                  var _super = this.superclass.prototype;  
      
                                  obj.init = function(argument){  
                                       _super.init.call(this);  
         
                                       obj.setStyle("position", "absolute"); 
                                       obj.setStyle("moz-user-focus","normal"); 
           
                                       obj.setStyle("background", "#bbbbbb"); 
                                       obj.setStyle("z-index", "100000"); 
    
                                       var workarea = new AW.HTML.DIV;  
                                       workarea.setContent("text", argument.toString());  
  
                                       obj.setContent("html",  workarea);         
                                  }  
                             }  

                             var baza_panel = new AW.UI.Group;
                             baza_panel.setId("baza_panel");
                             var BazaPanel = new baza_obj(baza_panel); 
                             BazaPanel.setStyle("display", "none") ;    
                             document.write(BazaPanel); 

baza_panel.flag = true;
                             var p2_box_baza1 = new AW.UI.Group;
                             p2_box_baza1.setId("p2_box_baza1");
                             var P2BoxBaza1 = new baza_obj(p2_box_baza1); 
                             P2BoxBaza1.setStyle("display", "none") ;    
                             document.write(P2BoxBaza1); 

                             var lb1_grid_baza = new AW.UI.Label;
                             lb1_grid_baza.setId("lb1_grid_baza");
                             lb1_grid_baza.setControlText("All Documents: ");
                             lb1_grid_baza.setControlImage([""]);
                             var Lb1GridBaza= new baza_obj(lb1_grid_baza); 
                             Lb1GridBaza.setStyle("display", "none") ;    
                             document.write(Lb1GridBaza); 

                             var grid_baza = new AW.UI.Grid;
                             grid_baza.setId("grid_baza");
                             grid_baza.setHeaderText(HeaderBaza);
                             grid_baza.setHeaderHeight(30);
                             grid_baza.setRowHeight(26);
                             grid_baza.setColumnCount(10);
                             grid_baza.setRowCount(25);
                             grid_baza.setRowHeight(40);
                          
                             grid_baza.getRowTemplate().setClass("text", "wrap");
                             grid_baza.setCellTemplate(new AW.Templates.ImageText);
  
                             grid_baza.setSelectorVisible(true);
                             grid_baza.setSelectorWidth(35);
                             grid_baza.setSelectorText(function(i){return this.getRowPosition(i)+1});
    
grid_baza.getSeparatorTemplate().setEvent("ondblclick", function(event){
        this.raiseEvent("onSeparatorDoubleClicked", event, this.$0);
 });

grid_baza.onSeparatorDoubleClicked = function(event, column){
        
 };
                             var bt_delete_grid_baza = new AW.UI.Button;
                             bt_delete_grid_baza.setId("bt_delete_grid_baza");
                             bt_delete_grid_baza.setControlText("Delete");

bt_delete_grid_baza.onClick = function pres_delete_baza () {
  if (baza_panel.flag) {
     baza_panel.flag = false;

  };  
};
                             var bt_edit_grid_baza = new AW.UI.Button;
                             bt_edit_grid_baza.setId("bt_edit_grid_baza");
                             bt_edit_grid_baza.setControlText("Edit");

bt_edit_grid_baza.onClick = function pres_edit_baza(){
  if (baza_panel.flag) {
     baza_panel.flag = false;
    
  };   
};

                             var bt_add_grid_baza = new AW.UI.Button;
                             bt_add_grid_baza.setId("bt_add_grid_baza");
                             bt_add_grid_baza.setControlText("Add");

bt_add_grid_baza.onClick = function pres_add_baza(){
  if (baza_panel.flag) {
     baza_panel.flag = false;
  };   
};
                             var bt_close_grid_baza = new AW.UI.Button;
                             bt_close_grid_baza.setId("bt_close_grid_baza");
                             bt_close_grid_baza.setControlText("Close");

bt_close_grid_baza.onClick = function pres_close_baza(){
 box.flag=true;
 baza_panel.flag = true;
 baza_close();
};
                             var toolbar_grid_baza = new AW.HTML.DIV;
                             toolbar_grid_baza.setContent("button1", function(){return bt_add_grid_baza});
                             toolbar_grid_baza.setContent("button2", function(){return bt_delete_grid_baza});
                             toolbar_grid_baza.setContent("button3", function(){return bt_edit_grid_baza});
                             toolbar_grid_baza.setContent("button7", function(){return bt_close_grid_baza});
                             grid_baza.defineTemplate("toolbar", toolbar_grid_baza);
                             grid_baza.setLayoutTemplate(new AW.Panels.Horizontal);

grid_baza.setPanelTemplate(function(i){
    switch(i){
       case "top":     return this.getToolbarTemplate();
       case "center":  return this.getScrollTemplate();
    };                    
 });

grid_baza.onPanelWidthChanged = function(width, panel){
   this.getLayoutTemplate().changePanelWidth(width, panel);
 };

grid_baza.onPanelHeightChanged = function(height, panel){
    this.getLayoutTemplate().changePanelHeight(height, panel);
 };
                             grid_baza.setPanelHeight(40, "top"); 

                             var GridBaza = new baza_obj(grid_baza); 
                             GridBaza.setStyle("visibility","hidden");
                             document.write(GridBaza);
    
//-----------------------------------------------------------------------------
//  
//-----------------------------------------------------------------------------