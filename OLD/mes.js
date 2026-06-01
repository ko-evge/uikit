//-----------------------------------------------------------------------------
//  message  
//-----------------------------------------------------------------------------
function mes_close() {
   MesFon.setStyle("display", "none");  
   MesPanel.setStyle("display", "none");  
   MesLb1.setStyle("display", "none");  
   MesLb2.setStyle("display", "none");  
   MesCancel.setStyle("display", "none") ;    
   MesOk.setStyle("display", "none") ;    
   mes_panel.flag=true;   
   if (mes_panel.opr=='deldoc') { alldoc_btopen(); };
   
}
//-----------------------------------------------------------------------------
// close                                   
//-----------------------------------------------------------------------------
function mes_open(line1,line2,opr,msd) {
// 
   if (opr=='deldoc') { alldoc_btclose(); };

   mes_lb1.setControlText(line1);
   mes_lb2.setControlText(line2);
   mes_panel.opr = opr;
   mes_panel.msd = msd;
   mes_panel.flag=true;
   // 
   MesFon.setStyle("display", "block");  
   MesPanel.setStyle("display", "block");  
   MesLb1.setStyle("display", "block");  
   MesLb2.setStyle("display", "block");  
   MesCancel.setStyle("display", "block") ;    
   MesOk.setStyle("display", "block") ;    
}; 
//-----------------------------------------------------------------------------
//  message panel
//-----------------------------------------------------------------------------

cw =(window.innerWidth)?window.innerWidth:((document.all)?document.documentElement.offsetWidth:null);
ch =(window.innerHeight)?window.innerHeight:((document.all)?document.documentElement.offsetHeight:null);

                             var mes_obj = AW.HTML.SPAN.subclass();  
                             mes_obj.create = function(){  
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
//=================================================================================================
                             var mes_fon = new AW.UI.Group;
                             mes_fon.setId("mes_fon");
                             mes_fon.setPosition(10,50);
                             mes_fon.setSize(cw-75,ch-105); 
                             mes_fon.setStyle("background", "#eeeeee");
                             mes_fon.setStyle("filter","alpha(opacity=60)");
                             mes_fon.setStyle("opacity","0.6");
                             var MesFon = new mes_obj(mes_fon); 
                             MesFon.setStyle("display", "none") ;    
                             document.write(MesFon); 
//=================================================================================================                             
                             var mes_panel = new AW.UI.Group;
                             mes_panel.setId("mes_panel");
                             lm = (cw - 600) / 2;
                             mes_panel.setPosition(lm,100);
                             mes_panel.setSize(600,200); 
                             var MesPanel = new mes_obj(mes_panel); 
                             MesPanel.setStyle("display", "none") ;    
                             document.write(MesPanel); 
mes_panel.flag=true;
                             var mes_lb1 = new AW.UI.Label;
                             mes_lb1.setId("mes_lb1");
                             mes_lb1.setControlText("Line 1");
                             mes_lb1.setStyle("font-size", "14pt");   
                             //mes_lb1.setStyle("text-decoration", "underline");   
                             mes_lb1.setStyle("text-align", "center");   
                             mes_lb1.setPosition(lm+5,140);
                             mes_lb1.setSize(590,26);   
                             var MesLb1 = new mes_obj(mes_lb1); 
                             MesLb1.setStyle("display", "none") ;    
                             document.write(MesLb1); 
                             
                             var mes_lb2 = new AW.UI.Label;
                             mes_lb2.setId("mes_lb2");
                             mes_lb2.setControlText("Line 2");
                             mes_lb2.setStyle("font-size", "14pt");   
                             //mes_lb2.setStyle("text-decoration", "underline");   
                             mes_lb2.setStyle("text-align", "center");   
                             mes_lb2.setControlImage([""]);
                             mes_lb2.setSize(590,26);   
                             mes_lb2.setPosition(lm+5,180);
                             var MesLb2 = new mes_obj(mes_lb2);
                             MesLb2.setStyle("display", "none") ;    
                             document.write(MesLb2); 
                             
                             var mes_ok = new AW.UI.Button;
                             mes_ok.setId("mes_ok");
                             mes_ok.setControlText("Ok");
                             mes_ok.setPosition(lm+200,240);
                             mes_ok.setSize(90,26);   
                             var MesOk = new mes_obj(mes_ok);
                             MesOk.setStyle("display", "none") ;    
                             document.write(MesOk); 
mes_ok.onClick = function(){
// operation
if (mes_panel.flag==true) {
   mes_panel.flag=false;
   // =============================================================================================
   if (mes_panel.opr=='deldoc') {
      result =[];
      nmzp = mes_panel.msd['nrecord']; 
      // delete document
      result = pipe.event({action: 'deldoc', nrecord: nmzp, kdus: cbox.kdus},true);
      // read all documents
      ar_records_alldoc = pipe.event({action:'get_alldoc', kdus: cbox.kdus },true);
      grid_alldoc.setCellText(ar_records_alldoc);
      grid_alldoc.setRowCount(ar_records_alldoc.length);
      grid_alldoc.count = ar_records_alldoc.length;
      grid_alldoc.element().focus(); 
      grid_alldoc.selectCell(2,0);
      grid_alldoc.refresh();
      //
      mes_close();     
   };
   // delete taxes ================================================================================ 
   if (mes_panel.opr=='deltaxe') {
      nmzp = mes_panel.msd['nrecord']; 
   	  kod  = pipe.event({action: 'delete_record', file: 'ms_sum', nmzp: nmzp, kdus: cbox.kdus },true);
      mes_close();     
      records2 = pipe.event({action:'get_sum', nmzp: doc_panel.nmzp, prsum: 1, kdus: cbox.kdus },true);
   };
   // delete services
   if (mes_panel.opr=='delservice') {
      nmzp = mes_panel.msd['nrecord']; 
   	  kod  = pipe.event({action: 'delete_record', file: 'ms_sum', nmzp: nmzp, kdus: cbox.kdus },true);
      mes_close();     
      records2 = pipe.event({action:'get_sum', nmzp: doc_panel.nmzp, prsum: 0, kdus: cbox.kdus },true);
   };
   // delete executors
   if (mes_panel.opr=='delexecutor') {
      nmzp = mes_panel.msd['nrecord']; 
   	  kod  = pipe.event({action: 'delete_record', file: 'ms_rab', nmzp: nmzp, kdus: cbox.kdus },true);
      mes_close();     
      //
      records2 = pipe.event({action:'get_rab', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
   };
   // delete sernum
   if (mes_panel.opr=='delsernum') {
      nmzp = mes_panel.msd['nrecord']; 
      rowr   = grid_doc.getCurrentRow();	
      nmzpr  = grid_doc.getCellValue(doc_panel.adr['nm_zp'], rowr);      
      //
   	  kod  = pipe.event({action: 'delete_record', file: 'ms_ser', nmzp: nmzp, kdus: cbox.kdus },true);
      mes_close();     
      records2 = pipe.event({action:'get_sernum', nmzpr: nmzpr, kdus: cbox.kdus },true);
   };
   // delete product
   if (mes_panel.opr=='delproduct') {
      nmzp = mes_panel.msd['nrecord']; 
      rowr   = grid_doc.getCurrentRow();	
      nmzpr  = grid_doc.getCellValue(doc_panel.adr['nm_zp'], rowr);      
      //
   	  kod  = pipe.event({action: 'delete_record', file: 'ms_obp', nmzp: nmzp, kdus: cbox.kdus },true);
      mes_close();  
      records2 = pipe.event({action:'get_obp', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);   
   };
   // delete reservation
   if (mes_panel.opr=='delreserv') {
      nmzp = mes_panel.msd['nrecord']; 
      rowr   = grid_doc.getCurrentRow();	
      nmzpr  = grid_doc.getCellValue(doc_panel.adr['nm_zp'], rowr);      
      //
      kod  = pipe.event({action: 'delete_record', file: 'ms_res', nmzp: nmzp, kdus: cbox.kdus },true);
      mes_close();     
      records2 = pipe.event({action:'get_reserv', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
   };
   // add all reservation
   if (mes_panel.opr=='addallreserv') {
      nmzp = mes_panel.msd['nrecord']; 
      //
      kod  = pipe.event({action: 'add_reserv', nmzpd: nmzp, nmzpr: 0, kdus: cbox.kdus },true);
      mes_close();    
      //
      records2 = pipe.event({action:'get_reserv', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
   };
   // generate components
   if (mes_panel.opr=='gen_component') {
      nmzp = mes_panel.msd['nrecord']; 
      //
      kod  = pipe.event({action: 'gen_component', nmzpd: nmzp, kdus: cbox.kdus },true);
      mes_close();    
      // read main document
      ar_records_doc = pipe.event({action:'get_doc',nmzp: doc_panel.nmzp, kdop: doc_panel.kdop },true);
      grid_doc.setCellData(ar_records_doc);
      grid_doc.setRowCount(ar_records_doc.length);
      grid_doc.refresh();
      //
   };
};
mes_close(); 
grid_doc2.setCellText(records2);
grid_doc2.setRowCount(records2.length);
grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);
grid_doc2.refresh();

mes_panel.flag=true;   
};
// ================================================================================================
                             var mes_cancel = new AW.UI.Button;
                             mes_cancel.setId("mes_cancel");
                             mes_cancel.setControlText("Cancel");
                             mes_cancel.setPosition(lm+300,240);
                             mes_cancel.setSize(90,26);   
                             var MesCancel = new mes_obj(mes_cancel);
                             MesCancel.setStyle("display", "none") ;    
                             document.write(MesCancel); 

mes_cancel.onClick = function(){
 mes_close();  
};
//-----------------------------------------------------------------------------
//  
//-----------------------------------------------------------------------------