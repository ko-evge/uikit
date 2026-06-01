//=================================================================================================
// Documents
//=================================================================================================
function doc_close() {
   DocPanel.setStyle("display", "none");  
   DocFon.setStyle  ("display", "none");  
   DocFon2.setStyle ("display", "none");  
   GridDoc.setStyle ("visibility","hidden");
   GridDoc2.setStyle("visibility","hidden");
   alldoc_btopen(); 
}
//=================================================================================================
// open document                      
//=================================================================================================
function doc_open() {
   DocPanel.setStyle("display", "block");  
   GridDoc.setStyle("visibility","visible");  
   doc_top_btopen();
   doc_bot_btopen();
   doc2_top_btopen();
   // =============================================================================================
    var inn = grid_alldoc.getCurrentRow();
   doc_panel.kdop  = grid_alldoc.getCellValue(grid_alldoc.adr['kd_op'], inn);                             
   doc_panel.nmzp  = grid_alldoc.getCellValue(grid_alldoc.adr['nm_zp'], inn);                       
   
   doc_panel.HeaderDoc  = [];
   doc_panel.ColSize    = [];
   doc_panel.HeaderDoc2 = [];
   doc_panel.ColSize2   = [];
   doc_panel.adr   = {};
   doc_panel.adr2 = {};
   
   // doc_panel.kdop="1";
   doc_lb_from.setControlText ("");  
   doc_lb_to.setControlText   ("");    

   if (doc_panel.kdop=="1") {
       // receiving
       doc_panel.HeaderDoc = ["Item", "Code", "Quantity", "Price", "Cost", "Work Order", "Unit", "Weight"];
       doc_panel.ColSize   = [400, 100, 100, 100, 100, 100, 100, 100];
       doc_panel.adr = {'kdim' : 0,'kd_st' : 1,'kol_op' : 2,'sm_op1' : 3,'sm_op' : 4,'nm_zak' : 5,'ed_iz' : 6 ,'bs_iz' : 7,
                        'nm_zp': 11,'nm_zpo': 12, 'nm_zps': 13, 'st_dk' : 14, 'kd_im' : 15   }
       
       formats = [cbox.str, cbox.str, cbox.num, cbox.num, cbox.num, cbox.str, cbox.str, cbox.num];
       doc_lb_from.setControlText(grid_alldoc.getCellValue(grid_alldoc.adr['kdps'], inn));
       doc_lb_to.setControlText(grid_alldoc.getCellValue(grid_alldoc.adr['nmsk'], inn));
   }
   if (doc_panel.kdop=="2") {
       // shipping
       doc_panel.HeaderDoc = ["Item", "Code", "Quantity", "Price", "Work Order", "Unit", "Weight"];
       doc_panel.ColSize   = [400, 100, 100, 100, 100, 100, 100, 100];
       doc_panel.adr = {'kdim' : 0,'kd_st' : 1,'kol_op' : 2,'sm_op' : 3,'nm_zak' : 4,'ed_iz' : 5 ,'bs_iz' : 6,
                        'nm_zp': 11,'nm_zpo': 12, 'nm_zps': 13, 'st_dk' : 14, 'kd_im' : 15   };
       
       formats = [cbox.str, cbox.str, cbox.num, cbox.num, cbox.str, cbox.str, cbox.str];
       grid_doc.getCellTemplate(2).setStyle("text-align","right");
       grid_doc.getCellTemplate(3).setStyle("text-align","right");
       grid_doc.getCellTemplate(4).setStyle("text-align","right");
       doc_lb_from.setControlText (grid_alldoc.getCellValue(grid_alldoc.adr['nmsk'], inn));      
       if (grid_alldoc.getCellValue(grid_alldoc.adr['ousk'], inn)>"") {                            
          doc_lb_to.setControlText   (grid_alldoc.getCellValue(grid_alldoc.adr['ousk'], inn));   
          }
       else { doc_lb_to.setControlText   (grid_alldoc.getCellValue(grid_alldoc.adr['kdps'], inn));   }
   }
    var formats;
    if (doc_panel.kdop == "3") {
        // bank
        doc_panel.HeaderDoc = ["Operation", "Debit", "Credit", "Document", "Date", "Person", "Company", "Work Order"];
        doc_panel.ColSize = [400, 100, 100, 100, 100, 100, 100, 100];
        doc_panel.adr = {'ksop': 0, 'sm_op': 1, 'sm_op1': 2, 'kd_dkk': 3, 'dt_dkk': 4, 'kdkl': 5,
            'kdps': 6, 'nm_zak': 7, 'nm_zp': 11, 'nm_zpo': 12, 'nm_zps': 13, 'st_dk': 14 };
        formats = [cbox.str, cbox.cur, cbox.cur, cbox.str, cbox.dat, cbox.str, cbox.str, cbox.str];
        doc_lb_from.setControlText(grid_alldoc.getCellValue(grid_alldoc.adr['nmka'], inn));
    }
   if (doc_panel.kdop=="4") {
       // order
       doc_panel.HeaderDoc = ["Service", "Quantity", "Price", "Total", "Document","Date", "Person","Company","Work Order"];
       doc_panel.ColSize   = [400, 100, 100, 100, 100, 100, 100, 100, 100];
       doc_panel.adr = {'ksop' : 0, 'kol_op' : 1, 'sm_op' : 2,'sm_op1' : 3,'kd_dkk' : 4,'dt_dkk' : 5,'kdkl' : 6 ,
                        'kdps' : 7 ,'nm_zak' : 8, 'nm_zp': 11,'nm_zpo': 12, 'nm_zps': 13, 'st_dk' : 14 };
       formats = [cbox.str, cbox.num, cbox.num, cbox.num, cbox.str, cbox.dat, cbox.str, cbox.str, cbox.str];
       doc_lb_from.setControlText (grid_alldoc.getCellValue(grid_alldoc.adr['kdps'], inn));      
   }
   if (doc_panel.kdop=="5") {
       // sale
       doc_panel.HeaderDoc = ["Item", "Code", "Quantity", "Price", "Work Order"];
       doc_panel.ColSize   = [400, 100, 100, 100, 100, 100];
       doc_panel.adr = {'kdim' : 0, 'kd_st' : 1, 'kol_op' : 2,'sm_op' : 3,'nm_zak' : 4,'ed_iz' : 5,'bs_iz' : 6 ,
                        'nm_zp': 11,'nm_zpo': 12, 'nm_zps': 13, 'st_dk' : 14 , 'kd_im' : 15 };
       doc_lb_from.setControlText (grid_alldoc.getCellValue(grid_alldoc.adr['nmsk'], inn));      
       doc_lb_to.setControlText   (grid_alldoc.getCellValue(grid_alldoc.adr['kdps'], inn));      
       formats = [cbox.str, cbox.str, cbox.num, cbox.num, cbox.str];
   }
   if (doc_panel.kdop=="7") {
       // manufacture
       doc_panel.HeaderDoc = ["Type", "Item", "Code", "Quantity", "Price", "Work Order", "Company"];
       doc_panel.ColSize   = [100, 400, 100, 100, 100, 100, 100];
       doc_panel.adr = {'pr_op' : 0, 'kdim' : 1, 'kd_st' : 2, 'kol_op' : 3,'sm_op' : 4,'nm_zak' : 5,'kdps' : 6, 'ed_iz' : 7,
                        'bs_iz' : 8 , 'nm_zp': 11,'nm_zpo': 12, 'nm_zps': 13, 'st_dk' : 14 , 'kd_im' : 15 };
       formats = [cbox.cur, cbox.str, cbox.str, cbox.num, cbox.num, cbox.str, cbox.str];
       doc_lb_from.setControlText (grid_alldoc.getCellValue(grid_alldoc.adr['nmsk'], inn));        
   }

   // declare =====================================================================================
   doc_lb_prch.setControlText (grid_alldoc.getCellValue(grid_alldoc.adr['prch'],  inn));      // operation 
   doc_lb_kddk.setControlText (grid_alldoc.getCellValue(grid_alldoc.adr['kd_dk'], inn));      // number    
   doc_lb_dtdk.setControlText (grid_alldoc.getCellValue(grid_alldoc.adr['dt_dk'], inn));      // date      
   doc_lb_order.setControlText(grid_alldoc.getCellValue(grid_alldoc.adr['nm_zak'],inn));      // order     
   doc_lb_kdkl.setControlText (grid_alldoc.getCellValue(grid_alldoc.adr['kdkl'],  inn));      // contact   
   doc_lb_comm.setControlText (grid_alldoc.getCellValue(grid_alldoc.adr['text'],  inn));      // comment   

   // =============================================================================================
   grid_doc.setHeaderText(doc_panel.HeaderDoc);
   grid_doc.setColumnWidth(doc_panel.ColSize);

   //==============================================================================================
   ar_records_doc = pipe.event({action:'get_doc',nmzp: doc_panel.nmzp, kdop: doc_panel.kdop },true);
   grid_doc.setCellData(ar_records_doc);
   grid_doc.setRowCount(ar_records_doc.length);

   //==============================================================================================
   grid_doc.setCellFormat(formats);
   for (i = 0; i < grid_alldoc.getRowCount(); i = i + 1) {
        if ((formats[i]==cbox.num)||(formats[i]==cbox.cur)) {
           grid_doc.getCellTemplate(i).setStyle("text-align","right")
           }
        else   
           grid_doc.getCellTemplate(i).setStyle("text-align","left")
   };
   grid_doc.selectCell(0,0);
   grid_doc.refresh();
} 
//=================================================================================================
//  button 2 visible                                  
//=================================================================================================
function doc2_bott_btopen() {
    var lf = 10;
	var wh = 110;

    if (bt_res_all_doc2.visible==true) {
   	    bt_res_all_doc2.setStyle("display", "block"); 
        bt_res_all_doc2.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_res_all_doc2.setStyle("display", "none"); }

    if (bt_gen_prod_doc2.visible==true) {
    	bt_gen_prod_doc2.setStyle("display", "block"); 
        bt_gen_prod_doc2.setStyle("left",lf);
        lf = lf + wh;
        }    	
    else {bt_gen_prod_doc2.setStyle("display", "none"); }
}
//=================================================================================================
//  button bottom unvisible                                  
//=================================================================================================
function doc2_bott_btclose() {
   bt_res_all_doc2.visible=false;
   bt_gen_prod_doc2.visible=false;
   
   bt_res_all_doc2.setStyle("display", "none");     
   bt_gen_prod_doc2.setStyle("display", "none");     
}
//=================================================================================================
//  button top visible                                  
//=================================================================================================
function doc_top_btopen() {
    var lf = 100;
    var wh = 90;
	bt_close_grid_doc.setStyle("display", "block"); 

    if (bt_add_grid_doc.visible==true) {
   	    bt_add_grid_doc.setStyle("display", "block"); 
        bt_add_grid_doc.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_add_grid_doc.setStyle("display", "none"); }

    if (bt_delete_grid_doc.visible==true) {
    	bt_delete_grid_doc.setStyle("display", "block"); 
        bt_delete_grid_doc.setStyle("left",lf);
        lf = lf + wh;
        }    	
    else {bt_delete_grid_doc.setStyle("display", "none"); }

    if (bt_edit_grid_doc.visible==true) {
        bt_edit_grid_doc.setStyle("display", "block"); 
        bt_edit_grid_doc.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_edit_grid_doc.setStyle("display", "none"); }

    if (bt_proc_grid_doc.visible==true) {
        bt_proc_grid_doc.setStyle("display", "block"); 
        bt_proc_grid_doc.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_proc_grid_doc.setStyle("display", "none"); }

    if (bt_report_grid_doc.visible==true) {
        bt_report_grid_doc.setStyle("display", "block"); 
        bt_report_grid_doc.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_report_grid_doc.setStyle("display", "none"); }
}
//=================================================================================================
//  button  top unvisible                                  
//=================================================================================================
function doc_top_btclose() {
   bt_add_grid_doc.setStyle("display", "none");     
   bt_delete_grid_doc.setStyle("display", "none");     
   bt_edit_grid_doc.setStyle("display", "none");     
   bt_proc_grid_doc.setStyle("display", "none");     
   bt_report_grid_doc.setStyle("display", "none");     
}
//=================================================================================================
//  button bottom visible                                  
//=================================================================================================
function doc_bot_btopen() {
    lf = 10;
	wh = 90;
    if (bt_war_grid_doc.visible==true) {
   	    bt_war_grid_doc.setStyle("display", "block"); 
        bt_war_grid_doc.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_war_grid_doc.setStyle("display", "none"); };    

    if (bt_sernom_grid_doc.visible==true) {
    	bt_sernom_grid_doc.setStyle("display", "block"); 
        bt_sernom_grid_doc.setStyle("left",lf);
        lf = lf + wh;
        }    	
    else {bt_sernom_grid_doc.setStyle("display", "none"); };    

    if (bt_izd_grid_doc.visible==true) {
        bt_izd_grid_doc.setStyle("display", "block"); 
        bt_izd_grid_doc.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_izd_grid_doc.setStyle("display", "none"); };    

    if (bt_reserv_grid_doc.visible==true) {
        bt_reserv_grid_doc.setStyle("display", "block"); 
        bt_reserv_grid_doc.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_reserv_grid_doc.setStyle("display", "none"); };    

    if (bt_serv_grid_doc.visible==true) {
        bt_serv_grid_doc.setStyle("display", "block"); 
        bt_serv_grid_doc.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_serv_grid_doc.setStyle("display", "none"); };    

    if (bt_exec_grid_doc.visible==true) {
        bt_exec_grid_doc.setStyle("display", "block"); 
        bt_exec_grid_doc.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_exec_grid_doc.setStyle("display", "none"); };    

    if (bt_expen_grid_doc.visible==true) {
        bt_expen_grid_doc.setStyle("display", "block"); 
        bt_expen_grid_doc.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_expen_grid_doc.setStyle("display", "none"); };    

}
//=================================================================================================
//  button bot unvisible                                  
//=================================================================================================
function doc_bot_btclose() {
 bt_war_grid_doc.setStyle   ("display", "none"); 
 bt_sernom_grid_doc.setStyle("display", "none"); 
 bt_izd_grid_doc.setStyle   ("display", "none");
 bt_reserv_grid_doc.setStyle("display", "none"); 
 bt_serv_grid_doc.setStyle  ("display", "none");
 bt_exec_grid_doc.setStyle  ("display", "none"); 
 bt_expen_grid_doc.setStyle ("display", "none"); 

}

//=================================================================================================
//  button grid 2 top visible                                  
//=================================================================================================
function doc2_top_btopen() {
    var lf = 80;
    var wh = 70;
	bt_end_grid_doc2.setStyle("display", "block"); 

    if (bt_add_grid_doc2.visible==true) {
   	    bt_add_grid_doc2.setStyle("display", "block"); 
        bt_add_grid_doc2.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_add_grid_doc2.setStyle("display", "none"); }

    if (bt_delete_grid_doc2.visible==true) {
    	bt_delete_grid_doc2.setStyle("display", "block"); 
        bt_delete_grid_doc2.setStyle("left",lf);
        lf = lf + wh;
        }    	
    else {bt_delete_grid_doc2.setStyle("display", "none"); }

    if (bt_edit_grid_doc2.visible==true) {
        bt_edit_grid_doc2.setStyle("display", "block"); 
        bt_edit_grid_doc2.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_edit_grid_doc2.setStyle("display", "none"); }
    
    bt_add_grid_doc2.visible=true;
    bt_delete_grid_doc2.visible=true;
    bt_edit_grid_doc2.visible=true;
}
//=================================================================================================
//  button  top unvisible                                  
//=================================================================================================
function doc2_top_btclose() {
   bt_add_grid_doc2.setStyle   ("display", "none");     
   bt_delete_grid_doc2.setStyle("display", "none");     
   bt_edit_grid_doc2.setStyle  ("display", "none");     
}
//=================================================================================================
//  
//=================================================================================================
cw =(window.innerWidth)?window.innerWidth:((document.all)?document.documentElement.offsetWidth:null);
ch =(window.innerHeight)?window.innerHeight:((document.all)?document.documentElement.offsetHeight:null);

                             var doc_obj = AW.HTML.SPAN.subclass();  
                             doc_obj.create = function(){  
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
//=================================================================================================
                             var doc_panel = new AW.UI.Group;
                             doc_panel.setId("doc_panel");
                             doc_panel.setSize(cw-75,ch-95);
                             doc_panel.setPosition(10,40);
                             doc_panel.setStyle("background", "#f9f8f4"); 
                             doc_panel.setStyle("border", "1px");

                             var DocPanel = new doc_obj(doc_panel); 
                             DocPanel.setStyle("display", "none") ;    
                             document.write(DocPanel); 
doc_panel.ColSize=[];
doc_panel.HeaderDoc=[];
doc_panel.flag = true;
doc_panel.opr='';
//=================================================================================================
                             var grid_doc = new AW.UI.Grid;
                             grid_doc.setId("grid_doc");
                             grid_doc.setHeaderText(doc_panel.HeaderDoc);
                             grid_doc.setColumnWidth(doc_panel.ColSize);
                             grid_doc.setHeaderHeight(30);
                             grid_doc.setRowHeight(26);
                             grid_doc.setColumnCount(8);
                             grid_doc.setRowCount(25);
                             grid_doc.setRowHeight(40);
                             grid_doc.setSize(cw-500,ch-105);
                             grid_doc.setPosition(10,50);
                             grid_doc.setCellEditable(false); 
                                                     
                             grid_doc.getRowTemplate().setClass("text", "wrap");
                             grid_doc.setCellTemplate(new AW.Templates.ImageText);
  
                             grid_doc.setSelectorVisible(true);
                             grid_doc.setSelectorWidth(35);
                             grid_doc.setSelectorText(function(i){return this.getRowPosition(i)+1});
                             grid_doc.setScrollBars("both");
                             grid_doc.onScrollBarsChanging = function(){return 1};
grid_doc.getSeparatorTemplate().setEvent("ondblclick", function(event){
        this.raiseEvent("onSeparatorDoubleClicked", event, this.$0);
});

grid_doc.onSeparatorDoubleClicked = function(event, column){
};
//=================================================================================================
// main button: add,delete,edit,close,pgdn,pgup,processing,reports  
//=================================================================================================

// close form =====================================================================================
                             var bt_close_grid_doc = new AW.UI.Button;
                             bt_close_grid_doc.setId("bt_close_grid_doc");
                             bt_close_grid_doc.setControlText("Close");
                             bt_close_grid_doc.setStyle("left",10);
                             bt_close_grid_doc.setStyle("top",120);
                             bt_close_grid_doc.setStyle("width",90);
                             //bt_close_grid_doc.visible=true;

bt_close_grid_doc.onClick = function pres_close_doc(){
 doc_close();
};
// add new record ================================================================================
                             var bt_add_grid_doc = new AW.UI.Button;
                             bt_add_grid_doc.setId("bt_add_grid_doc");
                             bt_add_grid_doc.setControlText("Add");
                             bt_add_grid_doc.setStyle("left",100);
                             bt_add_grid_doc.setStyle("top",120);
                             bt_add_grid_doc.setStyle("width",90);
                             bt_add_grid_doc.visible=true;

bt_add_grid_doc.onClick = function pres_add_doc(){
alert('add');
};
// delete record ==================================================================================
                             var bt_delete_grid_doc = new AW.UI.Button;
                             bt_delete_grid_doc.setId("bt_delete_grid_doc");
                             bt_delete_grid_doc.setControlText("Delete");
                             bt_delete_grid_doc.setStyle("left",190);
                             bt_delete_grid_doc.setStyle("top",120);
                             bt_delete_grid_doc.setStyle("width",90);
                             bt_delete_grid_doc.visible=true;

bt_delete_grid_doc.onClick = function pres_delete_doc() {
alert('delete');
};
// edit   record ==================================================================================
                             var bt_edit_grid_doc = new AW.UI.Button;
                             bt_edit_grid_doc.setId("bt_edit_grid_doc");
                             bt_edit_grid_doc.setControlText("Edit");
                             bt_edit_grid_doc.setStyle("left",280);
                             bt_edit_grid_doc.setStyle("top",120);
                             bt_edit_grid_doc.setStyle("width",90);
                             bt_edit_grid_doc.visible=true;

bt_edit_grid_doc.onClick = function pres_edit_doc(){
 if (doc_panel.flag) {
    doc_panel.flag = false;

 }; 
};
// processing    ==================================================================================
                             var bt_proc_grid_doc = new AW.UI.Button;
                             bt_proc_grid_doc.setId("bt_proc_grid_doc");
                             bt_proc_grid_doc.setControlText("Processing");
                             bt_proc_grid_doc.setStyle("left",370);
                             bt_proc_grid_doc.setStyle("top",120);
                             bt_proc_grid_doc.setStyle("width",90);
                             bt_proc_grid_doc.visible=true;

bt_proc_grid_doc.onClick = function pres_proc_doc(){
 if (doc_panel.flag) {
    doc_panel.flag = false;

 }; 
};
// report        ==================================================================================
                             var bt_report_grid_doc = new AW.UI.Button;
                             bt_report_grid_doc.setId("bt_report_grid_doc");
                             bt_report_grid_doc.setControlText("Reports")
                             bt_report_grid_doc.setStyle("left",460);
                             bt_report_grid_doc.setStyle("top",120);
                             bt_report_grid_doc.setStyle("width",90);
                             bt_report_grid_doc.visible=true;

bt_report_grid_doc.onClick = function pres_report_doc(){
 if (doc_panel.flag) {
    doc_panel.flag = false;

 }
};
// declare       ==================================================================================

                             var doc_lb_prch = new AW.UI.Label;
                                 doc_lb_prch.setId("doc_lb_prch");
                                 doc_lb_prch.setControlText("");
                                 doc_lb_prch.setStyle("left",100);
                                 doc_lb_prch.setStyle("top",2);
                                 doc_lb_prch.setStyle("font-size", "12pt");
                             var doc_lb_prch1 = new AW.UI.Label;
                                 doc_lb_prch1.setId("doc_lb_prch1");
                                 doc_lb_prch1.setControlText("Operation:");
                                 doc_lb_prch1.setStyle("left",10);
                                 doc_lb_prch1.setStyle("top",2);

                             var doc_lb_kddk1 = new AW.UI.Label;
                                 doc_lb_kddk1.setId("doc_lb_kddk1");
                                 doc_lb_kddk1.setControlText("Number:");
                                 doc_lb_kddk1.setStyle("left",10);
                                 doc_lb_kddk1.setStyle("top",22);
                             var doc_lb_kddk = new AW.UI.Label;
                                 doc_lb_kddk.setId("doc_lb_kddk");
                                 doc_lb_kddk.setControlText("");
                                 doc_lb_kddk.setStyle("left",100);
                                 doc_lb_kddk.setStyle("top",22);

                             var doc_lb_dtdk = new AW.UI.Label;
                                 doc_lb_dtdk.setId("doc_lb_dtdk");
                                 doc_lb_dtdk.setControlText("");
                                 doc_lb_dtdk.setStyle("left",100);
                                 doc_lb_dtdk.setStyle("top",42);
                             var doc_lb_dtdk1 = new AW.UI.Label;
                                 doc_lb_dtdk1.setId("doc_lb_dtdk1");
                                 doc_lb_dtdk1.setControlText("Date:");
                                 doc_lb_dtdk1.setStyle("left",10);
                                 doc_lb_dtdk1.setStyle("top",42);

                             var doc_lb_order = new AW.UI.Label;
                                 doc_lb_order.setId("doc_lb_order");
                                 doc_lb_order.setControlText("");
                                 doc_lb_order.setStyle("left",100);
                                 doc_lb_order.setStyle("top",62);
                             var doc_lb_order1 = new AW.UI.Label;
                                 doc_lb_order1.setId("doc_lb_order1");
                                 doc_lb_order1.setControlText("Work Order:");
                                 doc_lb_order1.setStyle("left",10);
                                 doc_lb_order1.setStyle("top",62);

                             var doc_lb_comm = new AW.UI.Label;
                                 doc_lb_comm.setId("doc_lb_comm");
                                 doc_lb_comm.setControlText("");
                                 doc_lb_comm.setStyle("left",100);
                                 doc_lb_comm.setStyle("top",82);
                             var doc_lb_comm1 = new AW.UI.Label;
                                 doc_lb_comm1.setId("doc_lb_comm1");
                                 doc_lb_comm1.setControlText("Comment:");
                                 doc_lb_comm1.setStyle("left",10);
                                 doc_lb_comm1.setStyle("top",82);

                             var doc_lb_from = new AW.UI.Label;
                                 doc_lb_from.setId("doc_lb_from");
                                 doc_lb_from.setControlText("");
                                 doc_lb_from.setStyle("left",370);
                                 doc_lb_from.setStyle("top",22);
                             var doc_lb_from1 = new AW.UI.Label;
                                 doc_lb_from1.setId("doc_lb_from1");
                                 doc_lb_from1.setControlText("From:");
                                 doc_lb_from1.setStyle("left",300);
                                 doc_lb_from1.setStyle("top",22);

                             var doc_lb_to = new AW.UI.Label;
                                 doc_lb_to.setId("doc_lb_to");
                                 doc_lb_to.setControlText("");
                                 doc_lb_to.setStyle("left",370);
                                 doc_lb_to.setStyle("top",42);
                             var doc_lb_to1 = new AW.UI.Label;
                                 doc_lb_to1.setId("doc_lb_to1");
                                 doc_lb_to1.setControlText("To:");
                                 doc_lb_to1.setStyle("left",300);
                                 doc_lb_to1.setStyle("top",42);

                             var doc_lb_kdkl = new AW.UI.Label;
                                 doc_lb_kdkl.setId("doc_lb_kdkl");
                                 doc_lb_kdkl.setControlText("");
                                 doc_lb_kdkl.setStyle("left",370);
                                 doc_lb_kdkl.setStyle("top",62);
                             var doc_lb_kdkl1 = new AW.UI.Label;
                                 doc_lb_kdkl1.setId("doc_lb_kdkl1");
                                 doc_lb_kdkl1.setControlText("Contact:");
                                 doc_lb_kdkl1.setStyle("left",300);
                                 doc_lb_kdkl1.setStyle("top",62);

//=================================================================================================
// buttons: ser.number,location,reservation,history,description,services,executors,expenses
//=================================================================================================

// warehouse ======================================================================================
                             var bt_war_grid_doc = new AW.UI.Button;
                                 bt_war_grid_doc.setId("bt_war_grid_doc");
                                 bt_war_grid_doc.setControlText("Warehouse")
                                 bt_war_grid_doc.setStyle("left",10);
                                 bt_war_grid_doc.setStyle("top",8);
                                 bt_war_grid_doc.setStyle("width",90);
                                 bt_war_grid_doc.visible=true;

bt_war_grid_doc.onClick = function pres_war_doc(){
    
    DocFon.setStyle("display", "block");  
    DocFon2.setStyle("display", "block");  

    war_open();
};
// ser number =====================================================================================
                             var bt_sernom_grid_doc = new AW.UI.Button;
                                 bt_sernom_grid_doc.setId("bt_sernom_grid_doc");
                                 bt_sernom_grid_doc.setControlText("Ser.num")
                                 bt_sernom_grid_doc.setStyle("left",100);
                                 bt_sernom_grid_doc.setStyle("top",8);
                                 bt_sernom_grid_doc.setStyle("width",90);
                                 bt_sernom_grid_doc.visible=true;
bt_sernom_grid_doc.onClick = function pres_report_doc(){
 if (doc_panel.flag) {
    doc_panel.flag = false;
    rowt = grid_doc.getCurrentRow();	
    name_good = grid_doc.getCellValue(doc_panel.adr['kdim'], rowt);            
    
    nmzpo = grid_doc.getCellValue(doc_panel.adr['nm_zpo'], rowt);               
    nmzpr = grid_doc.getCellValue(doc_panel.adr['nm_zp'], rowt);              
    
    if ((name_good=="")|(nmzpo==0)) { alert('NO RECORD'); } 
    else {
         // ser.number
         doc_panel.opr='sernum';
  
         DocFon.setStyle("display", "block");  
         doc_panel.HeaderDoc2 = ["Serial Number"];
         doc_panel.ColSize2   = [200];
         doc_panel.adr2 = {'nm_ser' : 0,'nm_zp' : 11 };

         formats2 = [doc_panel.str];
         grid_doc2.setHeaderText(doc_panel.HeaderDoc2);
         grid_doc2.setColumnWidth(doc_panel.ColSize2);
         grid_doc2.setCellFormat(formats2);
         grid_doc2.getCellTemplate(0).setStyle("text-align","right");

         doc_lb1_doc2.setControlText("Serial Number");
         doc_lb2_doc2.setControlText(name_good);

         // read sernum
         records2 = pipe.event({action:'get_sernum', nmzpr: nmzpr, nmzpo: 0, kdus: cbox.kdus },true);
         grid_doc2.setCellText(records2);
         grid_doc2.setRowCount(records2.length);
         grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);

         grid_doc2.selectCell(0,0);
         grid_doc2.refresh();

         //
         doc2_top_btopen();

         doc2_bott_btclose();
         GridDoc2.setStyle("visibility","visible");  
         DocFon2.setStyle("display", "none");  
    };
 }; 
 doc_panel.flag = false;
};
// product =======================================================================================
                             var bt_izd_grid_doc = new AW.UI.Button;
                                 bt_izd_grid_doc.setId("bt_izd_grid_doc");
                                 bt_izd_grid_doc.setControlText("Product")
                                 bt_izd_grid_doc.setStyle("left",190);
                                 bt_izd_grid_doc.setStyle("top",8);
                                 bt_izd_grid_doc.setStyle("width",90);
                                 bt_izd_grid_doc.visible=true;
bt_izd_grid_doc.onClick = function pres_izd_doc(){
if (doc_panel.flag) {
   doc_panel.flag = false;
   // product
   doc_panel.opr='product';
  
  DocFon.setStyle("display", "block");  
  doc_panel.HeaderDoc2 = ["Product","Code","Quantity","Price"];
  doc_panel.ColSize2   = [200, 100,100,100];
  doc_panel.adr2 = {'imiz' : 0, 'kd_st' : 1, 'kl_iz' : 2, 'st_izs' : 3, 'kd_im' : 4, 'nm_zp' :11   };
  formats2 = [doc_panel.str, doc_panel.str, doc_panel.num, doc_panel.num, doc_panel.str];
  grid_doc2.setHeaderText(doc_panel.HeaderDoc2);
  grid_doc2.setColumnWidth(doc_panel.ColSize2);
  grid_doc2.setCellFormat(formats2);
  grid_doc2.getCellTemplate(0).setStyle("text-align","left");
  grid_doc2.getCellTemplate(1).setStyle("text-align","right")
  grid_doc2.getCellTemplate(2).setStyle("text-align","right")
  grid_doc2.getCellTemplate(3).setStyle("text-align","right")

  doc_lb1_doc2.setControlText("Product");
  doc_lb2_doc2.setControlText("");

  // read products
  records2 = pipe.event({action:'get_obp', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
  grid_doc2.setCellText(records2);
  grid_doc2.setRowCount(records2.length);
  grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);

  grid_doc2.selectCell(0,0);
  grid_doc2.refresh();

  //
  doc2_bott_btclose();

  bt_gen_prod_doc2.visible=true;
  doc2_bott_btopen();
  //
  doc2_top_btopen();

  GridDoc2.setStyle("visibility","visible");  
  DocFon2.setStyle("display", "none");  
 }; 
 doc_panel.flag = true;

};
// reservation ====================================================================================
                             var bt_reserv_grid_doc = new AW.UI.Button;
                                 bt_reserv_grid_doc.setId("bt_reserv_grid_doc");
                                 bt_reserv_grid_doc.setControlText("Reservation")
                                 bt_reserv_grid_doc.setStyle("left",280);
                                 bt_reserv_grid_doc.setStyle("top",8);
                                 bt_reserv_grid_doc.setStyle("width",90);
                                 bt_reserv_grid_doc.visible=true;
bt_reserv_grid_doc.onClick = function pres_reserv_doc(){
if (doc_panel.flag) {
   doc_panel.flag = false;
   doc_panel.opr='reservation';
  
   DocFon.setStyle("display", "block");  
   doc_panel.HeaderDoc2 = ["Quantity","Order","Date","Item","Code"];
   doc_panel.ColSize2   = [100, 100, 100, 300, 100];
   doc_panel.adr2 = {'kl_rs' : 0, 'nm_zak' : 1, 'dt_rs' : 2, 'kdim' : 3, 'kd_st' : 4, 'nm_zp': 11   };
   formats2 = [doc_panel.num, doc_panel.str, doc_panel.dat, doc_panel.str, doc_panel.str];
   grid_doc2.setHeaderText(doc_panel.HeaderDoc2);
   grid_doc2.setColumnWidth(doc_panel.ColSize2);
   grid_doc2.setCellFormat(formats2);
   grid_doc2.getCellTemplate(0).setStyle("text-align","right");

   doc_lb1_doc2.setControlText("Reservation");
   doc_lb2_doc2.setControlText("");

   // read reservation
   records2 = pipe.event({action:'get_reserv', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
   grid_doc2.setCellText(records2);
   grid_doc2.setRowCount(records2.length);
   grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);

   grid_doc2.selectCell(0,0);
   grid_doc2.refresh();
   
   doc2_bott_btclose();
   bt_res_all_doc2.visible=true;
   doc2_bott_btopen();
   //
   bt_edit_grid_doc2.visible=false;
   doc2_top_btopen();
   
   GridDoc2.setStyle("visibility","visible");  
   DocFon2.setStyle("display", "none");  
 }; 
 doc_panel.flag = true;
};
// services =======================================================================================
                             var bt_serv_grid_doc = new AW.UI.Button;
                                 bt_serv_grid_doc.setId("bt_serv_grid_doc");
                                 bt_serv_grid_doc.setControlText("Services")
                                 bt_serv_grid_doc.setStyle("left",550);
                                 bt_serv_grid_doc.setStyle("top",8);
                                 bt_serv_grid_doc.setStyle("width",90);
                                 bt_serv_grid_doc.visible=true;
bt_serv_grid_doc.onClick = function pres_serv_doc(){
if (doc_panel.flag) {
   doc_panel.flag = false;
   // services
   doc_panel.opr='service';
  
  DocFon.setStyle("display", "block");  
  doc_panel.HeaderDoc2 = ["Name","Quantity","Price", "Amount","Comment"];
  doc_panel.ColSize2   = [200, 100,100,100,200];
  doc_panel.adr2 = {'imsm' : 0, 'kl_op' : 1, 'st_op' : 2, 'sm_op' : 3, 'text' : 4, 'kd_sm': 5, 'nm_zp' :11   };
  formats2 = [doc_panel.str, doc_panel.num, doc_panel.num, doc_panel.num, doc_panel.str];
  grid_doc2.setHeaderText(doc_panel.HeaderDoc2);
  grid_doc2.setColumnWidth(doc_panel.ColSize2);
  grid_doc2.setCellFormat(formats2);
  grid_doc2.getCellTemplate(0).setStyle("text-align","left");
  grid_doc2.getCellTemplate(1).setStyle("text-align","right")
  grid_doc2.getCellTemplate(2).setStyle("text-align","right")
  grid_doc2.getCellTemplate(3).setStyle("text-align","right")

  doc_lb1_doc2.setControlText("Service");
  doc_lb2_doc2.setControlText("");

  // read services
  records2 = pipe.event({action:'get_sum', nmzp: doc_panel.nmzp, prsum: 0, kdus: cbox.kdus },true);
  grid_doc2.setCellText(records2);
  grid_doc2.setRowCount(records2.length);
  grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);

  grid_doc2.selectCell(0,0);
  grid_doc2.refresh();

  //
  doc2_top_btopen();

  doc2_bott_btclose();
  GridDoc2.setStyle("visibility","visible");  
  DocFon2.setStyle("display", "none");  
 }; 
 doc_panel.flag = true;
};
// execcutors =====================================================================================
                             var bt_exec_grid_doc = new AW.UI.Button;
                                 bt_exec_grid_doc.setId("bt_exec_grid_doc");
                                 bt_exec_grid_doc.setControlText("Executor")
                                 bt_exec_grid_doc.setStyle("left",640);
                                 bt_exec_grid_doc.setStyle("top",8);
                                 bt_exec_grid_doc.setStyle("width",90);
                                 bt_exec_grid_doc.visible=true;
bt_exec_grid_doc.onClick = function pres_exec_doc(){
if (doc_panel.flag) {
   doc_panel.flag = false;
   doc_panel.opr='executor';
  
   DocFon.setStyle("display", "block");  
   doc_panel.HeaderDoc2 = ["Name","Comment","Quantity", "Department"];
   doc_panel.ColSize2   = [200, 200,100,200];
   doc_panel.adr2 = {'kdkl' : 0, 'text' : 1, 'kl_op' : 2, 'kdpd' : 3, 'kd_kl' : 4, 'kd_pd': 5, 'nm_zp' :11   };
   formats2 = [doc_panel.str, doc_panel.str, doc_panel.num, doc_panel.str];
   grid_doc2.setHeaderText(doc_panel.HeaderDoc2);
   grid_doc2.setColumnWidth(doc_panel.ColSize2);
   grid_doc2.setCellFormat(formats2);
   grid_doc2.getCellTemplate(0).setStyle("text-align","right");
   grid_doc2.getCellTemplate(2).setStyle("text-align","right")

   doc_lb1_doc2.setControlText("Executor");
   doc_lb2_doc2.setControlText("");

   // read executors
   records2 = pipe.event({action:'get_rab', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
   grid_doc2.setCellText(records2);
   grid_doc2.setRowCount(records2.length);
   grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);

   grid_doc2.selectCell(0,0);
   grid_doc2.refresh();

   //
   doc2_top_btopen();
 
   doc2_bott_btclose();
   GridDoc2.setStyle("visibility","visible");  
   DocFon2.setStyle("display", "none");  
 }; 
 doc_panel.flag = true;
};
// expenses =======================================================================================
                             var bt_expen_grid_doc = new AW.UI.Button;
                                 bt_expen_grid_doc.setId("bt_expen_grid_doc");
                                 bt_expen_grid_doc.setControlText("Taxe")
                                 bt_expen_grid_doc.setStyle("left",730);
                                 bt_expen_grid_doc.setStyle("top",8);
                                 bt_expen_grid_doc.setStyle("width",90);
                                 bt_expen_grid_doc.visible=true;
bt_expen_grid_doc.onClick = function pres_expen_doc(){
if (doc_panel.flag) {
   doc_panel.flag = false;
   // taxes
   doc_panel.opr='taxe';
  
   DocFon.setStyle("display", "block");  
   doc_panel.HeaderDoc2 = ["Name", "Amount"];
   doc_panel.ColSize2   = [200, 100];
   doc_panel.adr2 = {'imsm' : 0, 'sm_op' : 1, 'kd_sm' : 2, 'nm_zp' : 11   };
   formats2 = [doc_panel.str, doc_panel.num];
   grid_doc2.setHeaderText(doc_panel.HeaderDoc2);
   grid_doc2.setColumnWidth(doc_panel.ColSize2);
   grid_doc2.setCellFormat(formats2);
   grid_doc2.getCellTemplate(0).setStyle("text-align","right");
   grid_doc2.getCellTemplate(1).setStyle("text-align","right")

   doc_lb1_doc2.setControlText("Taxe");
   doc_lb2_doc2.setControlText("");

   // read taxes
   records2 = pipe.event({action:'get_sum', nmzp: doc_panel.nmzp, prsum: 1, kdus: cbox.kdus },true);
   grid_doc2.setCellText(records2);
   grid_doc2.setRowCount(records2.length);
   grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);

   grid_doc2.selectCell(0,0);
   grid_doc2.refresh(); 

   //
   doc2_top_btopen();
  
   doc2_bott_btclose();
   GridDoc2.setStyle("visibility","visible");  
   DocFon2.setStyle("display", "none"); 
}
doc_panel.flag = true;
};
//-----------------------------------------------------------------------------
                             var toolbar1_grid_doc = new AW.HTML.DIV;
                             toolbar1_grid_doc.setContent("label11", function(){return doc_lb_prch1});
                             toolbar1_grid_doc.setContent("label1",  function(){return doc_lb_prch});
                             toolbar1_grid_doc.setContent("label2",  function(){return doc_lb_kddk});
                             toolbar1_grid_doc.setContent("label21", function(){return doc_lb_kddk1});
                             toolbar1_grid_doc.setContent("label3",  function(){return doc_lb_dtdk});
                             toolbar1_grid_doc.setContent("label31", function(){return doc_lb_dtdk1});
                             toolbar1_grid_doc.setContent("label4",  function(){return doc_lb_order});
                             toolbar1_grid_doc.setContent("label41", function(){return doc_lb_order1});
                             toolbar1_grid_doc.setContent("label5",  function(){return doc_lb_comm});
                             toolbar1_grid_doc.setContent("label51", function(){return doc_lb_comm1});
                             toolbar1_grid_doc.setContent("label6",  function(){return doc_lb_from});
                             toolbar1_grid_doc.setContent("label61", function(){return doc_lb_from1});
                             toolbar1_grid_doc.setContent("label7",  function(){return doc_lb_to});
                             toolbar1_grid_doc.setContent("label71", function(){return doc_lb_to1});
                             toolbar1_grid_doc.setContent("label8",  function(){return doc_lb_kdkl});
                             toolbar1_grid_doc.setContent("label81", function(){return doc_lb_kdkl1});
                             
                             toolbar1_grid_doc.setContent("button1", function(){return bt_add_grid_doc});
                             toolbar1_grid_doc.setContent("button2", function(){return bt_delete_grid_doc});
                             toolbar1_grid_doc.setContent("button3", function(){return bt_edit_grid_doc});
                             toolbar1_grid_doc.setContent("button4", function(){return bt_close_grid_doc});
                             toolbar1_grid_doc.setContent("button7", function(){return bt_proc_grid_doc});
                             toolbar1_grid_doc.setContent("button8", function(){return bt_report_grid_doc});

                             var toolbar2_grid_doc = new AW.HTML.DIV;
                             toolbar2_grid_doc.setContent("button17", function(){return bt_serv_grid_doc});
                             toolbar2_grid_doc.setContent("button18", function(){return bt_exec_grid_doc});
                             toolbar2_grid_doc.setContent("button19", function(){return bt_expen_grid_doc});
                             toolbar2_grid_doc.setContent("button11", function(){return bt_war_grid_doc});
                             toolbar2_grid_doc.setContent("button12", function(){return bt_sernom_grid_doc});
                             toolbar2_grid_doc.setContent("button13", function(){return bt_izd_grid_doc});
                             toolbar2_grid_doc.setContent("button14", function(){return bt_reserv_grid_doc});


                             grid_doc.defineTemplate("toolbar1", toolbar1_grid_doc);
                             //    toolbar1.setStyle("background", "red");
                             grid_doc.defineTemplate("toolbar2", toolbar2_grid_doc);
                             grid_doc.setLayoutTemplate(new AW.Panels.Horizontal);

grid_doc.setPanelTemplate(function(i){
    switch(i){
       case "top":     return this.getToolbar1Template();
       case "center":  return this.getScrollTemplate();
       case "bottom":  return this.getToolbar2Template();
    }
 });

grid_doc.onPanelWidthChanged = function(width, panel){
   this.getLayoutTemplate().changePanelWidth(width, panel);
 };

grid_doc.onPanelHeightChanged = function(height, panel){
    this.getLayoutTemplate().changePanelHeight(height, panel);
 };
                             grid_doc.setPanelHeight(150, "top"); 
                             grid_doc.setPanelHeight(40, "bottom"); 

                             var GridDoc = new doc_obj(grid_doc); 
                             GridDoc.setStyle("visibility","hidden");
                             document.write(GridDoc);
//===============================================    
                             var doc_fon = new AW.UI.Group;
                             doc_fon.setId("doc_fon");
                             doc_fon.setPosition(10,40);
                             doc_fon.setSize(cw-500,ch-100+5);
                             doc_fon.setStyle("background", "#eee");
                             doc_fon.setStyle("filter","alpha(opacity=60)");
                             doc_fon.setStyle("opacity","0.6");
                             var DocFon = new doc_obj(doc_fon); 
                             DocFon.setStyle("display", "none") ;    
                             document.write(DocFon); 
//=================================================================================================
//                             
//=================================================================================================                             
// grid doc 2 ====================================================================================
                             var grid_doc2 = new AW.UI.Grid;
                             grid_doc2.setId("grid_doc2");
                             grid_doc2.setHeaderText(doc_panel.HeaderDoc2);
                             grid_doc2.setColumnWidth(doc_panel.ColSize2);
                             grid_doc2.setHeaderHeight(30);
                             grid_doc2.setRowHeight(26);
                             grid_doc2.setColumnCount(8);
                             grid_doc2.setRowCount(25);
                             grid_doc2.setRowHeight(40);
                             grid_doc2.setSize(415,ch-105);
                             grid_doc2.setPosition(20+cw-500,50);
                             grid_doc.setCellEditable(false); 
                          
                             grid_doc2.getRowTemplate().setClass("text", "wrap");
                             grid_doc2.setCellTemplate(new AW.Templates.ImageText);
  
                             grid_doc2.setSelectorVisible(true);
                             grid_doc2.setSelectorWidth(35);
                             grid_doc2.setSelectorText(function(i){return this.getRowPosition(i)+1});
//===============================================                             
                             var doc_lb1_doc2 = new AW.UI.Label;
                                 doc_lb1_doc2.setId("doc_lb1_doc2");
                                 doc_lb1_doc2.setControlText("Proba");
                                 doc_lb1_doc2.setStyle("left",10);
                                 doc_lb1_doc2.setStyle("top",2);
                                 doc_lb1_doc2.setStyle("font-size", "12pt");

                             var doc_lb2_doc2 = new AW.UI.Label;
                                 doc_lb2_doc2.setId("doc_lb2_doc2");
                                 doc_lb2_doc2.setControlText("Proba");
                                 doc_lb2_doc2.setStyle("left",10);
                                 doc_lb2_doc2.setStyle("top",22);
                                 doc_lb2_doc2.setStyle("font-size", "12pt");
// add ===========================================
                             var bt_add_grid_doc2 = new AW.UI.Button;
                             bt_add_grid_doc2.setId("bt_add_grid_doc2");
                             bt_add_grid_doc2.setControlText("Add");
                             bt_add_grid_doc2.setStyle("left",80);
                             bt_add_grid_doc2.setStyle("top",50);
                             bt_add_grid_doc2.setStyle("width",70);
                             bt_add_grid_doc2.visible=true;

bt_add_grid_doc2.onClick = function pres_add_doc2(){
    // taxes ====================================
	if  (doc_panel.opr=='taxe') {
       input_open('Add taxe',0);
   }
   // services ==================================
   if  (doc_panel.opr=='service') {
       input_open('Add service',0);
   }
   // executors =================================
   if  (doc_panel.opr=='executor') {
       input_open('Add executor',0);
   }
   // sernum   =================================
   if  (doc_panel.opr=='sernum') {
       input_open('Add serial number',0);
   }
   // product   =================================
   if  (doc_panel.opr=='product') {
       input_open('Add product',0);
   }
   // reservation   =================================
   if (doc_panel.opr=='reservation') {
      rowr   = grid_doc.getCurrentRow();	
      nmzpr  = grid_doc.getCellValue(doc_panel.adr['nm_zp'], rowr);      
      // check input
      if ((grid_doc.getCellValue(doc_panel.adr['kdim'],rowr)=='')||(grid_doc.getCellValue(doc_panel.adr['kol_op'],rowr)==0) ||
          (grid_doc.getCellValue(doc_panel.adr['nm_zak'],rowr)==''))
          { alert ('Enter value of the record'); }
      else {    
      	kod  = pipe.event({action: 'add_reserv', nmzpd: 0, nmzpr: nmzpr, kdus: cbox.kdus },true);
        //
        records2 = pipe.event({action:'get_reserv', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
        grid_doc2.setCellText(records2);
        grid_doc2.setRowCount(records2.length);
        grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);
        grid_doc2.refresh();
      }
   }

};
// delete =====================================================================
                             var bt_delete_grid_doc2 = new AW.UI.Button;
                             bt_delete_grid_doc2.setId("bt_delete_grid_doc2");
                             bt_delete_grid_doc2.setControlText("Delete");
                             bt_delete_grid_doc2.setStyle("left",150);
                             bt_delete_grid_doc2.setStyle("top",50);
                             bt_delete_grid_doc2.setStyle("width",70);
                             bt_delete_grid_doc2.visible=true;

bt_delete_grid_doc2.onClick = function pres_delete_doc2() {
    // delete taxes ===============================================================
	if (doc_panel.opr== 'taxe') {
	   	inn  = grid_doc2.getCurrentRow();
		nmzp = grid_doc2.getCellValue(doc_panel.adr2['nm_zp'], inn);   
        //
        textf =doc_panel.HeaderDoc2[0]+': '+grid_doc2.getCellValue(0,inn)+' '+ 
        doc_panel.HeaderDoc2[1]+': '+grid_doc2.getCellValue(1,inn);
        mes_open(textf,'Delete record?','deltaxe',{nrecord: nmzp}); 
	}
    
	// delete services ===========================================================
	if (doc_panel.opr== 'service') {
	   	inn  = grid_doc2.getCurrentRow();
		nmzp = grid_doc2.getCellValue(doc_panel.adr2['nm_zp'], inn); 
        //
        textf =doc_panel.HeaderDoc2[0]+': '+grid_doc2.getCellValue(0,inn)+' '+ 
        doc_panel.HeaderDoc2[1]+': '+grid_doc2.getCellValue(1,inn);
        mes_open(textf,'Delete record?','delservice',{nrecord: nmzp}); 
	}

	// delete services ===========================================================
	if (doc_panel.opr== 'executor') {
	   	inn  = grid_doc2.getCurrentRow();
		nmzp = grid_doc2.getCellValue(doc_panel.adr2['nm_zp'], inn); 
        //
        textf =doc_panel.HeaderDoc2[0]+': '+grid_doc2.getCellValue(0,inn)+' '+ 
        doc_panel.HeaderDoc2[1]+': '+grid_doc2.getCellValue(1,inn);
        mes_open(textf,'Delete record?','delexecutor',{nrecord: nmzp}); 
	}

	// delete sernum   ===========================================================
	if (doc_panel.opr== 'sernum') {
	   	inn  = grid_doc2.getCurrentRow();
		nmzp = grid_doc2.getCellValue(doc_panel.adr2['nm_zp'], inn); 
        //
        textf =doc_panel.HeaderDoc2[0]+': '+grid_doc2.getCellValue(0,inn);
        mes_open(textf,'Delete record?','delsernum',{nrecord: nmzp}); 
	}
	// delete product   ===========================================================
	if (doc_panel.opr== 'product') {
	   	inn  = grid_doc2.getCurrentRow();
		nmzp = grid_doc2.getCellValue(doc_panel.adr2['nm_zp'], inn); 
        //
        textf =doc_panel.HeaderDoc2[0]+': '+grid_doc2.getCellValue(0,inn);
        mes_open(textf,'Delete record?','delproduct',{nrecord: nmzp}); 
	}
	// delete reservation   ===========================================================
	if (doc_panel.opr== 'reservation') {
	   	inn  = grid_doc2.getCurrentRow();
		nmzp = grid_doc2.getCellValue(doc_panel.adr2['nm_zp'], inn); 
        //
        textf =doc_panel.HeaderDoc2[0]+': '+grid_doc2.getCellValue(0,inn);
        mes_open(textf,'Delete record?','delreserv',{nrecord: nmzp}); 
	}
};

// edit  ======================================================================
                             var bt_edit_grid_doc2 = new AW.UI.Button;
                             bt_edit_grid_doc2.setId("bt_edit_grid_doc2");
                             bt_edit_grid_doc2.setControlText("Edit");
                             bt_edit_grid_doc2.setStyle("left",220);
                             bt_edit_grid_doc2.setStyle("top",50);
                             bt_edit_grid_doc2.setStyle("width",70);
                             bt_edit_grid_doc2.visible=true;

bt_edit_grid_doc2.onClick = function pres_edit_doc2(){
    // taxes ====================================
	if  (doc_panel.opr=='taxe') {
	   inn  = grid_doc2.getCurrentRow();
	   nmzp = grid_doc2.getCellValue(doc_panel.adr2['nm_zp'], inn);  
       input_open('Edit taxe',nmzp);
   }
   // services ==================================
   if  (doc_panel.opr=='service') {
	   inn  = grid_doc2.getCurrentRow();
	   nmzp = grid_doc2.getCellValue(11, inn);  // << take care >>>
       input_open('Edit service',nmzp);
   }
   // executors =================================
   if  (doc_panel.opr=='executor') {
	   inn  = grid_doc2.getCurrentRow();
	   nmzp = grid_doc2.getCellValue(doc_panel.adr2['nm_zp'], inn);  
       input_open('Edit executor',nmzp);
   }
   // sernum    =================================
   if  (doc_panel.opr=='sernum') {
	   inn  = grid_doc2.getCurrentRow();
	   nmzp = grid_doc2.getCellValue(doc_panel.adr2['nm_zp'], inn);  
       input_open('Edit serial number',nmzp);
   }
   // product    =================================
   if  (doc_panel.opr=='product') {
	   inn  = grid_doc2.getCurrentRow();
	   nmzp = grid_doc2.getCellValue(doc_panel.adr2['nm_zp'], inn);  
       input_open('Edit product',nmzp);
   }
};
// end  ========================================
                             var bt_end_grid_doc2 = new AW.UI.Button;
                             bt_end_grid_doc2.setId("bt_end_grid_doc2");
                             bt_end_grid_doc2.setControlText("End");
                             bt_end_grid_doc2.setStyle("left",10);
                             bt_end_grid_doc2.setStyle("top",50);
                             bt_end_grid_doc2.setStyle("width",70);
                             //bt_end_grid_doc2.visible=true;

bt_end_grid_doc2.onClick = function pres_edit_doc2(){
  //GridDoc2.setStyle("visibility","hidden");  
  DocFon.setStyle("display", "none");  
  DocFon2.setStyle("display", "block");  

};
//===============================================
// reserve all
                             var bt_res_all_doc2 = new AW.UI.Button;
                             bt_res_all_doc2.setId("bt_res_all_doc2");
                             bt_res_all_doc2.setControlText("Reserve All");
                             bt_res_all_doc2.setStyle("left",10);
                             bt_res_all_doc2.setStyle("top",8);
                             bt_res_all_doc2.setStyle("width",110);
                             bt_res_all_doc2.visible=true;

bt_res_all_doc2.onClick = function pres_res_all_doc2(){
   // add all reservation   ===========================================================
   nmzp = doc_panel.nmzp;
   textf ='';
   mes_open(textf,'Add all record?','addallreserv',{nrecord: nmzp}); 
};
                             var bt_gen_prod_doc2 = new AW.UI.Button;
                             bt_gen_prod_doc2.setId("bt_gen_prod_doc2");
                             bt_gen_prod_doc2.setControlText("Components");
                             bt_gen_prod_doc2.setStyle("left",100);
                             bt_gen_prod_doc2.setStyle("top",8);
                             bt_gen_prod_doc2.setStyle("width",110);
                             bt_gen_prod_doc2.visible=true;
// generate components
bt_gen_prod_doc2.onClick = function pres_gen_prod_doc2(){
   nmzp = doc_panel.nmzp;
   textf ='';
   mes_open(textf,'Generate components?','gen_component',{nrecord: nmzp}); 
};
//===============================================
                             var toolbar1_grid_doc2 = new AW.HTML.DIV;
                             
                             toolbar1_grid_doc2.setContent("labeldoc2",  function(){return doc_lb1_doc2});
                             toolbar1_grid_doc2.setContent("label2doc2", function(){return doc_lb2_doc2});
                             toolbar1_grid_doc2.setContent("button1doc2", function(){return bt_add_grid_doc2});
                             toolbar1_grid_doc2.setContent("button2doc2", function(){return bt_delete_grid_doc2});
                             toolbar1_grid_doc2.setContent("button3doc2", function(){return bt_edit_grid_doc2});
                             toolbar1_grid_doc2.setContent("button4doc2", function(){return bt_end_grid_doc2});

                             var toolbar2_grid_doc2 = new AW.HTML.DIV;
                             toolbar2_grid_doc2.setContent("button21", function(){return bt_res_all_doc2});
                             toolbar2_grid_doc2.setContent("button22", function(){return bt_gen_prod_doc2});
//===============================================   



                             grid_doc2.defineTemplate("toolbar1", toolbar1_grid_doc2);
                             grid_doc2.defineTemplate("toolbar2", toolbar2_grid_doc2);
                             grid_doc2.setLayoutTemplate(new AW.Panels.Horizontal);

grid_doc2.setPanelTemplate(function(i){
    switch(i){
       case "top":     return this.getToolbar1Template();
       case "center":  return this.getScrollTemplate();
       case "bottom":  return this.getToolbar2Template();
    }
 });

grid_doc2.onPanelWidthChanged = function(width, panel){
   this.getLayoutTemplate().changePanelWidth(width, panel);
 };

grid_doc2.onPanelHeightChanged = function(height, panel){
    this.getLayoutTemplate().changePanelHeight(height, panel);
 };
                             grid_doc2.setPanelHeight(80, "top"); 
                             grid_doc2.setPanelHeight(40, "bottom"); 
//===============================================                             
                             var GridDoc2 = new doc_obj(grid_doc2); 
                             GridDoc2.setStyle("visibility","hidden");
                             document.write(GridDoc2);
//===============================================
                             var doc_fon2 = new AW.UI.Group;
                             doc_fon2.setId("doc_fon2");
                             doc_fon2.setPosition(20+cw-500,40);
                             doc_fon2.setSize(415,ch-100+5);
                             doc_fon2.setStyle("background", "#eee");
                             doc_fon2.setStyle("filter","alpha(opacity=60)");
                             doc_fon2.setStyle("opacity","0.6");
                             var DocFon2 = new doc_obj(doc_fon2); 
                             DocFon2.setStyle("display", "none") ;    
                             document.write(DocFon2); 
//-----------------------------------------------------------------------------
//  
//-----------------------------------------------------------------------------