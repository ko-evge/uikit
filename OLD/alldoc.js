//=================================================================================================
// ALL DOCUMENTS 
//=================================================================================================
function alldoc_close() {
   GridAlldoc.setStyle("visibility","hidden"); 
   wmain_open();
}
//=================================================================================================
//  button visible                                  
//=================================================================================================
function alldoc_btopen() {
   bt_close_grid_alldoc.setStyle("display", "block"); 

   if (bt_delete_grid_alldoc.visible==true) {bt_delete_grid_alldoc.setStyle("display", "block"); }
   else {bt_delete_grid_alldoc.setStyle("display", "none"); }

   if (bt_select_grid_alldoc.visible==true) {bt_select_grid_alldoc.setStyle("display", "block"); }
   else {bt_select_grid_alldoc.setStyle("display", "none"); }

   if (bt_filter_grid_alldoc.visible==true) {bt_filter_grid_alldoc.setStyle("display", "block"); }
   else {bt_filter_grid_alldoc.setStyle("display", "none"); }

   if (bt_add_grid_alldoc.visible==true) {bt_add_grid_alldoc.setStyle("display", "block"); }
   else {bt_add_grid_alldoc.setStyle("display", "none"); }

   if (bt_print_grid_alldoc.visible==true) {bt_print_grid_alldoc.setStyle("display", "block"); }
   else {bt_print_grid_alldoc.setStyle("display", "none"); }

   grid_alldoc.flag = true;
}
//=================================================================================================
//  button unvisible                                  
//=================================================================================================
function alldoc_btclose() {
   bt_close_grid_alldoc.setStyle("display", "none"); 
   bt_delete_grid_alldoc.setStyle("display", "none");     
   bt_select_grid_alldoc.setStyle("display", "none");     
   bt_filter_grid_alldoc.setStyle("display", "none"); 
   bt_add_grid_alldoc.setStyle("display", "none");     
   bt_print_grid_alldoc.setStyle("display", "none");     
}
//=================================================================================================
//  form visible                                  
//=================================================================================================
function alldoc_open() {
   GridAlldoc.setStyle("visibility","visible");  
   alldoc_btopen();

   // read all documents
   ar_records_alldoc = pipe.event({action:'get_alldoc', kdus: cbox.kdus },true);
   grid_alldoc.setCellText(ar_records_alldoc);
   grid_alldoc.setRowCount(ar_records_alldoc.length);
   grid_alldoc.count = ar_records_alldoc.length;

   // form visible
   grid_alldoc.flag = true;
   grid_alldoc.filter = false;
   grid_alldoc.colf   =0;
   grid_alldoc.adr    = {};
   grid_alldoc.adr = {'kd_dk'  : 0, 'dt_dk' : 1, 'prch' : 2, 'nm_zak' : 3, 'kdps' : 4, 'nmsk' : 5,
                      'nmka' : 6,'ousk'   : 7, 'kdkl'  : 8, 'text' : 9, 'nm_zp'  : 11, 'color' : 12,
                      'kd_op' : 13, 'pr_prd' : 14, 'pr_ch' : 15, 'kd_ps': 16, 'nm_sk': 17  };
   
   // mark document
   var i;
   for (i = 0; i < grid_alldoc.getRowCount(); i = i + 1) {
      cellColor = grid_alldoc.getCellText(grid_alldoc.adr['color'], i);
      grid_alldoc.getCellTemplate(0, i).setStyle("background", cellColor)
   }
   grid_alldoc.element().focus(); 
   grid_alldoc.selectCell(2,0);
   grid_alldoc.refresh();
} 
//=================================================================================================
//  main block
//=================================================================================================
var HeaderAlldoc = ["Number", "Data", "Operation", "Order", "Company", "Warehause", "Bank", "Warehouse(out)","Contact","Comment"];

cw =(window.innerWidth)?window.innerWidth:((document.all)?document.documentElement.offsetWidth:null);
ch =(window.innerHeight)?window.innerHeight:((document.all)?document.documentElement.offsetHeight:null);

                             var alldoc_obj = AW.HTML.SPAN.subclass();  
                             alldoc_obj.create = function(){  
                                  var obj = this.prototype;  
                                  var _super = this.superclass.prototype;  
      
                                  obj.init = function(argument){  
                                       _super.init.call(this);  
         
                                       obj.setStyle("position", "absolute"); 
                                       obj.setStyle("moz-user-focus","normal"); 
           
                                       obj.setStyle("background", "#bbbbbb"); 
                                       obj.setStyle("z-index", "10"); 
                                      
                                       
                                       var workarea = new AW.HTML.DIV;  
                                       workarea.setContent("text", argument.toString());  
                                       
  
                                       obj.setContent("html",  workarea);         
                                  }  
                             };
// ================================================================================================
                             var grid_alldoc = new AW.UI.Grid;
                             grid_alldoc.setId("grid_alldoc");
                             grid_alldoc.setHeaderText(HeaderAlldoc);
                             grid_alldoc.setHeaderHeight(30);
                             grid_alldoc.setRowHeight(26);
                             grid_alldoc.setColumnCount(10);
                             grid_alldoc.setRowCount(25);
                             grid_alldoc.setRowHeight(40);
                             grid_alldoc.setSize(cw-75,ch-105);
                             grid_alldoc.setPosition(10,50);
                             grid_alldoc.getRowTemplate().setClass("text", "wrap");
                             grid_alldoc.setCellTemplate(new AW.Templates.ImageText);
                             grid_alldoc.setSelectorVisible(true);
                             grid_alldoc.setSelectorWidth(35);
                             grid_alldoc.setSelectorText(function(i){return this.getRowPosition(i)+1});
    
grid_alldoc.flag = true;
grid_alldoc.getSeparatorTemplate().setEvent("ondblclick", function(event){
        this.raiseEvent("onSeparatorDoubleClicked", event, this.$0);
 });

grid_alldoc.onSeparatorDoubleClicked = function(event, column){
        
 };
                             var grid_alldoc_lb1 = new AW.UI.Label;
                             grid_alldoc_lb1.setId("grid_alldoc_lb1");
                             grid_alldoc_lb1.setControlText("All Documents");
                             // filter text
                             var grid_alldoc_lbf = new AW.UI.Label;
                             grid_alldoc_lbf.setId("grid_alldoc_lbf");
                             grid_alldoc_lbf.setControlText("Filter ");
                             grid_alldoc_lbf.setStyle("display", "none"); 
 
// delete document=================================================================================
                             var bt_delete_grid_alldoc = new AW.UI.Button;
                             bt_delete_grid_alldoc.setId("bt_delete_grid_alldoc");
                             bt_delete_grid_alldoc.setControlText("Delete");
                             bt_delete_grid_alldoc.visible=true;
bt_delete_grid_alldoc.onClick = function pres_delete_alldoc () {
  if (grid_alldoc.flag) {
     grid_alldoc.flag = false;
     var rowt = grid_alldoc.getCurrentRow();
     var nmzp = grid_alldoc.getCellValue(grid_alldoc.adr['nm_zp'], rowt);
     //
     textf =HeaderAlldoc[0]+':'+grid_alldoc.getCellValue(0,rowt)+' '+ 
            HeaderAlldoc[1]+':'+grid_alldoc.getCellValue(1,rowt)+' '+
            HeaderAlldoc[2]+':'+grid_alldoc.getCellValue(2,rowt);
     mes_open(textf,'Delete Document?','deldoc',{nrecord: nmzp}); 
     grid_alldoc.flag = true;
  }
};
 
// open document ==================================================================================
                             var bt_select_grid_alldoc = new AW.UI.Button;
                             bt_select_grid_alldoc.setId("bt_select_grid_alldoc");
                             bt_select_grid_alldoc.setControlText("Open");
                             bt_select_grid_alldoc.visible=true;

bt_select_grid_alldoc.onClick = function pres_select_alldoc(){
  if (grid_alldoc.flag) {
     grid_alldoc.flag = false;
     doc_open();
  }
  grid_alldoc.flag = true;
};

// filter =========================================================================================
                             var bt_filter_grid_alldoc = new AW.UI.Button;
                             bt_filter_grid_alldoc.setId("bt_filter_grid_alldoc");
                             bt_filter_grid_alldoc.setControlText("Filter");
                             bt_filter_grid_alldoc.visible=true;

bt_filter_grid_alldoc.onClick = function pres_filter_alldoc(){
  if (grid_alldoc.flag) {
     grid_alldoc.flag = false;
     if (grid_alldoc.filter==true) {
        filterGrid(grid_alldoc,'',grid_alldoc.colf,grid_alldoc.count);
        grid_alldoc.filter=false;
        grid_alldoc_lbf.setControlText("Filter");
        grid_alldoc_lbf.setStyle("display", "none");
         }
     else {
        grid_alldoc.filter=true;
        var col = grid_alldoc.getCurrentColumn();
        var row = grid_alldoc.getCurrentRow();
        grid_alldoc.colf = col;
        var cell_val = grid_alldoc.getCellText(col,row);
        var head_val = HeaderAlldoc[col];
        var textf = "Filter: " + head_val +" - "+ cell_val;
        grid_alldoc_lbf.setControlText(textf);
        grid_alldoc_lbf.setStyle("display", "block"); 
 
        filterGrid(grid_alldoc,cell_val,col,grid_alldoc.count);
     }
     grid_alldoc.flag = true;
  }
};

// new document ===================================================================================
                             var bt_add_grid_alldoc = new AW.UI.Button;
                             bt_add_grid_alldoc.setId("bt_add_grid_alldoc");
                             bt_add_grid_alldoc.setControlText("Add");
                             bt_add_grid_alldoc.visible=true;

bt_add_grid_alldoc.onClick = function pres_add_alldoc(){
  if (grid_alldoc.flag) {
     grid_alldoc.flag = false;
     alldoc_btclose(); 
     input_open('New Document',0);
     grid_alldoc.flag = true;
  }
};
// print all document ===================================================================================
                             var bt_print_grid_alldoc = new AW.UI.Button;
                             bt_print_grid_alldoc.setId("bt_print_grid_alldoc");
                             bt_print_grid_alldoc.setControlText("Print");
                             bt_print_grid_alldoc.visible=true;

bt_print_grid_alldoc.onClick = function pres_print_alldoc(){
  if (grid_alldoc.flag) {
     grid_alldoc.flag = false;

     pipe.event({action:'print_alldoc'},true);
     
     grid_alldoc.flag = true;
  }
};

// close window ===================================================================================
                             var bt_close_grid_alldoc = new AW.UI.Button;
                             bt_close_grid_alldoc.setId("bt_close_grid_alldoc");
                             bt_close_grid_alldoc.setControlText("Close");
 bt_close_grid_alldoc.onClick = function pres_close_alldoc(){
 grid_alldoc.flag = true;
 alldoc_close();
 wmain_open();
};

// page up ========================================================================================
                              var bt_page_up_grid_alldoc = new AW.UI.Button;
                              bt_page_up_grid_alldoc.setId("bt_page_up_grid_alldoc");
                              bt_page_up_grid_alldoc.setControlText("Page Up");
bt_page_up_grid_alldoc.onClick = function pres_page_up_alldoc() {

};

// page down ======================================================================================        
                              var bt_page_dn_grid_alldoc = new AW.UI.Button;
                              bt_page_dn_grid_alldoc.setId("bt_page_dn_grid_alldoc");
                              bt_page_dn_grid_alldoc.setControlText("Page Dn");
bt_page_dn_grid_alldoc.onClick = function pres_page_dn_alldoc(){
              
};
// declare table ==================================================================================
                             var toolbar_grid_alldoc = new AW.HTML.DIV;
                             toolbar_grid_alldoc.setContent("lb1", function(){return grid_alldoc_lb1});
                             toolbar_grid_alldoc.setContent("lbf", function(){return grid_alldoc_lbf});
                             toolbar_grid_alldoc.setContent("button1", function(){return bt_add_grid_alldoc});
                             toolbar_grid_alldoc.setContent("button2", function(){return bt_delete_grid_alldoc});
                             toolbar_grid_alldoc.setContent("button3", function(){return bt_select_grid_alldoc});
                             toolbar_grid_alldoc.setContent("button4", function(){return bt_filter_grid_alldoc});
                             toolbar_grid_alldoc.setContent("button7", function(){return bt_close_grid_alldoc});
                             toolbar_grid_alldoc.setContent("button8", function(){return bt_print_grid_alldoc});
                             // toolbar_grid_alldoc.setContent("button5", function(){return bt_page_up_grid_alldoc});
                             // toolbar_grid_alldoc.setContent("button6", function(){return bt_page_dn_grid_alldoc});
                             grid_alldoc.defineTemplate("toolbar", toolbar_grid_alldoc);
                             grid_alldoc.setLayoutTemplate(new AW.Panels.Horizontal);

grid_alldoc.setPanelTemplate(function(i){
    switch(i){
       case "top":     return this.getToolbarTemplate();
       case "center":  return this.getScrollTemplate();
    }
 });

grid_alldoc.onPanelWidthChanged = function(width, panel){
   this.getLayoutTemplate().changePanelWidth(width, panel);
 };

grid_alldoc.onPanelHeightChanged = function(height, panel){
    this.getLayoutTemplate().changePanelHeight(height, panel);
 };
                             grid_alldoc.setPanelHeight(80, "top"); 

                             var GridAlldoc = new alldoc_obj(grid_alldoc); 
                             GridAlldoc.setStyle("visibility","hidden");
                             document.write(GridAlldoc);
    
//=================================================================================================
//  
//=================================================================================================
