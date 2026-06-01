//=================================================================================================
//  SEARCH PANEL
//=================================================================================================
function search_close() {
   //SearchPanel.setStyle("display", "none");  
   GridSearch.setStyle("visibility","hidden");
   //LbSearchC.setStyle("display", "none");    
   grid_input.raiseEvent("editCurrentCell", {}, grid_search.col,  grid_search.row);
}
//=================================================================================================
//                                    
//=================================================================================================
function search_open(text, spr, callback, col_in, row_in, u_records, cw, ch) {

                             //SearchPanel.setStyle("display", "block");  
                             //LbSearchC.setStyle("display", "block");    

grid_search.setPosition(cw,ch);
GridSearch.setStyle("visibility","visible");

 if (spr ==("sprchk")) {
     lb_search_c.setControlText("Select Operation");
     bt_search_add.setStyle("visibility","hidden");
 };
 if (spr ==("sprps")) {
    lb_search_c.setControlText("Select Company");
    bt_search_add.setStyle("visibility","hidden");
 };
 if (spr ==("sprsk")) {
    lb_search_c.setControlText("Select Warehouse");
    bt_search_add.setStyle("visibility","hidden");
 };
 if (spr ==("sprkl")) {
    lb_search_c.setControlText("Select People");
    bt_search_add.setStyle("visibility","hidden");
 };
 if (spr ==("sprka")) {
    lb_search_c.setControlText("Select Account");
    bt_search_add.setStyle("visibility","hidden");
 };
 if (spr ==("spropl")) {
    lb_search_c.setControlText("Select Payment");
    bt_search_add.setStyle("visibility","hidden");
 };
 grid_search.callback = callback;
 grid_search.col  = col_in;   
 grid_search.row  = row_in;   
 grid_search.spr  = spr;
 grid_search.urecords = u_records;
 // не справочник
 if (u_records.length>0) {
    s_records = u_records;
    lb_search_c.setControlText("Select Value");
    bt_search_add.setStyle("visibility","hidden");
    }
 else {
    s_records = pipe.event({action:'seek_spr',dir: spr, seek: text} ,true);
 };
 grid_search.setCellText(s_records);
 grid_search.setRowCount(s_records.length);

 grid_search.refresh();
 grid_search.element().focus(); 
 grid_search.selectCell(0,0);
 grid_search.raiseEvent("editCurrentCell",{});

}; 
//-----------------------------------------------------------------------------
//  select
//-----------------------------------------------------------------------------
function select_val(index) {
   kod_opr   = grid_search.getCellValue(1, index);   
   name_opr  = grid_search.getCellValue(0, index);   
   grid_input.setCellText(name_opr,grid_search.col,grid_search.row);
   grid_input.setCellText(kod_opr,grid_search.col+3,grid_search.row);

   key = grid_input.getCellText(grid_search.col+1,grid_search.row);
   grid_input.recordset[key] = kod_opr;

   if (grid_search.spr=='sprchk'){
       var sprchk = [];
       sprchk = pipe.event({action:'sprchk',prch: kod_opr} ,true);
       grid_input.recordset[key] = kod_opr;
       grid_input.recordset['kd_op']  = sprchk['tp_opr'];
       grid_input.recordset['pr_prd'] = sprchk['pr_prd'];
       grid_input.recordset['pr_prz'] = sprchk['pr_prz'];
       grid_input.recordset['st_dk']  = "1";
       grid_input.recordset['pr_us']  = ac_input1.kodp;
       
       arnewdoc =[];
       arnewdoc = pipe.event({action: 'get_ar_newdoc',tpop: sprchk['tp_opr'], kdop: kod_opr, imop: name_opr},true);
       grid_input.setcelltext(arnewdoc);
       grid_input.setrowcount(arnewdoc.length);
       grid_input.refresh();
       if (sprchk['nm_dok']>0) {
          teknom = sprchk['nm_dok'] + 1;
          grid_input.setCellText(teknom,grid_search.col,grid_search.row+1);
       };
    };
};
//=================================================================================================
//  
//=================================================================================================

cw =(window.innerWidth)?window.innerWidth:((document.all)?document.documentElement.offsetWidth:null);
ch =(window.innerHeight)?window.innerHeight:((document.all)?document.documentElement.offsetHeight:null);
var s_records = [];
                             var search_obj = AW.HTML.SPAN.subclass();  
                             search_obj.create = function(){  
                                  var obj = this.prototype;  
                                  var _super = this.superclass.prototype;  
      
                                  obj.init = function(argument){  
                                       _super.init.call(this);  
         
                                       obj.setStyle("position", "absolute"); 
                                       obj.setStyle("moz-user-focus","normal"); 
           
                                       obj.setStyle("background", "#bbbbbb"); 
                                       obj.setStyle("z-index", "11000"); 
    
                                       var workarea = new AW.HTML.DIV;  
                                       workarea.setContent("text", argument.toString());  
  
                                       obj.setContent("html",  workarea);         
                                  }  
                             }  

                             var search_panel = new AW.UI.Group;
                             search_panel.setId("search_panel");
                             var SearchPanel = new search_obj(search_panel); 
                             SearchPanel.setStyle("display", "none") ;    
                             document.write(SearchPanel); 

                             var lb_search_c = new AW.UI.Label;
                             lb_search_c.setId("lb_search_c");
                             lb_search_c.setControlText("Search");
                             lb_search_c.setStyle("font-size", "10pt");   
                             lb_search_c.setStyle("text-decoration", "underline");   
                             var LbSearchC = new search_obj(lb_search_c); 
                             LbSearchC.setStyle("display", "none") ;    
                             document.write(LbSearchC); 

                             var SearchHeader = ["NAME"];

                             var grid_search = new AW.UI.Grid;
                             grid_search.setId("grid_search");
                             grid_search.setCellText(s_records);
                             grid_search.setHeaderText(SearchHeader);
                             grid_search.setHeaderHeight(30);
                             grid_search.setRowHeight(26);
                             grid_search.setColumnCount(1);
                             grid_search.setRowCount(15);
                             grid_search.setColumnWidth(330, 0);
                             grid_search.setCellEditable(true,0);  
                             grid_search.setSize(350,ch-240); 
                             grid_search.setSelectorVisible(false);
                             grid_search.setSelectorWidth(35);
                             //grid_search.setSelectorText(function(i){return this.getRowPosition(i)+1});

grid_search.onRowClicked = function(event, rowIndex){
    // выбор в таблице
    select_val(rowIndex);
    search_close();
};
    
                             var lb_search = new AW.UI.Label;
                             lb_search.setId("lb_search");
                             lb_search.setControlText("Search: ");
    
                             var bt_search_select = new AW.UI.Button;
                             bt_search_select.setId("bt_search_select");
                             bt_search_select.setControlText("Select");
    
bt_search_select.onClick = function(){
   // выбор кнопкой
   index = grid_search.getCurrentRow();  
   select_val(index);
   search_close();
};
grid_search.onCellValidated = function(text, col, row){

  if (grid_search.urecords.length>0) {
     return false;
  };
  spr = grid_search.spr;
  var s_records =[];
  grid_search.setCellText(s_records);
  grid_search.setRowCount(0);
  grid_search.refresh();
  grid_search.element().focus(); 

  s_records = pipe.event({action:'seek_spr',dir: spr, seek: text} ,true);
  grid_search.setCellText(s_records);
  grid_search.setRowCount(s_records.length);
  grid_search.refresh();
  grid_search.element().focus(); 
  grid_search.selectCell(0,0);
  grid_search.setTimeout(function(){
     grid_search.raiseEvent("editCurrentCell", {}, col, row);
  });
  return false;
};
grid_search.onCellSelectedChanged = function(selected, col, row){
    if (selected){
        this.setTimeout(function(){
            this.raiseEvent("editCurrentCell", {}, col, row);
        });
    };
};              
                             var bt_search_add = new AW.UI.Button;
                             bt_search_add.setId("bt_search_add");
                             bt_search_add.setControlText("Add");

bt_search_add.onClick = function(){
   search_close();
};

                             var bt_search_cancel = new AW.UI.Button;
                             bt_search_cancel.setId("bt_search_cancel");
                             bt_search_cancel.setControlText("Cancel");

bt_search_cancel.onClick = function(){
  search_close();
};
                            var toolbar_grid_search = new AW.HTML.DIV;
                            
                            toolbar_grid_search.setContent("sc_button1", function(){return bt_search_select});
                            bt_search_select.setStyle("left",10);
                            bt_search_select.setStyle("top",8);
                            bt_search_select.setStyle("width",80);
    
                            toolbar_grid_search.setContent("sc_button2", function(){return bt_search_add});
                            bt_search_add.setStyle("left",460);
                            bt_search_add.setStyle("top",8);
                            bt_search_add.setStyle("width",80);
    
                            toolbar_grid_search.setContent("sc_button3", function(){return bt_search_cancel});
                            bt_search_cancel.setStyle("left",100);
                            bt_search_cancel.setStyle("top",8);
                            bt_search_cancel.setStyle("width",80);
    
                            grid_search.defineTemplate("toolbar", toolbar_grid_search);
                            grid_search.setLayoutTemplate(new AW.Panels.Horizontal);
                            grid_search.setPanelTemplate(function(i){
                                 switch(i){
                                 case "center": return this.getScrollTemplate();
                                 case "top": return this.getToolbarTemplate();
                                 };
                            });

                            grid_search.onPanelWidthChanged = function(width, panel){
                                 this.getLayoutTemplate().changePanelWidth(width, panel);
                            };
                            grid_search.onPanelHeightChanged = function(height, panel){
                                 this.getLayoutTemplate().changePanelHeight(height, panel);
                            };

                            grid_search.setPanelHeight(40, "top"); 

                            var GridSearch = new search_obj(grid_search); 
                            GridSearch.setStyle("visibility","hidden");
                            document.write(GridSearch);
//-----------------------------------------------------------------------------
//  
//-----------------------------------------------------------------------------