//-----------------------------------------------------------------------------
//  WAREHOUSE PANEL
//-----------------------------------------------------------------------------
function war_close() {
   WarPanel.setStyle("display", "none");  
   GridWar.setStyle("visibility","hidden");
   //LbWarC.setStyle("display", "none");    
   DocFon.setStyle("display", "none");  
   DocFon2.setStyle("display", "none");  

}
//-----------------------------------------------------------------------------
// open warehouse                                    
//-----------------------------------------------------------------------------
function war_open( nmsk, opr ) {

//                             WarPanel1.setStyle("display", "block");  
//                             LbWarC.setStyle("display", "block");    
                             GridWar.setStyle("visibility","visible");

 grid_war.opr  = opr;   
 grid_war.nmsk = nmsk;   
 // price list
 grid_war.kdprs=0;
 grid_war.imprs="";
 grid_war2.opr='';

 war_top_btopen();
 
 text = "";
 in_war_itm.setControlText("");
 in_war_snm.setControlText("");
 in_war_ssn.setControlText("");
 in_war_cod.setControlText("");
 in_war_ord.setControlText("");
 
 s_records = [];
 grid_war.setCellText(s_records);
 grid_war.setRowCount(s_records.length);

 grid_war.refresh();
 grid_war.element().focus(); 
 grid_war.selectCell(0,0);

}; 
//-----------------------------------------------------------------------------
// warehouse botton open                                     
//-----------------------------------------------------------------------------
function war_top_btopen() {
    lf = 95;
	wh = 90;
	bt_close_grid_war.setStyle("display", "block"); 
	bt_search_grid_war.setStyle("display", "block"); 

	if (bt_sel_grid_war.visible==true) {
        bt_sel_grid_war.setStyle("display", "block"); 
        bt_sel_grid_war.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_sel_grid_war.setStyle("display", "none"); };    

    if (bt_price_grid_war.visible==true) {
   	    bt_price_grid_war.setStyle("display", "block"); 
        bt_price_grid_war.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_price_grid_war.setStyle("display", "none"); };    

    if (bt_sern_grid_war.visible==true) {
    	bt_sern_grid_war.setStyle("display", "block"); 
        bt_sern_grid_war.setStyle("left",lf);
        lf = lf + wh;
        }    	
    else {bt_sern_grid_war.setStyle("display", "none"); };    

    if (bt_history_grid_war.visible==true) {
        bt_history_grid_war.setStyle("display", "block"); 
        bt_history_grid_war.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_history_grid_war.setStyle("display", "none"); };    

    if (bt_opt_grid_war.visible==true) {
        bt_opt_grid_war.setStyle("display", "block"); 
        bt_opt_grid_war.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_opt_grid_war.setStyle("display", "none"); };    

/*
    if (bt_ads_grid_war.visible==true) {
        bt_ads_grid_war.setStyle("display", "block"); 
        bt_ads_grid_war.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_ads_grid_war.setStyle("display", "none"); };    
*/    
};

//-----------------------------------------------------------------------------
// grid 2 botton open                                     
//-----------------------------------------------------------------------------
function war2_top_btopen() {
    lf = 95;
	wh = 90;
	bt_close_grid_war2.setStyle("display", "block"); 

    if (bt_select_grid_war2.visible==true) {
   	    bt_select_grid_war2.setStyle("display", "block"); 
        bt_select_grid_war2.setStyle("left",lf);
        lf = lf + wh;
        }
    else {bt_select_grid_war2.setStyle("display", "none"); };    

    if (bt_search_grid_war2.visible==true) {
    	bt_search_grid_war2.setStyle("display", "block"); 
        bt_search_grid_war2.setStyle("left",lf);
        lf = lf + wh;
        }    	
    else {bt_search_grid_war2.setStyle("display", "none"); };    

    if (bt_clear_grid_war2.visible==true) {
    	bt_clear_grid_war2.setStyle("display", "block"); 
        bt_clear_grid_war2.setStyle("left",lf);
        lf = lf + wh;
        }    	
    else {bt_clear_grid_war2.setStyle("display", "none"); };    

};
//-----------------------------------------------------------------------------
// adv search close                                    
//-----------------------------------------------------------------------------
function war_ads_close() {
   WarPanel1.setStyle("display", "none");  
   LbAds.setStyle("display", "none") ;    

   BtEndAds.setStyle("display", "none") ;    
   BtSecAds.setStyle("display", "none") ;    
   BtClrAds.setStyle("display", "none") ;    

   LbItm.setStyle("display", "none") ;    
   InWarItm.setStyle("display", "none") ;    

   LbSnm.setStyle("display", "none") ;    
   InWarSnm.setStyle("display", "none") ;    

   LbSsn.setStyle("display", "none") ;    
   InWarSsn.setStyle("display", "none") ;    
   
   LbCod.setStyle("display", "none") ;    
   InWarCod.setStyle("display", "none") ;    

   LbOrd.setStyle("display", "none") ;    
   InWarOrd.setStyle("display", "none") ;    

   WarFon.setStyle("display", "none");  

};

//-----------------------------------------------------------------------------
// adv search open                                    
//-----------------------------------------------------------------------------
function war_ads_open() {
   WarPanel1.setStyle("display", "block");  
   LbAds.setStyle("display", "block") ;    

   BtEndAds.setStyle("display", "block") ;    
   BtSecAds.setStyle("display", "block") ;    
   BtClrAds.setStyle("display", "block") ;    

   LbItm.setStyle("display", "block") ;    
   InWarItm.setStyle("display", "block") ;    

   LbSnm.setStyle("display", "block") ;    
   InWarSnm.setStyle("display", "block") ;    

   LbSsn.setStyle("display", "block") ;    
   InWarSsn.setStyle("display", "block") ;    
   
   LbCod.setStyle("display", "block") ;    
   InWarCod.setStyle("display", "block") ;    

   LbOrd.setStyle("display", "block") ;    
   InWarOrd.setStyle("display", "block") ;    

   WarFon.setStyle("display", "block");  

};
//-----------------------------------------------------------------------------
// add panel close                                    
//-----------------------------------------------------------------------------
function war_add_close() {
   WarPanel1.setStyle("display", "none");  
   BtEndAdd.setStyle("display", "none") ;    
   BtAddAdd.setStyle("display", "none") ;    
   LbAdd.setStyle("display", "none") ;    
   LbAddKl.setStyle("display", "none") ;    
   InAddKl.setStyle("display", "none") ;    
   LbAddSt.setStyle("display", "none") ;    
   InAddSt.setStyle("display", "none") ;    

   WarFon.setStyle("display", "none");  
};
//-----------------------------------------------------------------------------
// add panel open                                    
//-----------------------------------------------------------------------------
function war_add_open() {
   WarPanel1.setStyle("display", "block");  
   BtEndAdd.setStyle("display", "block") ;    
   BtAddAdd.setStyle("display", "block") ;    
   LbAdd.setStyle("display", "block") ;    
   LbAddKl.setStyle("display", "block") ;    
   InAddKl.setStyle("display", "block") ;    
   LbAddSt.setStyle("display", "block") ;    
   if (in_war_add_st.visible==true) { InAddSt.setStyle("display", "block"); }
   else { InAddSt.setStyle("display", "none") ;    };

   WarFon.setStyle("display", "block");  
};
//-----------------------------------------------------------------------------
// options close                                    
//-----------------------------------------------------------------------------
function war_opt_close() {
   WarPanel1.setStyle("display", "none");  
   CheckBox.setStyle("display", "none") ;    
   CheckBox2.setStyle("display", "none") ;    
   CheckBox3.setStyle("display", "none") ;    
   LbOpt.setStyle("display", "none") ;    
   BtEndOpt.setStyle("display", "none") ;    
   WarFon.setStyle("display", "none");  

};
//-----------------------------------------------------------------------------
// options open                                     
//-----------------------------------------------------------------------------
function war_opt_open() {
   WarPanel1.setStyle("display", "block");  
   CheckBox.setStyle("display", "block") ;    
   CheckBox2.setStyle("display", "block") ;    
   CheckBox3.setStyle("display", "block") ;    
   LbOpt.setStyle("display", "block") ;    
   BtEndOpt.setStyle("display", "block") ;    
   WarFon.setStyle("display", "block");  

};

//-----------------------------------------------------------------------------
// main block 
//-----------------------------------------------------------------------------
var s_records = [];
cw =(window.innerWidth)?window.innerWidth:((document.all)?document.documentElement.offsetWidth:null);
ch =(window.innerHeight)?window.innerHeight:((document.all)?document.documentElement.offsetHeight:null);
lm = cw/4;
rp=(cw-lm)/2+lm+20;

//-----------------------------------------------------------------------------
                             var war_obj = AW.HTML.SPAN.subclass();  
                             war_obj.create = function(){  
                                  var obj = this.prototype;  
                                  var _super = this.superclass.prototype;  
      
                                  obj.init = function(argument){  
                                       _super.init.call(this);  
         
                                       obj.setStyle("position", "absolute"); 
                                       obj.setStyle("moz-user-focus","normal"); 
           
                                       obj.setStyle("background", "#bbbbbb"); 
                                       obj.setStyle("z-index", "13000"); 
    
                                       var workarea = new AW.HTML.DIV;  
                                       workarea.setContent("text", argument.toString());  
  
                                       obj.setContent("html",  workarea);         
                                  }  
                             }  

                             var war_panel = new AW.UI.Group;
                             war_panel.setId("war_panel");
                             war_panel.setSize(cw-lm-65,ch-105);
                             war_panel.setPosition(lm,50);

                             var WarPanel = new war_obj(war_panel); 
                             WarPanel.setStyle("display", "none") ;    
                             document.write(WarPanel); 

                             var war_panel1 = new AW.UI.Group;
                             war_panel1.setId("war_panel1");
                             war_panel1.setSize((cw-3*lm),ch-125);
                             war_panel1.setPosition((cw-lm)/2+lm+10,50+10);
                             war_panel1.setStyle("background", "#bbbbbb"); 
                             war_panel1.setStyle("border", "2px");

//=================================================================================================
//  options panel                                  
//=================================================================================================
                             var WarPanel1 = new war_obj(war_panel1); 
                             WarPanel1.setStyle("display", "none") ;    
                             document.write(WarPanel1); 

 	                         var cbox = new AW.UI.Checkbox ;
	                         cbox.setId("checkbox1");
  	                         cbox.setControlText("Control Date");
 	                         cbox.setControlValue(true);
                             cbox.setPosition(rp,100+30);
                             
                             var CheckBox = new war_obj(cbox); 
                             CheckBox.setStyle("display", "none") ;    
                             document.write(CheckBox); 
    
 	                         var cbox2 = new AW.UI.Checkbox ;
	                         cbox2.setId("checkbox2");
  	                         cbox2.setControlText("CHOICE WITH PRICE");
 	                         cbox2.setControlValue(false);
                             cbox2.setPosition(rp,100+60);

                             var CheckBox2 = new war_obj(cbox2); 
                             CheckBox2.setStyle("display", "none") ;    
                             document.write(CheckBox2); 

 	                         var cbox3 = new AW.UI.Checkbox ;
	                         cbox3.setId("checkbox3");
  	                         cbox3.setControlText("CURRENT STATUS");
 	                         cbox3.setControlValue(false);
                             cbox3.setPosition(rp,100+90);

                             var CheckBox3 = new war_obj(cbox3); 
                             CheckBox3.setStyle("display", "none") ;    
                             document.write(CheckBox3); 
    
                             var lb_opt = new AW.UI.Label;
                             lb_opt.setId("lb_opt");
                             lb_opt.setControlText("Options");
                             lb_opt.setStyle("font-size", "14pt");   
                             lb_opt.setStyle("text-decoration", "underline");  
                             lb_opt.setPosition(rp,50+50);
                             lb_opt.setSize(200,25);

                             var LbOpt = new war_obj(lb_opt); 
                             LbOpt.setStyle("display", "none") ;    
                             document.write(LbOpt); 

                             var bt_end_opt = new AW.UI.Button;
                             bt_end_opt.setId("bt_end_opt");
                             bt_end_opt.setControlText("End");
                             bt_end_opt.setPosition(rp,50+20);
                             bt_end_opt.setStyle("width",100);
bt_end_opt.onClick = function(){
war_opt_close(); 
};
                             var BtEndOpt = new war_obj(bt_end_opt); 
                             BtEndOpt.setStyle("display", "none") ;    
                             document.write(BtEndOpt); 

//=================================================================================================
//  options panel                                  
//=================================================================================================

                             var grid_war = new AW.UI.Grid;
                             grid_war.setId("grid_war");
                             grid_war.setCellText(s_records);
                             grid_war.setHeaderHeight(30);
                             grid_war.setRowHeight(40);
                             grid_war.setColumnCount(7);
                             grid_war.setRowCount(15);
                             grid_war.setColumnWidth(500, 0);
                             grid_war.setCellEditable(false);  
                             grid_war.setSize((cw-lm)/2,ch-125);
                             grid_war.setPosition(lm+5,50+10);

                             grid_war.getRowTemplate().setClass("text", "wrap");
                             grid_war.setCellTemplate(new AW.Templates.ImageText);

                             
                             grid_war.setSelectorVisible(true);
                             grid_war.setSelectorWidth(35);
                             grid_war.setSelectorText(function(i){return this.getRowPosition(i)+1});


grid_war.HeaderWar = ["Item", "Code", "Quantity", "Cost", "Reserved", "Company", "System Num", "DateIn"];
grid_war.ColSize   = [300, 100, 100, 100, 300, 100, 100];
grid_war.adr = {'kdim' : 0,'kd_st' : 1,'kol_tk' : 2,'sm_tk': 3, 'ko_rzs' : 4,'kdps' : 5,'nm_zpo' : 6,
                       'dt_prs' : 7 , 'kd_im': 8, 'nm_zp': 11 }
formats = [cbox.str, cbox.str, cbox.num, cbox.num, cbox.str, cbox.num, cbox.dat];
                             
grid_war.setHeaderText(grid_war.HeaderWar);
grid_war.setColumnWidth(grid_war.ColSize);
grid_war.setCellFormat(formats);
for (i = 0; i < grid_war.getRowCount(); i = i + 1) {
        if (formats[i]==cbox.num){
           grid_war.getCellTemplate(i).setStyle("text-align","right")
           }
        else   
           grid_war.getCellTemplate(i).setStyle("text-align","left");
};

//==================================================                             
grid_war.onRowClicked = function(event, rowIndex){

};
//==================================================
grid_war.onCellValidated = function(text, col, row){
};
//==================================================
grid_war.onCellSelectedChanged = function(selected, col, row){
    if (selected){
        this.setTimeout(function(){
            this.raiseEvent("editCurrentCell", {}, col, row);
        });
    };                                                                                              
};              
//=================================================================================================
//  search panel                                  
//=================================================================================================
                             var lb_war_c = new AW.UI.Label;
                             lb_war_c.setId("lb_war_c");
                             lb_war_c.setControlText("Warehouse");
                             lb_war_c.setStyle("font-size", "14pt");   
                             lb_war_c.setStyle("text-decoration", "underline");  
                             lb_war_c.setPosition(5,5);
                             lb_war_c.setSize(220,25);

                             var lb_war_p = new AW.UI.Label;
                             lb_war_p.setId("lb_war_p");
                             lb_war_p.setControlText("Price");
                             lb_war_p.setStyle("font-size", "12pt");   
                             lb_war_p.setStyle("text-decoration", "underline");  
                             lb_war_p.setPosition(5,30);
                             lb_war_p.setSize(220,25);

                             var in_war_search = new AW.UI.Input;
                             in_war_search.setId("in_war_search");
                             in_war_search.setControlText("Please,Input search term.");
                             in_war_search.setPosition(5, 60);
                             in_war_search.setSize(350,25);
        

                             var bt_search_grid_war = new AW.UI.Button;
                             bt_search_grid_war.setId("bt_search_grid_war");
                             bt_search_grid_war.setControlText("Search");
                             bt_search_grid_war.setStyle("left",365);
                             bt_search_grid_war.setStyle("top",60);
                             bt_search_grid_war.setStyle("width",90);

bt_search_grid_war.onClick = function(){
// search form warehouse
 texts = in_war_search.getControlText();
if (texts=="") {  }
else {
  docrec = grid_alldoc.getCurrentRow();  
  nm_sk = grid_alldoc.getCellValue(grid_alldoc.adr['nm_sk'], docrec);                             
  kd_ps= grid_alldoc.getCellValue(grid_alldoc.adr['kd_ps'], docrec);                             
  dt_dk = grid_alldoc.getCellValue(grid_alldoc.adr['dt_dk'], docrec);                             
  kd_op = grid_alldoc.getCellValue(grid_alldoc.adr['kd_op'], docrec);                             

  //
  rowdoc= grid_doc.getCurrentRow();	
  imtb = in_war_search.getControlText();            
  ser  = 0;
  kdst ='';
  zak  ='';
  nmzpo=0;
  nm_zp=0; 
  cnsk = cbox.flag;
  //cnsk = true;
  
  s_records = pipe.event({action:'seek_war', nm_sk: nm_sk, imtb: imtb, nmzpo: nmzpo, 
                          ser: ser, kdst: kdst, zak: zak, kd_ps: kd_ps, dt_dk: dt_dk,
                          kd_op: kd_op, cnsk: cnsk,  nm_zp: nm_zp } ,true); 

  grid_war.setCellText(s_records);
  grid_war.setRowCount(s_records.length);
  
  if (s_records.length==0) { alert('No found recorsd'); };
  
  grid_war.refresh();
  grid_war.element().focus(); 
  grid_war.selectCell(0,0);
	
};
};
//===============================
                             var bt_ads_grid_war = new AW.UI.Button;
                             bt_ads_grid_war.setId("bt_ads_grid_war");
                             bt_ads_grid_war.setControlText("Adv search");
                             bt_ads_grid_war.setStyle("left",455);
                             bt_ads_grid_war.setStyle("top",60);
                             bt_ads_grid_war.setStyle("width",90);
bt_ads_grid_war.onClick = function(){
  war_ads_open();
};
//=================================================================================================
//  adv search panel                                  
//=================================================================================================
//var lb_ads = new my_button('lb_ads').write();
//var LbAds = new war_obj(lb_ads); 
						     var lb_ads = new AW.UI.Label;
                             lb_ads.setId("lb_ads");
                             lb_ads.setControlText("Advanced Search: ");
                             lb_ads.setStyle("font-size", "14pt");   
                             lb_ads.setStyle("text-decoration", "underline");  
                             lb_ads.setPosition(rp,50+50);
                             lb_ads.setSize(200,25);
                             var LbAds = new war_obj(lb_ads); 
                             LbAds.setStyle("display", "none") ;    
                             document.write(LbAds); 
                             
                             var bt_end_ads = new AW.UI.Button;
                             bt_end_ads.setId("bt_end_ads");
                             bt_end_ads.setControlText("End");
                             bt_end_ads.setPosition(rp,50+20);
                             bt_end_ads.setStyle("width",90);
                             var BtEndAds = new war_obj(bt_end_ads); 
                             BtEndAds.setStyle("display", "none") ;    
                             document.write(BtEndAds); 
bt_end_ads.onClick = function(){
war_ads_close(); 
};
                             var bt_sec_ads = new AW.UI.Button;
                             bt_sec_ads.setId("bt_sec_ads");
                             bt_sec_ads.setControlText("Search");
                             bt_sec_ads.setPosition(rp+90,50+20);
                             bt_sec_ads.setStyle("width",90);
                             var BtSecAds = new war_obj(bt_sec_ads); 
                             BtSecAds.setStyle("display", "none") ;    
                             document.write(BtSecAds); 
bt_sec_ads.onClick = function(){
 // search form warehouse
 imtb = in_war_itm.getControlText();
 ser  = in_war_ssn.getControlText();
 kdst = in_war_cod.getControlText();
 zak  = in_war_ord.getControlText();
 nmzpo = in_war_snm.getControlText();
 nm_zp = 0;

 if ((imtb>'') | (ser>'') | (kdst>'') | (zak>'') | (nmzpo>'') )  {
	
  docrec = grid_alldoc.getCurrentRow();  
  nm_sk  = grid_alldoc.getCellValue(grid_alldoc.adr['nm_sk'], docrec);                             
  kd_ps  = grid_alldoc.getCellValue(grid_alldoc.adr['kd_ps'], docrec);                             
  dt_dk  = grid_alldoc.getCellValue(grid_alldoc.adr['dt_dk'], docrec);                             
  kd_op  = grid_alldoc.getCellValue(grid_alldoc.adr['kd_op'], docrec);                             

  //
  rowdoc= grid_doc.getCurrentRow();	
  cnsk = cbox.flag;
  //cnsk = true;
  
  s_records = pipe.event({action:'seek_war', nm_sk: nm_sk, imtb: imtb, nmzpo: nmzpo, 
                          ser: ser, kdst: kdst, zak: zak, kd_ps: kd_ps, dt_dk: dt_dk,
                          kd_op: kd_op, cnsk: cnsk,  nm_zp: nm_zp } ,true); 

  if (s_records.length==0) { alert('No found records'); };

  grid_war.setCellText(s_records);
  grid_war.setRowCount(s_records.length);

  grid_war.refresh();
  grid_war.element().focus(); 
  grid_war.selectCell(0,0);
  war_ads_close(); 
  };
};
                             var bt_clr_ads = new AW.UI.Button;
                             bt_clr_ads.setId("bt_clr_ads");
                             bt_clr_ads.setControlText("Clear");
                             bt_clr_ads.setPosition(rp+180,50+20);
                             bt_clr_ads.setStyle("width",90);
                             var BtClrAds = new war_obj(bt_clr_ads); 
                             BtClrAds.setStyle("display", "none") ;    
                             document.write(BtClrAds); 
bt_clr_ads.onClick = function(){
   in_war_itm.setControlText("");
   in_war_snm.setControlText("");
   in_war_ssn.setControlText("");
   in_war_cod.setControlText("");
   in_war_ord.setControlText("");
};
//===========================
                             var lb_itm = new AW.UI.Label;
                             lb_itm.setId("lb_itm");
                             lb_itm.setControlText("Item Name: ");
                             lb_itm.setStyle("font-size", "14pt");   
                             lb_itm.setStyle("text-decoration", "underline");  
                             lb_itm.setPosition(rp,100+30);
                             var LbItm = new war_obj(lb_itm); 
                             LbItm.setStyle("display", "none") ;    
                             document.write(LbItm); 
                             
                             var in_war_itm = new AW.UI.Input;
                             in_war_itm.setId("in_war_itm");
                             in_war_itm.setControlText("");
                             in_war_itm.setPosition(rp,100+60);
                             in_war_itm.setSize(350,25);
                             var InWarItm = new war_obj(in_war_itm); 
                             InWarItm.setStyle("display", "none") ;    
                             document.write(InWarItm); 
//========================
                             var lb_snm = new AW.UI.Label;
                             lb_snm.setId("lb_snm");
                             lb_snm.setControlText("Serial Number: ");
                             lb_snm.setStyle("font-size", "14pt");   
                             lb_snm.setStyle("text-decoration", "underline");  
                             lb_snm.setPosition(rp,100+90);
                             var LbSnm = new war_obj(lb_snm); 
                             LbSnm.setStyle("display", "none") ;    
                             document.write(LbSnm); 
                             
                             var in_war_snm = new AW.UI.Input;
                             in_war_snm.setId("in_war_snm");
                             in_war_snm.setControlText("");
                             in_war_snm.setPosition(rp,100+120);
                             in_war_snm.setSize(350,25);
                             var InWarSnm = new war_obj(in_war_snm); 
                             InWarSnm.setStyle("display", "none") ;    
                             document.write(InWarSnm); 
//========================
                             var lb_ssn = new AW.UI.Label;
                             lb_ssn.setId("lb_ssn");
                             lb_ssn.setControlText("System Number: ");
                             lb_ssn.setStyle("font-size", "14pt");   
                             lb_ssn.setStyle("text-decoration", "underline");  
                             lb_ssn.setPosition(rp,100+150);
                             var LbSsn = new war_obj(lb_ssn); 
                             LbSsn.setStyle("display", "none") ;    
                             document.write(LbSsn); 
                             
                             var in_war_ssn = new AW.UI.Input;
                             in_war_ssn.setId("in_war_ssn");
                             in_war_ssn.setControlText("");
                             in_war_ssn.setPosition(rp,100+180);
                             in_war_ssn.setSize(350,25);
                             var InWarSsn = new war_obj(in_war_ssn); 
                             InWarSsn.setStyle("display", "none") ;    
                             document.write(InWarSsn); 
//========================
                             var lb_cod = new AW.UI.Label;
                             lb_cod.setId("lb_cod");
                             lb_cod.setControlText("Code:  ");
                             lb_cod.setStyle("font-size", "14pt");   
                             lb_cod.setStyle("text-decoration", "underline");  
                             lb_cod.setPosition(rp,100+210);
                             var LbCod = new war_obj(lb_cod); 
                             LbCod.setStyle("display", "none") ;    
                             document.write(LbCod); 
                             
                             var in_war_cod = new AW.UI.Input;
                             in_war_cod.setId("in_war_cod");
                             in_war_cod.setControlText("");
                             in_war_cod.setPosition(rp,100+240);
                             in_war_cod.setSize(350,25);
                             var InWarCod = new war_obj(in_war_cod); 
                             InWarCod.setStyle("display", "none") ;    
                             document.write(InWarCod); 
//========================
                             var lb_ord = new AW.UI.Label;
                             lb_ord.setId("lb_ord");
                             lb_ord.setControlText("Order: ");
                             lb_ord.setStyle("font-size", "14pt");   
                             lb_ord.setStyle("text-decoration", "underline");  
                             lb_ord.setPosition(rp,100+270);
                             var LbOrd = new war_obj(lb_ord); 
                             LbOrd.setStyle("display", "none") ;    
                             document.write(LbOrd); 
                             
                             var in_war_ord = new AW.UI.Input;
                             in_war_ord.setId("in_war_ord");
                             in_war_ord.setControlText("");
                             in_war_ord.setPosition(rp,100+300);
                             in_war_ord.setSize(350,25);
                             var InWarOrd = new war_obj(in_war_ord); 
                             InWarOrd.setStyle("display", "none") ;    
                             document.write(InWarOrd); 
//=================================================================================================
//  select panel                                  
//=================================================================================================
                             var bt_end_add = new AW.UI.Button;
                             bt_end_add.setId("bt_end_add");
                             bt_end_add.setControlText("End");
                             bt_end_add.setPosition(rp,50+20);
                             bt_end_add.setStyle("width",90);
                             var BtEndAdd = new war_obj(bt_end_add); 
                             BtEndAdd.setStyle("display", "none") ;    
                             document.write(BtEndAdd); 
bt_end_add.onClick = function(){
war_add_close(); 
};
                             var bt_add_add = new AW.UI.Button;
                             bt_add_add.setId("bt_add_ads");
                             bt_add_add.setControlText("Add");
                             bt_add_add.setPosition(rp+90,50+20);
                             bt_add_add.setStyle("width",90);
                             var BtAddAdd = new war_obj(bt_add_add); 
                             BtAddAdd.setStyle("display", "none") ;    
                             document.write(BtAddAdd); 
bt_add_add.onClick = function(){

};
//===========================
						     var lb_add = new AW.UI.Label;
                             lb_add.setId("lb_add");
                             lb_add.setControlText("Add items to document: ");
                             lb_add.setStyle("font-size", "14pt");   
                             lb_add.setStyle("text-decoration", "underline");  
                             lb_add.setPosition(rp,50+50);
                             lb_add.setSize(350,25);
                             var LbAdd = new war_obj(lb_add); 
                             LbAdd.setStyle("display", "none") ;    
                             document.write(LbAdd); 
//==========================
                             var lb_war_add_kl = new AW.UI.Label;
                             lb_war_add_kl.setId("lb_war_add_kl");
                             lb_war_add_kl.setControlText("Quantity: ");
                             lb_war_add_kl.setPosition(rp,100+30);
                             lb_war_add_kl.setStyle("font-size", "14pt");   
                             lb_war_add_kl.setStyle("text-decoration", "underline");  
                             lb_war_add_kl.setSize(200,25);
                             var LbAddKl = new war_obj(lb_war_add_kl); 
                             LbAddKl.setStyle("display", "none") ;    
                             document.write(LbAddKl); 

                             var in_war_add_kl = new AW.UI.Input;
                             in_war_add_kl.setId("in_war_add_kl");
                             in_war_add_kl.setControlText("");
                             in_war_add_kl.setPosition(rp, 100+60);
                             in_war_add_kl.setSize(200,25);
                             var InAddKl = new war_obj(in_war_add_kl); 
                             InAddKl.setStyle("display", "none") ;    
                             document.write(InAddKl); 
//===========================
                             var lb_war_add_st = new AW.UI.Label;
                             lb_war_add_st.setId("lb_war_add_st");
                             lb_war_add_st.setControlText("Price:");
                             lb_war_add_st.setStyle("font-size", "14pt");   
                             lb_war_add_st.setStyle("text-decoration", "underline");  
                             lb_war_add_st.setPosition(rp,100+90);
                             lb_war_add_st.setSize(200,25);
                             var LbAddSt = new war_obj(lb_war_add_st); 
                             LbAddSt.setStyle("display", "none") ;    
                             document.write(LbAddSt); 

                             var in_war_add_st = new AW.UI.Input;
                             in_war_add_st.setId("in_war_add_st");
                             in_war_add_st.setControlText("");
                             in_war_add_st.setPosition(rp,100+120);
                             in_war_add_st.setSize(200,25);
                             in_war_add_st.visible=true;

                             var InAddSt = new war_obj(in_war_add_st); 
                             InAddSt.setStyle("display", "none") ;    
                             document.write(InAddSt); 
//=================================================================================================
//  functional panel                                  
//=================================================================================================
                             var bt_close_grid_war = new AW.UI.Button;
                             bt_close_grid_war.setId("bt_close_grid_war");
                             bt_close_grid_war.setControlText("Close");
                             bt_close_grid_war.setStyle("left",5);
                             bt_close_grid_war.setStyle("top",95);
                             bt_close_grid_war.setStyle("width",90);
bt_close_grid_war.onClick = function(){
 war_close();  
};
                             var bt_price_grid_war = new AW.UI.Button;
                             bt_price_grid_war.setId("bt_price_grid_war");
                             bt_price_grid_war.setControlText("Price");
                             bt_price_grid_war.setStyle("left",95);
                             bt_price_grid_war.setStyle("top",95);
                             bt_price_grid_war.setStyle("width",90);
                             bt_price_grid_war.visible=true;
bt_price_grid_war.onClick = function(){
  // view price list 	
  grid_war2.opr='price';
  lb_war2_title.setControlText("Select Price-List: ");
  lb_war2_title2.setControlText("");
  WarFon.setStyle("display", "block");  
  grid_war2.HeaderWar = ["Price list name", "Company", "Date"];
  grid_war2.ColSize   = [300, 300, 100];
  grid_war2.adr = {'imprs' : 0,'kdps' : 1,'dt_prs' : 2,'kd_ps' : 3,'kd_prs' : 4 };

  s_records2 = pipe.event({action:'get_price', kdps: 0 } ,true); 

  grid_war2.setHeaderData(grid_war2.HeaderWar);
  grid_war2.setColumnWidth(grid_war2.ColSize);
  grid_war2.setCellText(s_records2);
  grid_war2.setRowCount(s_records2.length);
  grid_war2.setColumnCount(3);

  grid_war2.refresh();
  grid_war2.element().focus(); 
  grid_war2.selectCell(0,0);

  bt_search_grid_war2.visible=false;
  
  war2_top_btopen();
  
  GridWar2.setStyle("visibility","visible");
};
//============================
                             var bt_sern_grid_war = new AW.UI.Button;
                             bt_sern_grid_war.setId("bt_sern_grid_war");
                             bt_sern_grid_war.setControlText("Ser.Nom");
                             bt_sern_grid_war.setStyle("left",185);
                             bt_sern_grid_war.setStyle("top",95);
                             bt_sern_grid_war.setStyle("width",90);
                             bt_sern_grid_war.visible=true;
bt_sern_grid_war.onClick = function(){
  // view serial number	
  grid_war2.opr='sernum';
  lb_war2_title.setControlText("Select Serial Number: ");
  lb_war2_title2.setControlText("");
  WarFon.setStyle("display", "block");  
  //
  grid_war2.HeaderWar = ["Serial Number"];
  grid_war2.ColSize   = [300];
  grid_war2.adr = {'nm_ser' : 0,'nm_zp' : 1};
  grid_war2.setColumnCount(1);

  grid_war2.setHeaderText(grid_war2.HeaderWar);
  grid_war2.setColumnWidth(grid_war2.ColSize);
  
  // read nm_zpo 
  rows = grid_war.getCurrentRow();	
  names= grid_war.getCellValue(grid_war.adr['kdim'], rows);            
  nmzpo = grid_doc.getCellValue(grid_war.adr['nm_zpo'], rows);               
  
  if ((names=="")|(nmzpo==0)) { 
  	 alert('NO SELECT RECORD'); 
     WarFon.setStyle("display", "none");  
     } 
  else {
         // read sernum
         s_records2 = pipe.event({action:'get_sernum', nmzpr: 0, nmzpo: nmzpo, kdus: cbox.kdus },true);
         if (s_records2.length==0) {
  	        alert('NO SERIAL NUMBER'); 
            WarFon.setStyle("display", "none");  
            }
         else {          
            grid_war2.setCellText(s_records2);
            grid_war2.setRowCount(s_records2.length);

            grid_war2.selectCell(0,0);
            grid_war2.refresh();

            bt_search_grid_war2.visible=false;
            bt_clear_grid_war2.visible=false;
            war2_top_btopen();
  
            GridWar2.setStyle("visibility","visible");
        };
  };   
};
                             var bt_history_grid_war = new AW.UI.Button;
                             bt_history_grid_war.setId("bt_history_grid_war");
                             bt_history_grid_war.setControlText("History");
                             bt_history_grid_war.setStyle("left",275);
                             bt_history_grid_war.setStyle("top",95);
                             bt_history_grid_war.setStyle("width",90);
                             bt_history_grid_war.visible=true;

bt_history_grid_war.onClick = function(){
  // view history 	
  rows = grid_war.getCurrentRow();	
  kd_im = grid_war.getCellValue(grid_war.adr['kd_im'], rows);            
  kdim  = grid_war.getCellValue(grid_war.adr['kdim'], rows);            
  his_open(kdim,kd_im);
};
//===========================
                             var bt_opt_grid_war = new AW.UI.Button;
                             bt_opt_grid_war.setId("bt_opt_grid_war");
                             bt_opt_grid_war.setControlText("Options");
                             bt_opt_grid_war.setStyle("left",365);
                             bt_opt_grid_war.setStyle("top",95);
                             bt_opt_grid_war.setStyle("width",90);
                             bt_opt_grid_war.visible=true;
bt_opt_grid_war.onClick = function(){
war_opt_open(); 
};
                             var bt_sel_grid_war = new AW.UI.Button;
                             bt_sel_grid_war.setId("bt_sel_grid_war");
                             bt_sel_grid_war.setControlText("Select");
                             bt_sel_grid_war.setStyle("left",455);
                             bt_sel_grid_war.setStyle("top",95);
                             bt_sel_grid_war.setStyle("width",90);
                             bt_sel_grid_war.visible=true;
bt_sel_grid_war.onClick = function(){
  //  
  rows  = grid_war.getCurrentRow();	
  names = grid_war.getCellValue(grid_war.adr['kdim'], rows);            
  nmzpo = grid_doc.getCellValue(grid_war.adr['nm_zpo'], rows);               
  kd_st = grid_war.getCellValue(grid_war.adr['kd_st'], rows);            
  kd_im = grid_war.getCellValue(grid_war.adr['kd_im'], rows);            
  kdim  = grid_war.getCellValue(grid_war.adr['kdim'], rows);            
  koltk = grid_war.getCellValue(grid_war.adr['kol_tk'], rows);            
  nmzp  = grid_war.getCellValue(grid_war.adr['nm_zp'], rows);            
  //
  inn = grid_alldoc.getCurrentRow();  
  kd_ps = grid_alldoc.getCellValue(grid_alldoc.adr['kd_ps'], inn);                             
  pr_ch = grid_alldoc.getCellValue(grid_alldoc.adr['pr_ch'], inn);                             

  
  
  if ((names=="")|(nmzpo==0)) { 
  	 alert('NO SELECT RECORD'); 
     WarFon.setStyle("display", "none");  
     } 
  else {
    lb_add.setControlText(kdim);
    lb_war_add_kl.setControlText("Quantity: "+number_format(koltk,2,'.'));
    in_war_add_kl.setControlText(1);
    // price
    sttk=0;
    sttk = pipe.event({action:'get_cost', kd_im: kd_im, kd_st: kd_st, nm_zpo: nmzpo, kdprs: grid_war.kdprs, 
           kd_ps: kd_ps, pr_ch: pr_ch, nm_zps: nmzp },true);
    if (sttk>0) {
       in_war_add_kl.setControlText(sttk);
       }
    else {
       in_war_add_kl.setControlText("");
    }
    if (sttk>0) {
        lb_war_add_st.setControlText("Price: "+sttk);
    }
    else {
        lb_war_add_st.setControlText("Price:");
    }
    if (cbox2.flag==true) {
        in_war_add_st.visible=true;
    }
    else {
        in_war_add_st.visible=false;
    }

    war_add_open(); 
  };
};
//=================================================================================================
//  toollbar                                  
//=================================================================================================
                             var toolbar1_grid_war = new AW.HTML.DIV;
                             toolbar1_grid_war.setContent("label1", function(){return lb_war_c});
                             toolbar1_grid_war.setContent("label2", function(){return lb_war_p});
                             toolbar1_grid_war.setContent("input1", function(){return in_war_search});

                             toolbar1_grid_war.setContent("button1", function(){return bt_search_grid_war});
                             toolbar1_grid_war.setContent("button2", function(){return bt_ads_grid_war});

                             toolbar1_grid_war.setContent("button3", function(){return bt_close_grid_war});
                             toolbar1_grid_war.setContent("button4", function(){return bt_sern_grid_war});
                             toolbar1_grid_war.setContent("button5", function(){return bt_opt_grid_war});
                             toolbar1_grid_war.setContent("button6", function(){return bt_price_grid_war});
                             toolbar1_grid_war.setContent("button7", function(){return bt_history_grid_war});
                             toolbar1_grid_war.setContent("button8", function(){return bt_sel_grid_war});

                             var toolbar2_grid_war = new AW.HTML.DIV;
//                             toolbar2_grid_war.setContent("label21", function(){return lb_war_add_item});
//                             toolbar2_grid_war.setContent("label22", function(){return lb_war_add_item2});
//                             toolbar2_grid_war.setContent("label23", function(){return lb_war_add_kl});
//                             toolbar2_grid_war.setContent("input21", function(){return in_war_add_kl});
//                             toolbar2_grid_war.setContent("label24", function(){return lb_war_add_st});
//                             toolbar2_grid_war.setContent("input22", function(){return in_war_add_st});

//                             toolbar2_grid_war.setContent("button15", function(){return bt_add_grid_war});


                             grid_war.defineTemplate("toolbar1", toolbar1_grid_war);
                             grid_war.defineTemplate("toolbar2", toolbar2_grid_war);
                             grid_war.setLayoutTemplate(new AW.Panels.Horizontal);

                             grid_war.setPanelTemplate(function(i){
                                  switch(i){
                                     case "top":     return this.getToolbar1Template();
                                     case "center":  return this.getScrollTemplate();
                                     case "bottom":  return this.getToolbar2Template();
                                  };                    
                            });

                            grid_war.onPanelWidthChanged = function(width, panel){
                                 this.getLayoutTemplate().changePanelWidth(width, panel);
                            };
                            grid_war.onPanelHeightChanged = function(height, panel){
                                 this.getLayoutTemplate().changePanelHeight(height, panel);
                            };

                            grid_war.setPanelHeight(120, "top"); 
                            grid_war.setPanelHeight(5, "bottom"); 

                            var GridWar = new war_obj(grid_war); 
                            GridWar.setStyle("visibility","hidden");
                            document.write(GridWar);
//=================================================================================================
//  second panel                                  
//=================================================================================================
                             var WarHeader2= ["Item","Code","Quantity","Reserved","Company","System N","DateIn"];

                             var grid_war2 = new AW.UI.Grid;
                             grid_war2.setId("grid_war2");
                             grid_war2.setCellText(s_records);
                             grid_war2.setHeaderText(WarHeader2);
                             grid_war2.setHeaderHeight(30);
                             grid_war2.setRowHeight(40);
                             grid_war2.setColumnCount(7);
                             grid_war2.setRowCount(15);
                             grid_war2.setColumnWidth(500, 0);
                             grid_war2.setCellEditable(false);  
                             grid_war2.setSize((cw-lm)/2,ch-125);
                             grid_war2.setPosition(lm+5,50+10);
                             
                             grid_war2.getRowTemplate().setClass("text", "wrap");
                             grid_war2.setCellTemplate(new AW.Templates.ImageText);


                             grid_war2.setSize((cw-lm)/2-100,ch-125);
                             grid_war2.setPosition((cw-lm)/2+lm+10,50+10);
  
                             
                             grid_war2.setSelectorVisible(true);
                             grid_war2.setSelectorWidth(35);
                             grid_war2.setSelectorText(function(i){return this.getRowPosition(i)+1});
                             // information
                             grid_war.kdprs=0;
                             grid_war.imprs="";
                             
grid_war2.onRowClicked = function(event, rowIndex){

};
                             var lb_war2_title = new AW.UI.Label;
                             lb_war2_title.setId("lb_war2_title");
                             lb_war2_title.setControlText("Title: ");
                             lb_war2_title.setPosition(5,5);
                             //lb_war2_title.setSize(80,25);

                             var lb_war2_title2 = new AW.UI.Label;
                             lb_war2_title2.setId("lb_war2_title2");
                             lb_war2_title2.setControlText("nnn ");
                             lb_war2_title2.setPosition(5,35);

                             var bt_close_grid_war2 = new AW.UI.Button;
                             bt_close_grid_war2.setId("bt_close_grid_war2");
                             bt_close_grid_war2.setControlText("Close");
                             bt_close_grid_war2.setStyle("left",5);
                             bt_close_grid_war2.setStyle("top",65);
                             bt_close_grid_war2.setStyle("width",90);
//============================
bt_close_grid_war2.onClick = function(){
  grid_war2.setPanelHeight(5, "bottom"); 
  GridWar2.setStyle("visibility","hidden");
  WarFon.setStyle("display", "none");  
};
//============================
                             var bt_select_grid_war2 = new AW.UI.Button;
                             bt_select_grid_war2.setId("bt_select_grid_war2");
                             bt_select_grid_war2.setControlText("Select");
                             bt_select_grid_war2.setStyle("left",95);
                             bt_select_grid_war2.setStyle("top",65);
                             bt_select_grid_war2.setStyle("width",90);
                             bt_select_grid_war2.visible=true;
//============================
bt_select_grid_war2.onClick = function(){
 if (grid_war2.opr=='price') {
    if (grid_war2.getRowCount()>0) {
 	   war2rec = grid_war2.getCurrentRow();  
       grid_war.kdprs = grid_war2.getCellValue(grid_war2.adr['kd_prs'], war2rec);                             
       grid_war.imprs = grid_war2.getCellValue(grid_war2.adr['imprs'], war2rec);                             
       lb_war_p.setControlText("Price: "+grid_war.imprs);
    };
 };

 GridWar2.setStyle("visibility","hidden"); 
 WarFon.setStyle("display", "none");  
};
//============================                            
                             var bt_search_grid_war2 = new AW.UI.Button;
                             bt_search_grid_war2.setId("bt_search_grid_war2");
                             bt_search_grid_war2.setControlText("Search");
                             bt_search_grid_war2.setStyle("left",185);
                             bt_search_grid_war2.setStyle("top",65);
                             bt_search_grid_war2.setStyle("width",90);
                             bt_search_grid_war2.visible=true;
//============================
bt_search_grid_war2.onClick = function(){
 //mes_war_open(); 
};
//============================
                             var bt_clear_grid_war2 = new AW.UI.Button;
                             bt_clear_grid_war2.setId("bt_clear_grid_war2");
                             bt_clear_grid_war2.setControlText("Clear");
                             bt_clear_grid_war2.setStyle("left",275);
                             bt_clear_grid_war2.setStyle("top",65);
                             bt_clear_grid_war2.setStyle("width",90);
                             bt_clear_grid_war2.visible=true;
//============================                             
bt_clear_grid_war2.onClick = function(){
 if (grid_war2.opr=='price') {
    grid_war.kdprs = 0;                             
    grid_war.imprs = "";                             
    lb_war_p.setControlText("Price: ");
 };
GridWar2.setStyle("visibility","hidden");
WarFon.setStyle("display", "none");  
};
//=================================================================================================
//  botton war2                                  
//=================================================================================================

                             var toolbar1_grid_war2 = new AW.HTML.DIV;
                             toolbar1_grid_war2.setContent("label1", function(){return lb_war2_title});
                             toolbar1_grid_war2.setContent("label2", function(){return lb_war2_title2});
                             toolbar1_grid_war2.setContent("button1", function(){return bt_close_grid_war2});
                             toolbar1_grid_war2.setContent("button2", function(){return bt_select_grid_war2});
                             toolbar1_grid_war2.setContent("button3", function(){return bt_search_grid_war2});
                             toolbar1_grid_war2.setContent("button4", function(){return bt_clear_grid_war2});

                             var toolbar2_grid_war2 = new AW.HTML.DIV;

                             grid_war2.defineTemplate("toolbar1", toolbar1_grid_war2);
                             grid_war2.defineTemplate("toolbar2", toolbar2_grid_war2);
                             grid_war2.setLayoutTemplate(new AW.Panels.Horizontal);

                             grid_war2.setPanelTemplate(function(i){
                                  switch(i){
                                     case "top":     return this.getToolbar1Template();
                                     case "center":  return this.getScrollTemplate();
                                     case "bottom":  return this.getToolbar2Template();
                                  };                    
                            });

                            grid_war2.onPanelWidthChanged = function(width, panel){
                                 this.getLayoutTemplate().changePanelWidth(width, panel);
                            };
                            grid_war2.onPanelHeightChanged = function(height, panel){
                                 this.getLayoutTemplate().changePanelHeight(height, panel);
                            };

                            grid_war2.setPanelHeight(90, "top"); 
                            grid_war2.setPanelHeight(5, "bottom"); 

                            var GridWar2 = new war_obj(grid_war2); 
                            GridWar2.setStyle("visibility","hidden");
                            document.write(GridWar2);
//=================================================================================================
//  fon panel                                  
//=================================================================================================
                            var war_fon = new AW.UI.Group;
                            war_fon.setId("war_fon");
                            war_fon.setSize((cw-lm)/2,ch-125);
                            war_fon.setPosition(lm+5,50+10);
                            war_fon.setStyle("background", "#eee");
                            war_fon.setStyle("filter","alpha(opacity=60)");
                            war_fon.setStyle("opacity","0.6");
                            var WarFon = new war_obj(war_fon); 
                            WarFon.setStyle("display", "none") ;    
                            document.write(WarFon); 

//-----------------------------------------------------------------------------
//  
//-----------------------------------------------------------------------------