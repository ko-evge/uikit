//-----------------------------------------------------------------------------
//  HISTORY PANEL
//-----------------------------------------------------------------------------
function his_close() {
   GridHis.setStyle("visibility","hidden");
};
//-----------------------------------------------------------------------------
// clear grid                                   
//-----------------------------------------------------------------------------
function clear_grid_his( ) {
  /*
  grid_his.clearHeaderModel(); 
  grid_his.clearCellModel();
  grid_his.clearRowModel();
  grid_his.clearScrollModel();
  grid_his.clearSelectionModel();
  grid_his.clearSortModel();
  //grid_his.refresh(); 
  */
};
//-----------------------------------------------------------------------------
// open history                                    
//-----------------------------------------------------------------------------
function his_open( kdim, kd_im ) {
 //
 grid_his.kdim  = kdim;   
 grid_his.kd_im = kd_im;   
 grid_his.flag  = true;   
 
 grid_his.opr='history';
 Header  = ["Document", "Date","Operation", "Company", "Quantity", "Price"];
 ColSize = [100, 100, 300, 300, 100, 100 ];
 grid_his.adr     = {'kd_dk' : 0,'dt_dk' : 1,'prch' : 2,'kdps' : 3,'kol_op' : 4, 'sm_op': 5 };
 hformats = [cbox.str, cbox.dat, cbox.str, cbox.str, cbox.num, cbox.num];
  
 if ((kdim=="")) { 
  	 alert('NO SELECT ITEMS NAME'); 
     HisFon.setStyle("display", "none");  
     } 
 else {
    
 	clear_grid_his();
 	s_recordsh = pipe.event({action:'get_history', kod: 'operations', kdim: kd_im } ,true); 

    grid_his.setHeaderText(Header);
    grid_his.setColumnWidth(ColSize);
    grid_his.setColumnCount(Header.length);
  
    lb_his_title.setControlText("Item history: "+kdim);
    lb_his_title2.setControlText("Operations");

    grid_his.setCellText(s_recordsh);
    grid_his.setRowCount(s_recordsh.length);
    //grid_his.setCellFormat(hformats);

    grid_his.refresh();
    grid_his.element().focus(); 
    grid_his.selectCell(0,0);

    his_top_btopen();
    GridHis.setStyle("visibility","visible");
 };
}; 
//-----------------------------------------------------------------------------
// history botton open                                     
//-----------------------------------------------------------------------------
function his_top_btopen() {
    lf = 95;
	wh = 90;
	bt_close_grid_his.setStyle("display", "block"); 

    if (bt_hopr_grid_his.visible==true) {
   	    bt_hopr_grid_his.setStyle("display", "block"); 
        bt_hopr_grid_his.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_hopr_grid_his.setStyle("display", "none"); };    

    if (bt_hprc_grid_his.visible==true) {
    	bt_hprc_grid_his.setStyle("display", "block"); 
        bt_hprc_grid_his.setStyle("left",lf);
        lf = lf + wh;
        }    	
    else {bt_hprc_grid_his.setStyle("display", "none"); };    

    if (bt_hwar_grid_his.visible==true) {
        bt_hwar_grid_his.setStyle("display", "block"); 
        bt_hwar_grid_his.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_hwar_grid_his.setStyle("display", "none"); };    

    if (bt_hres_grid_his.visible==true) {
        bt_hres_grid_his.setStyle("display", "block"); 
        bt_hres_grid_his.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_hres_grid_his.setStyle("display", "none"); };    

    if (bt_hloc_grid_his.visible==true) {
        bt_hloc_grid_his.setStyle("display", "block"); 
        bt_hloc_grid_his.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_hloc_grid_his.setStyle("display", "none"); };    

    if (bt_hzak_grid_his.visible==true) {
        bt_hzak_grid_his.setStyle("display", "block"); 
        bt_hzak_grid_his.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_hzak_grid_his.setStyle("display", "none"); };    

};
//-----------------------------------------------------------------------------
// main block 
//-----------------------------------------------------------------------------
var s_recordsh = [];
cw =(window.innerWidth)?window.innerWidth:((document.all)?document.documentElement.offsetWidth:null);
ch =(window.innerHeight)?window.innerHeight:((document.all)?document.documentElement.offsetHeight:null);
lm = cw/4;
rp=(cw-lm)/2+lm+20;
Header =[];
//-----------------------------------------------------------------------------
                             var his_obj = AW.HTML.SPAN.subclass();  
                             his_obj.create = function(){  
                                  var obj = this.prototype;  
                                  var _super = this.superclass.prototype;  
      
                                  obj.init = function(argument){  
                                       _super.init.call(this);  
         
                                       obj.setStyle("position", "absolute"); 
                                       obj.setStyle("moz-user-focus","normal"); 
           
                                       obj.setStyle("background", "#bbbbbb"); 
                                       obj.setStyle("z-index", "14000"); 
    
                                       var workarea = new AW.HTML.DIV;  
                                       workarea.setContent("text", argument.toString());  
  
                                       obj.setContent("html",  workarea);         
                                  }  
                             }  

// grid =====================                            
                             var grid_his = new AW.UI.Grid;
                             grid_his.setId("grid_his");
                             grid_his.setCellText(s_recordsh);
                             grid_his.setHeaderText(Header);
                             grid_his.setHeaderHeight(30);
                             grid_his.setRowHeight(40);
                             grid_his.setColumnCount(6);
                             grid_his.setRowCount(15);
                             grid_his.setColumnWidth(500, 0);
                             grid_his.setCellEditable(false);

                             grid_his.getRowTemplate().setClass("text", "wrap");
                             grid_his.setCellTemplate(new AW.Templates.ImageText);

                             grid_his.setSize(cw-lm-65,ch-105);
                             grid_his.setPosition(lm,50);
  
                             grid_his.setSelectorVisible(true);
                             grid_his.setSelectorWidth(35);
                             grid_his.setSelectorText(function(i){return this.getRowPosition(i)+1});

                             // information
                             grid_his.kdim="";
                             grid_his.kd_im=0;
                             grid_his.flag  = true;   
                             
// label ====================                             
                             var lb_his_title = new AW.UI.Label;
                             lb_his_title.setId("lb_his_title");
                             lb_his_title.setControlText("Title: ");
                             lb_his_title.setStyle("font-size", "14pt");   
                             lb_his_title.setStyle("text-decoration", "underline");  
                             lb_his_title.setPosition(5,5);

                             var lb_his_title2 = new AW.UI.Label;
                             lb_his_title2.setId("lb_his_title2");
                             lb_his_title2.setControlText("");
                             lb_his_title2.setStyle("font-size", "14pt");   
                             lb_his_title2.setStyle("text-decoration", "underline");  
                             lb_his_title2.setPosition(5,35);
// close  ===================
                             var bt_close_grid_his = new AW.UI.Button;
                             bt_close_grid_his.setId("bt_close_grid_his");
                             bt_close_grid_his.setControlText("Close");
                             bt_close_grid_his.setStyle("left",5);
                             bt_close_grid_his.setStyle("top",60);
                             bt_close_grid_his.setStyle("width",90);
bt_close_grid_his.onClick = function(){
  his_close();	
};
// operatrion ===============
                             var bt_hopr_grid_his = new AW.UI.Button;
                             bt_hopr_grid_his.setId("bt_hopr_grid_war");
                             bt_hopr_grid_his.setControlText("Operations");
                             bt_hopr_grid_his.setStyle("left",5);
                             bt_hopr_grid_his.setStyle("top",60);
                             bt_hopr_grid_his.setStyle("width",90);
                             bt_hopr_grid_his.visible=true;
bt_hopr_grid_his.onClick = function(){
  // view operation
  if (grid_his.flag==true) {
     grid_his.flag=false;
     Header  = ["Document", "Date", "Operation", "Company", "Quantity", "Price"];
     ColSize = [100, 100, 300, 300, 100, 100 ];
     grid_his.adr     = {'kd_dk' : 0,'dt_dk' : 1,'prch' : 2,'kdps' : 3,'kol_op' : 4, 'sm_op': 5 };
     hformats = [cbox.str, cbox.dat, cbox.str, cbox.str, cbox.num, cbox.num];
  
     clear_grid_his();
     
     lb_his_title.setControlText("Item history: "+grid_his.kdim);
     lb_his_title2.setControlText("Operations");

     s_recordsh = pipe.event({action:'get_history', kod: 'operations', kdim: grid_his.kd_im } ,true); 

     grid_his.setHeaderData(Header);
     grid_his.setColumnWidth(ColSize);
     grid_his.setColumnCount(Header.length);
     
     grid_his.setCellText(s_recordsh);
     grid_his.setRowCount(s_recordsh.length);
     //grid_his.setCellFormat(hformats);
  
     grid_his.refresh();
     grid_his.element().focus(); 
     grid_his.selectCell(0,0);
     grid_his.flag=true;
  };   
};
// price ====================
                             var bt_hprc_grid_his = new AW.UI.Button;
                             bt_hprc_grid_his.setId("bt_hprc_grid_his");
                             bt_hprc_grid_his.setControlText("Price");
                             bt_hprc_grid_his.setStyle("left",5);
                             bt_hprc_grid_his.setStyle("top",60);
                             bt_hprc_grid_his.setStyle("width",90);
                             bt_hprc_grid_his.visible=true;
bt_hprc_grid_his.onClick = function(){
  if (grid_his.flag==true) {
     grid_his.flag=false;
  	 Header  = ["Price List","Company", "Date","Price", "Date Validity"];
     ColSize = [300,300, 100, 100, 100];
     grid_his.adr     = {'impr': 0 ,'kdps' : 1,'dt_prs' : 2,'sm_sp' : 3,'dt_gd' : 4};
     hformats = [cbox.str, cbox.str, cbox.dat, cbox.num, cbox.dat];
     
     clear_grid_his();
     lb_his_title.setControlText("Item history: "+grid_his.kdim);
     lb_his_title2.setControlText("Prices");
  
     s_recordsh = pipe.event({action:'get_history', kod: 'prices', kdim: grid_his.kd_im } ,true); 

     grid_his.setHeaderText(Header);
     grid_his.setColumnWidth(ColSize);
     grid_his.setColumnCount(Header.length);
     
     grid_his.setCellText(s_recordsh);
     grid_his.setRowCount(s_recordsh.length);
     //grid_his.setCellFormat(hformats);
  
     grid_his.refresh();
     grid_his.element().focus(); 
     grid_his.selectCell(0,0);
     grid_his.flag=true;
  };   
};
// warehouse ================ 
                             var bt_hwar_grid_his = new AW.UI.Button;
                             bt_hwar_grid_his.setId("bt_hwar_grid_his");
                             bt_hwar_grid_his.setControlText("Warehouse");
                             bt_hwar_grid_his.setStyle("left",5);
                             bt_hwar_grid_his.setStyle("top",60);
                             bt_hwar_grid_his.setStyle("width",90);
                             bt_hwar_grid_his.visible=true;
bt_hwar_grid_his.onClick = function(){
  if (grid_his.flag==true) {
     grid_his.flag=false;
     Header  = ["Warehouse", "Quantity", "Price", "Company"];
     ColSize = [300, 100, 100, 300];
     grid_his.adr     = {'nmsk' : 0,'kol_tk' : 1,'sm_tk' : 2,'kdps' : 3};
     hformats = [cbox.str, cbox.num, cbox.num, cbox.str];

     clear_grid_his();
     
     lb_his_title.setControlText("Item history: "+grid_his.kdim);
     lb_his_title2.setControlText("Warehouses");
  
     s_recordsh = pipe.event({action:'get_history', kod: 'warehouses', kdim: grid_his.kd_im } ,true); 

     grid_his.setHeaderText(Header);
     grid_his.setColumnWidth(ColSize);
     grid_his.setColumnCount(Header.length);
  
     grid_his.setCellText(s_recordsh);
     grid_his.setRowCount(s_recordsh.length);
     //grid_his.setCellFormat(hformats);

     grid_his.refresh();
     grid_his.element().focus(); 
     grid_his.selectCell(0,0);
     grid_his.flag=true;
  };   
};
// reservrd =================
                             var bt_hres_grid_his = new AW.UI.Button;
                             bt_hres_grid_his.setId("bt_hres_grid_his");
                             bt_hres_grid_his.setControlText("Reserved");
                             bt_hres_grid_his.setStyle("left",5);
                             bt_hres_grid_his.setStyle("top",60);
                             bt_hres_grid_his.setStyle("width",90);
                             bt_hres_grid_his.visible=true;
bt_hres_grid_his.onClick = function(){
  if (grid_his.flag==true) {
     grid_his.flag=false;
     Header  = ["Date", "Work Order","Warehouse", "Quantity","User"];
     ColSize = [100, 100, 300, 100,300];
     grid_his.adr     = {'dt_rs' : 0,'nm_zak' : 1,'nmsk' : 2,'kl_rs' : 3, 'impl': 4 };
     hformats = [cbox.dat, cbox.str, cbox.str, cbox.num, cbox.str];
     //grid_his.setCellFormat();
     
     clear_grid_his();
     lb_his_title.setControlText("Item history: "+grid_his.kdim);
     lb_his_title2.setControlText("Reserved");
  
     s_recordsh = pipe.event({action:'get_history', kod: 'reserved', kdim: grid_his.kd_im } ,true); 

     grid_his.setHeaderText(Header);
     grid_his.setColumnWidth(ColSize);
     grid_his.setColumnCount(Header.length);

     grid_his.setCellText(s_recordsh);
     grid_his.setRowCount(s_recordsh.length);
     //grid_his.setCellFormat(hformats);
 
     grid_his.refresh();
     grid_his.element().focus(); 
     grid_his.selectCell(0,0);
     grid_his.flag=true;
  };   
};
// location =================
                             var bt_hloc_grid_his = new AW.UI.Button;
                             bt_hloc_grid_his.setId("bt_hloc_grid_his");
                             bt_hloc_grid_his.setControlText("Location");
                             bt_hloc_grid_his.setStyle("left",5);
                             bt_hloc_grid_his.setStyle("top",60);
                             bt_hloc_grid_his.setStyle("width",90);
                             bt_hloc_grid_his.visible=true;
bt_hloc_grid_his.onClick = function(){
  if (grid_his.flag==true) {
     grid_his.flag=false;
     Header  = ["Warehouse", "Code","Location", "Quantity"];
     ColSize = [300, 100, 100, 100];
     grid_his.adr     = {'nmsk' : 0, 'kd_st': 1,'kd_lc' : 2, 'kol_lc': 3};
     hformats = [cbox.str, cbox.str, cbox.str, cbox.num];

     lb_his_title.setControlText("Item history: "+grid_his.kdim);
     lb_his_title2.setControlText("Locations");
  
     s_recordsh = pipe.event({action:'get_history', kod: 'locations', kdim: grid_his.kd_im } ,true); 
   
     grid_his.setHeaderData(Header);
     grid_his.setColumnWidth(ColSize);
     grid_his.setColumnCount(Header.length);

     grid_his.setCellText(s_recordsh);
     grid_his.setRowCount(s_recordsh.length);
     //grid_his.setCellFormat(hformats);

     grid_his.refresh();
     grid_his.element().focus(); 
     grid_his.selectCell(0,0);
     grid_his.flag=true;
  };   
};

// orders =================
                             var bt_hzak_grid_his = new AW.UI.Button;
                             bt_hzak_grid_his.setId("bt_hzak_grid_his");
                             bt_hzak_grid_his.setControlText("Orders");
                             bt_hzak_grid_his.setStyle("left",5);
                             bt_hzak_grid_his.setStyle("top",60);
                             bt_hzak_grid_his.setStyle("width",90);
                             bt_hzak_grid_his.visible=true;
bt_hzak_grid_his.onClick = function(){
  if (grid_his.flag==true) {
     grid_his.flag=false;
     grid_his.Header  = ["Order", "Date", "Company", "Code", "Quantity"];
     grid_his.ColSize = [100, 100, 300, 100, 100 ];
     grid_his.adr     = {'nmzak' : 0,'dt_zk' : 1, 'kdps': 2, 'kd_st': 3, 'kl_zk': 4};
     hformats = [cbox.str, cbox.dat, cbox.str, cbox.str, cbox.num];


     lb_his_title.setControlText("Item history: "+grid_his.kdim);
     lb_his_title2.setControlText("Orders");
  
     s_recordsh = pipe.event({action:'get_history', kod: 'orders', kdim: grid_his.kd_im } ,true); 

     grid_his.setHeaderText(grid_his.Header);
     grid_his.setColumnWidth(grid_his.ColSize);
     grid_his.setColumnCount(5);

     grid_his.setCellText(s_recordsh);
     grid_his.setRowCount(s_recordsh.length);
  
     grid_his.refresh();
     grid_his.element().focus(); 
     grid_his.selectCell(0,0);
     grid_his.flag=true;
  };   
};
//=================================================================================================
//  botton panel                                  
//=================================================================================================
                             var toolbar1_grid_his = new AW.HTML.DIV;
                             toolbar1_grid_his.setContent("label1", function(){return lb_his_title});
                             toolbar1_grid_his.setContent("label2", function(){return lb_his_title2});
                             toolbar1_grid_his.setContent("button1", function(){return bt_close_grid_his});
                             toolbar1_grid_his.setContent("button2", function(){return bt_hopr_grid_his});
                             toolbar1_grid_his.setContent("button3", function(){return bt_hprc_grid_his});
                             toolbar1_grid_his.setContent("button4", function(){return bt_hwar_grid_his});
                             toolbar1_grid_his.setContent("button5", function(){return bt_hres_grid_his});
                             toolbar1_grid_his.setContent("button6", function(){return bt_hloc_grid_his});
                             toolbar1_grid_his.setContent("button7", function(){return bt_hzak_grid_his});

                             var toolbar2_grid_his = new AW.HTML.DIV;

                             grid_his.defineTemplate("toolbar1", toolbar1_grid_his);
                             grid_his.defineTemplate("toolbar2", toolbar2_grid_his);
                             grid_his.setLayoutTemplate(new AW.Panels.Horizontal);

                             grid_his.setPanelTemplate(function(i){
                                  switch(i){
                                     case "top":     return this.getToolbar1Template();
                                     case "center":  return this.getScrollTemplate();
                                     case "bottom":  return this.getToolbar2Template();
                                  };                    
                            });

                            grid_his.onPanelWidthChanged = function(width, panel){
                                 this.getLayoutTemplate().changePanelWidth(width, panel);
                            };
                            grid_his.onPanelHeightChanged = function(height, panel){
                                 this.getLayoutTemplate().changePanelHeight(height, panel);
                            };

                            grid_his.setPanelHeight(90, "top"); 
                            grid_his.setPanelHeight(5, "bottom"); 


                             var GridHis = new his_obj(grid_his); 
                             GridHis.setStyle("visibility","hidden");
                             document.write(GridHis);
//=================================================================================================
//  fon panel                                  
//=================================================================================================
                            var his_fon = new AW.UI.Group;
                            his_fon.setId("his_fon");
                            his_fon.setSize((cw-lm)/2,ch-125);
                            his_fon.setPosition(lm+5,50+10);
                            his_fon.setStyle("background", "#eee");
                            his_fon.setStyle("filter","alpha(opacity=60)");
                            his_fon.setStyle("opacity","0.6");
                            var HisFon = new his_obj(his_fon); 
                            HisFon.setStyle("display", "none") ;    
                            document.write(HisFon); 
//------------------------------------------------------------------------------------------------
//  
//------------------------------------------------------------------------------------------------