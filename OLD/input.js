/** =============================================================================================
* INPUT PANEL
* ================================================================================================
* программа ввода и коррекировки информации одной строки  (докумены,таксы сержисы...)
* левая половина (grid_input) введеная или корректируемая информация
* правая половина (grid_dir) справочники. Выбираем значения
*/

/**
 * =================================================================================================
 * input close
 * =================================================================================================
 */
function input_close() {
    /**
     * закрываем работу с программой ввода
     * ввостанавливаем предедущую информацию
     */
    if (grid_input.opr==='New Document') {
      alldoc_btopen()
    }

    if (grid_input.opr==='Add taxe') {

    }

    if (grid_input.opr==='Edit taxe') {

    }
    if (grid_input.opr==='Edit service') {
 
    }
    if (grid_input.opr==='Edit service') {

    }

    /**
     * закрываем видимость
     */
    GridInput.setStyle ("visibility","hidden")
    GCalendar.setStyle ("display", "none")
    GridDir.setStyle   ("visibility","hidden")
    InputPanel.setStyle("display", "none")
    InputFon.setStyle  ("display", "none")

    /**
     * все сбрасываем
     */
    grid_input.opr=""
    grid_input.recordset={}
    /** input_close конец */
return true
}

/**
 * =================================================================================================
 * input open
 * =================================================================================================
 * ввод и корректировка информации
 */
 function input_open(opr,nmzp) {
    /**
     * opr - с какой операцией работаем
     * nmzp- number record (0 - add, >0 - edit )
     */
     /** let s_records=[] */
     let fields=[]
     let SearchHeader = []
    /**  все почистили  */
     grid_input.recordset=[]
     grid_input.opr=opr
     grid_input.nmz=nmzp
     grid_input.setCellText([])
     grid_input.setRowCount(0)
     grid_input.refresh()
    /** форма для справочника  */
    /** флаги установили */
     grid_input.dir  = false  /** справочника нет */
     grid_input.sel  = false  /** выбора нет      */
     grid_input.oldv = ''     /** значения для поиска нет */
     grid_input.oldr = 0      /** предыдущее значение строки нет */
     grid_input.flag = true   /** таблица вводо готова */
     /** нужную форму открыли, ненужную закрыли */
     InputFon.setStyle  ("display", "block")      /** спрятали */
     InputPanel.setStyle("display", "block")      /** спрятали */
     GridInput.setStyle ("visibility","visible")  /** открыли  */
     GridDir.setStyle   ("visibility","hidden")   /** спрятали */
     GCalendar.setStyle ("display", "none")       /** спрятали */
     /**  заголовку присвоили имя операции  */
     lb_input_c.setControlText(grid_input.opr)
     /** ========================================================================== */
     if (opr==='New Document') {
        /** если новый документ читаем возможные опереции */
        select_operation("")
     }
     /** =========================================================================== */
     if ((opr==='Add taxe')||(opr==='Edit taxe')) {
        /**  добавить или редактировать таксы(суммы) документа */
        fields = pipe.event({action: 'get_fields', fl: 'taxe', nz: nmzp},true) /** читаем нужные поля */
        /** заполняем таблицу ввода */
        grid_input.setCellText(fields)
        grid_input.setRowCount(fields.length)
        grid_input.refresh()
        /** читаем справочник такс (сумм) */
        SearchHeader = ["Taxe"]
        grid_dir.setHeaderText(SearchHeader)
        read_dir('sprsm','',1)         /** читаем справочник */
        GridDir.setStyle("visibility","visible")  /** делаем справочник видимым */
        // если нет предедущий позиции справочника идем на первую строку
        if (grid_input.row_old===0) {  grid_input.selectCell(1,0);}
        grid_input.selectCell(1,0)
     }
     /** =========================================================================== */
     if ((opr==='Add service')||(opr==='Edit service')) {
        /** добавить-редактировать сервисы */
        fields = pipe.event({action: 'get_fields', fl: 'service', nz: nmzp},true) /** читаем поля */
        /** заполняем таблицу */
        grid_input.setCellText(fields)
        grid_input.setRowCount(fields.length)
        grid_input.refresh() /** обновляем таблицу */
        /** справочник по сервисам */
        SearchHeader = ["Service"]
        grid_dir.setHeaderText(SearchHeader)
        read_dir('sprsm','',1)         /** читаем справочник */
        GridDir.setStyle("visibility","visible")  /** делаем видимым */
        /** если нет предедущий позиции справочника идем на первую строку */
        if (grid_input.row_old===0) {  grid_input.selectCell(1,0) }
        grid_input.selectCell(1,0)
     }
     /** =========================================================================== */
     if ((opr==='Add executor')||(opr==='Edit executor')) {
        /** добавить-редактировать исполнителей */
        fields = pipe.event({action: 'get_fields', fl: 'executor', nz: nmzp},true) /** читаем поля */
        /**  заполняем таблицу */
        grid_input.setCellText(fields)
        grid_input.setRowCount(fields.length)
        grid_input.refresh()
        /** справочник по исполнителям */
        SearchHeader = ["Executor"]
        grid_dir.setHeaderText(SearchHeader)
        read_dir('sprkl','',1)        /**  читаем справочник */
        GridDir.setStyle("visibility","visible") /** делаем видимым  */
        /**  если нет предедущий позиции справочника идем на первую строку */
        if (grid_input.row_old===0) {  grid_input.selectCell(1,0) }
        grid_input.selectCell(1,0)
     }
     /** =========================================================================== */
     if ((opr==='Add serial number')||(opr==='Edit serial number')) {
        /**  добавить-редактировать серийные номера */
        fields = pipe.event({action: 'get_fields', fl: 'sernum', nz: nmzp},true) /** читаем поля */
        /** заполняенм таблицу */
        grid_input.setCellText(fields)
        grid_input.setRowCount(fields.length)
        grid_input.refresh()
        /**  справочника нет,просто есть номера */
        SearchHeader = ["Serial number"]
        grid_dir.setHeaderText(SearchHeader)
        /**  если нет предедущий позиции справочника идем на первую строку */
        if (grid_input.row_old===0) {  grid_input.selectCell(1,0)}
        grid_input.selectCell(1,0)
        grid_input.raiseEvent("editCurrentCell",{},1,0)
     }
     /** =========================================================================== */
     if ((opr==='Add product')||(opr==='Edit product')) {
        /** добавить редактировать издекия */
        fields = pipe.event({action: 'get_fields', fl: 'product', nz: nmzp},true)
        grid_input.setCellText(fields)
        grid_input.setRowCount(fields.length)
        grid_input.refresh()
        /** справочник изделий */
        SearchHeader = ["Product"];
        grid_dir.setHeaderText(SearchHeader)
        read_izd('spriz','',1)
        GridDir.setStyle("visibility","visible")
        if (grid_input.row_old===0) {  grid_input.selectCell(1,0)}
        grid_input.selectCell(1,0)
     }
    /**
     * закончили подготовку. можно вводить
     */
 }

 /**
 * =================================================================================================
 *  Читаем справочник изделий
 * =================================================================================================
 * @param {string} spr  имя справочника
 * @param {string} txs  текст для поиска
 * @param {number} ls   кол-во страниц
 */
function read_izd(spr, txs, ls) {
   if (spr==='spriz') {
      grid_dir.spr=spr
      /**  все закрыли */
      bt_dir_add.setStyle("display", "none")
      bt_dir_pu.setStyle ("display", "none")
      bt_dir_dw.setStyle ("display", "none")
      txtq = ""
  	  grid_input.sel=false
      /** получаем массив строк из базы */
      var s_records = pipe.event({action:'seek_spr',dir: spr, seek: txs, list: ls, addsql: txtq} ,true)
      /** обновляем таблицу */
      grid_dir.setCellText(s_records)
      grid_dir.setRowCount(s_records.length)
      grid_dir.refresh()
   }
}

/**
 * =================================================================================================
 *  Чтение справочника
 * =================================================================================================
 */
function read_dir(spr, txs, ls) {
      grid_dir.spr=spr
      /**  все закрыли */
      bt_dir_add.setStyle("display", "none")
      bt_dir_pu.setStyle ("display", "none")
      bt_dir_dw.setStyle ("display", "none")
      var txtq = ""
      /** для разных справочников */
  	  /** справочник наименований */
  	  if (spr==='sprim'){
         bt_dir_pu.setStyle("display", "block")
         bt_dir_dw.setStyle("display", "block")
  	  }
  	  /**  справочник сумм(таксы) */
  	  if ((spr==='sprsm') && ((grid_input.opr==='Add taxe')||(grid_input.opr==='Edit taxe'))) {
  	  	txtq=" pr_sm = 1 "
  	  }
      /** справочник сервисов */
  	  if ((spr==='sprsm') && ((grid_input.opr==='Add service')||(grid_input.opr==='Edit service'))) {
  	  	txtq=" pr_sm = 0 "
  	  }
  	  grid_input.sel=false;
      /** получаем набор записей из справочника
      * dir - имя справочника
      * seek - значение поиска
      * list - количество строк
      * addsql - zapros
      */
      var s_records = pipe.event({action:'seek_spr',dir: spr, seek: txs, list: ls, addsql: txtq} ,true)
      grid_dir.setCellText(s_records)
      grid_dir.setRowCount(s_records.length)
      grid_dir.refresh()
      /** если ничего не получили */
      var ll = s_records.length
      if (ll===0) {
     	  if ((spr==='sprsk')||(spr==='sprchk')){ bt_dir_add.setStyle("display", "none") }
      	  else {bt_dir_add.setStyle("display", "block") }
          }
      else { bt_dir_add.setStyle("display", "none"); }
}

/**
 * =================================================================================================
 *  добавление нового значения в библиотеку
 * =================================================================================================
 */
function add_dir(spr, txs) {
  if (txs>'') {    
      /** добавили в справочник spr текст txs */
      pipe.event({action:'add_spr',dir: spr, seek: txs} ,true)
      /** прочитали справочник */
      read_dir(spr,txs,1)
  }
}

/**
 * =================================================================================================
 *  Выбор значения в справочнике операций
 * =================================================================================================
 */
function select_value(txt) {
   grid_input.sel = true
   let row_dir   = grid_dir.getCurrentRow()   /** текущая строка справочника */
   let kod_opr   = grid_dir.getCellValue(1, row_dir)    /** код операции */
   let name_opr  = grid_dir.getCellValue(0, row_dir)    /** имя операции  */
   let row_input = grid_input.getCurrentRow()           /** рекущая строка таблицы ввода */
   let col_input = grid_input.getCurrentColumn()        /** текущая колонка таблицы ввода */
   /** переносим из справочника в таблицу ввода */
   grid_input.setCellText(name_opr,col_input,row_input)
   grid_input.setCellText(kod_opr,col_input+3,row_input)

   let key = grid_input.getCellText(col_input+1,row_input)
   grid_input.recordset['prch'] = kod_opr
   
   /** выбор операции для нового докуменыа  */
   if (grid_dir.spr==='sprchk') {
         /** читаем справочник    */
         let sprchk_m = pipe.event({action: 'sprchk', prch: kod_opr}, true)
         /** запомнели */
         grid_input.recordset['pr_ch']  = kod_opr              /** код операции */
         grid_input.recordset['kd_op']  = sprchk_m['tp_opr']     /** тип операции */
         grid_input.recordset['pr_prd'] = sprchk_m['pr_prd']
         grid_input.recordset['pr_prz'] = sprchk_m['pr_prz']
         grid_input.recordset['st_dk']  = "1"                  /** состояние документа 1 - необработан */
         grid_input.recordset['pr_us']  = ac_input1.kodp       /** код пользователя кто создал */

         let ArNewDoc =[]

       ArNewDoc = pipe.event({action: 'get_ar_newdoc',tpop: sprchk_m['tp_opr'], kdop: kod_opr,
                    imop: name_opr,kdus: cbox.kdus},true);
       grid_input.setCellText(ArNewDoc)
       grid_input.setRowCount(ArNewDoc.length)
       grid_input.refresh()
       if (sprchk_m['nm_dok']>0) {
            let teknom = sprchk_m['nm_dok'] + 1
            grid_input.setcelltext(teknom,col_input,row_input+1)
       }
  }
grid_input.refresh()
/**grid_input.setSelectedRows([row_input]) */
}
//=================================================================================================
// select operation                                   
//=================================================================================================
function select_operation(txt) {
    lb_input_c.setControlText(grid_input.opr);
    var SearchHeader = ["Operation"];
    grid_dir.setHeaderText(SearchHeader);
    // read directory operation ==================
    read_dir('sprchk',txt,1);
    // 	
 	var ArNewDoc =[];
    ArNewDoc = pipe.event({action: 'get_ar_newdoc',tpop: '0', kdop: '0', imop: '', kdus: cbox.kdus},true);
    var ss=ArNewDoc.length;
    grid_input.setCellText(ArNewDoc);
    grid_input.setRowCount(ArNewDoc.length);
    grid_input.refresh();

    if (grid_input.row_old=0) {  grid_input.selectCell(1,0);}
    
    GridDir.setStyle("visibility","visible");
}
//=================================================================================================
//=================================================================================================
//=================================================================================================

var cw = (window.innerWidth)?window.innerWidth:((document.all)?document.documentElement.offsetWidth:null);
var ch = (window.innerHeight)?window.innerHeight:((document.all)?document.documentElement.offsetHeight:null);
var lm = (cw - 900) / 2;


                             var input_obj = AW.HTML.SPAN.subclass();  
                             input_obj.create = function(){  
                                 var obj = this.prototype;  
                                 var _super = this.superclass.prototype;  
                                 obj.init = function(argument){  
                                    _super.init.call(this);  
         
                                    obj.setStyle("position", "absolute"); 
                                    obj.setStyle("moz-user-focus","normal"); 
           
                                    obj.setStyle("background", "#bbbbbb"); 
                                    obj.setStyle("z-index", "10000"); 
    
                                    var workarea = new AW.HTML.DIV;  
                                    workarea.setContent("text", argument.toString());  
  
                                    obj.setContent("html",  workarea);         
                                 };  
                             }  
// panel fon ====================================================================================
                             var input_fon = new AW.UI.Group;
                             input_fon.setId("mes_fon");
                             input_fon.setPosition(10,50);
                             input_fon.setSize(cw-75,ch-105); 
                             input_fon.setStyle("background", "#eee");
                             input_fon.setStyle("filter","alpha(opacity=60)");
                             input_fon.setStyle("opacity","0.6");
                             var InputFon = new input_obj(input_fon); 
                             InputFon.setStyle("display", "none") ;    
                             document.write(InputFon); 
// panel input ====================================================================================
                            var input_panel = new AW.UI.Group;
                            input_panel.setId("input_panel");
                            input_panel.setPosition(lm,75);
                            input_panel.setSize(900,ch-175);
                            //input_panel.setStyle("filter","alpha(opacity=80)");
                            //input_panel.setStyle("opacity","0.8");
                            var InputPanel = new input_obj(input_panel); 
                            InputPanel.setStyle("display", "none") ;    
                            document.write(InputPanel); 
// calendar =======================================================================================                             
                             var objCal = new AWCalendar; 
                             objCal.setId("myGridCal"); 
                             objCal.set_Datemarker(true); 

                             objCal.set_Format('ymd'); 
                             objCal.set_Separator('-'); // any char()
                             objCal.setPosition(lm+20+520,90);

                             //objCal.setPosition(700,10);
                             var GCalendar = new input_obj(objCal); 
                             GCalendar.setStyle("display", "none");
                             document.write(GCalendar);


objCal.onRowClicked = function(){
   if (grid_input.flag==true) {
      grid_input.flag=false;  	
   
      var vald = this.get_SelectedDate();
   
      var row_input =grid_input.getCurrentRow();
      var col_input =grid_input.getCurrentColumn();
   
      grid_input.setCellText(vald,col_input,row_input);

      var key = grid_input.getCellText(col_input+1,row_input);
      grid_input.recordset[key] = vald;
      grid_input.flag=true;
   }
};
// grid input =====================================================================================                             
                             var inputHeader = [];

                             var grid_input = new AW.UI.Grid;
                             grid_input.setId("grid_input");

                             grid_input.setPosition(lm+10,90);
                             grid_input.setSize(520,ch-200); 
                             grid_input.setHeaderText(inputHeader);
                             grid_input.setHeaderHeight(2);
                             grid_input.setRowHeight(40);
                             grid_input.setColumnCount(2);
                             grid_input.setRowCount(1);
                             grid_input.setColumnWidth(150, 0);
                             grid_input.setColumnWidth(300, 1);
                             grid_input.setCellEditable(true,1); 
                             grid_input.getRowTemplate().setClass("text", "wrap");
                             grid_input.setCellTemplate(new AW.Templates.ImageText);
                             grid_input.setSelectorVisible(true);
                             grid_input.setSelectorWidth(35);
                             //grid_input.getSelectorTemplate().setStyle("background", "lightblue");
                             grid_input.setSelectorText(function(i){return this.getRowPosition(i)+1});
grid_input.flag=true;
//=================================================================================================
grid_input.onCurrentRowChanged = function(row_in){
 if (grid_input.flag==true) {
    grid_input.flag=false;  	

    GCalendar.setStyle("display", "none");

	//check cell befor
    if (!(row_in==grid_input.oldr)) {	
   	  if ((grid_input.dir==true) && (grid_input.sel==false)) {
     	  	var row_old=grid_input.oldr;
            var text_old=grid_input.oldv;
            grid_input.setCellText(text_old,1,row_old);
   	  }
   }
   
   grid_input.dir = false;
   grid_input.sel = false;
   grid_input.oldv = this.getCellText(1,row_in);
   grid_input.oldr = row_in;
   
   GCalendar.setStyle("display", "none");
   GridDir.setStyle("visibility","hidden");
   
   var headt = this.getCellText(0,row_in);
   SearchHeader = [headt];
   grid_dir.setHeaderText(SearchHeader);

   // ===========================================
   //col_in = grid_input.getCurrentColumn();
   var col_in = 2;
   var kod_in = this.getCellText(col_in,row_in);
   // select operation
   if (kod_in=="pr_ch"){
      grid_input.dir = true;
      grid_input.recordset=[];
      select_operation("");
   }
   // select date ===============================
   if (kod_in=="dt_dk"){
   	  GCalendar.setStyle("display", "block");
      objCal.refresh();
    }
   // select company ============================
   if ((kod_in=="kd_ps")|(kod_in=="ou_ps")) {
      //console.log('asasasas');  
      grid_input.dir = true;
   	  GridDir.setStyle("visibility","visible");
      read_dir('sprps','',1);
   }
   // select warehause ==========================
   if ((kod_in=="nm_sk")|(kod_in=="ou_sk")) {
      grid_input.dir = true;
      GridDir.setStyle("visibility","visible");
      read_dir('sprsk','',1);
   }
   // select name ==========================
   if ((kod_in=="kd_im")) {
      grid_input.dir = true;
      GridDir.setStyle("visibility","visible");
      if (doc_panel.opr=='product') { read_izd('spriz','',1); }
      else { read_dir('sprim','',1); }
   }
   // ===========================================
   if ((kod_in=="kd_kl")|(kod_in=="kd_re")) {
      grid_input.dir = true;
      GridDir.setStyle("visibility","visible");
      read_dir('sprkl','',1);
   }
   // ===========================================
   if (kod_in=="nm_ka") {
      grid_input.dir = true;
      GridDir.setStyle("visibility","visible");
      read_dir('sprka','',1);
   }
   // ===========================================
   if (kod_in=="kd_sm") {
      grid_input.dir = true;
      GridDir.setStyle("visibility","visible");
      read_dir('sprsm','',1);
   }
   // ===========================================
   if (kod_in=="kd_pd") {
      grid_input.dir = true;
      GridDir.setStyle("visibility","visible");
      read_dir('sprpd','',1);
   }
   // ===========================================
   if (kod_in=="tp_opl") {
      GridDir.setStyle("visibility","visible");
      read_dir('spropl','',1);
   }
   // ===========================================
   if(kod_in=="color"){
      grid_input.dir = true;
      var ms_color = [["silver","silver"],["brown","brown"],["maroon","maroon"],["red","red"],["coral","coral"],["orange","orange"],
          ["khaki","khaki"],["olive","olive"],["yellow","yellow"],["green","green"],["aqua","aqua"],["navy","navy"],["blue","blue"],
          ["indigo","indigo"],["plum","plum"],["violet","violet"],["purple","purple"],["pink","pink"]];
      GridDir.setStyle("visibility","visible");
      var s_records = ms_color;
      grid_dir.setCellText(s_records);
      grid_dir.setRowCount(s_records.length);
      grid_dir.refresh();
      //grid_dir.selectCell(0,0);
      //grid_dir.raiseEvent("editCurrentCell",{},0,0);
   }
 }
 grid_input.flag=true;  	
 
};  

//================================================================================================
grid_input.onCellValidated = function(text, coll , roww){
 var col = parseInt(coll);
 var row = parseInt(roww);

 var nospr = true;
 grid_input.setCellText(text,col+3,row);
 var key = this.getCellText(col+1,row);
 grid_input.recordset[key] = text;

    // diferen type field
    if(this.getCellText(col+1,row)=="pr_ch"){
      // select opereration
      nospr = false; 
      grid_input.recordset=[];
      GCalendar.setStyle("display", "none");
      GridDir.setStyle("visibility","visible");
      select_operation(text);
    }
    // check date format
    if(this.getCellText(col+1,row)=="dt_dk"){
      var rez = InControl(text,"Date")
      if (rez) {
         // datef =  datetime(text);
         grid_input.recordset[key] = text;
         }
         else {
            grid_input.recordset[key] = "";
            grid_input.setCellText("",col,row);
      }
    }
    // Currency
    if((this.getCellText(col+1,row)=="sm_op")|(this.getCellText(col+1,row)=="sm_opdl")|
       (this.getCellText(col+1,row)=="st_op")|(this.getCellText(col+1,row)=="st_opdl")| 
       (this.getCellText(col+1,row)=="sm_op")|(this.getCellText(col+1,row)=="sm_opdl")| 
       (this.getCellText(col+1,row)=="sm_op1")|(this.getCellText(col+1,row)=="sm_op1dl")| 
       (this.getCellText(col+1,row)=="sm_tk")|(this.getCellText(col+1,row)=="sm_tkdl")) {
        rez = InControl(text,"Currency")
      if (rez) {
         grid_input.recordset[key] = text;
         }
         else {
            grid_input.recordset[key] = "";
            grid_input.setCellText("",col,row);
      }
    }
    // Numeric
    if((this.getCellText(col+1,row)=="kl_op")|
       (this.getCellText(col+1,row)=="kol_op")|(this.getCellText(col+1,row)=="kol_op1")| 
       (this.getCellText(col+1,row)=="kol_tk")) {
        rez = InControl(text,"Numeric")
      if (rez) {
         grid_input.recordset[key] = text;
         }
         else {
            grid_input.recordset[key] = "";
            grid_input.setCellText("",col,row);
      }
    }
    //     
    if(this.getCellText(col+1,row)=="kd_ps"){
      read_dir('sprps',text,1);
    }
    if(this.getCellText(col+1,row)=="nm_sk"){
      read_dir('sprsk',text,1);
    }
    if(this.getCellText(col+1,row)=="kd_kl"){
      read_dir('sprkl',text,1);
    }
    if(this.getCellText(col+1,row)=="kd_sm"){
      read_dir('sprsm',text,1);
    }
    if(this.getCellText(col+1,row)=="kd_pd"){
      read_dir('sprpd',text,1);
    }
    if(this.getCellText(col+1,row)=="kd_im"){
      if (doc_panel.opr=='product') { read_izd('spriz','',1); }
      else { read_dir('sprim','',1); }
    }
    return true;
};
//=================================================================================================
grid_input.onCellSelectedChanged = function(selected, col, row){
    if (selected){
        this.setTimeout(function(){
//            this.raiseEvent("editCurrentCell", {}, col, row);
        });
    }
};              
//=================================================================================================
                             var lb_input_c = new AW.UI.Label;
                             lb_input_c.setId("lb_input_c");
                             lb_input_c.setControlText("ADD/EDIT");
                             lb_input_c.setStyle("font-size", "14pt");   
                             // lb_input_c.setStyle("text-decoration", "underline");


                             var lb_input = new AW.UI.Label;
                             lb_input.setId("lb_input");
                             lb_input.setControlText("input: ");

                             var bt_input_submit = new AW.UI.Button;
                             bt_input_submit.setId("bt_input_select");
                             bt_input_submit.setControlText("Submit");
//=================================================================================================    
bt_input_submit.onClick = function(){

    if (grid_input.flag==true) {
	    grid_input.flag=false;
        ar_grid=grid_input.recordset;
        kod='Document not specified';
	    // New Document =======================================================
		if (grid_input.opr== 'New Document') {

           //kod = pipe.event({action: 'test'},true);
           //alert(ar_grid);
           kod = pipe.event({action: 'add_newdoc', fields: ar_grid, kdus: cbox.kdus },true);
           if (kod>'') { alert(kod);
              GridDir.setStyle("visibility","hidden");
           }
		   else { 
		       GetAllDoc(); 
		       input_close();
		   }
	    }

	    // Add taxes ==========================================================
		if (grid_input.opr== 'Add taxe') {
	   	   // add block informations
	   	   recd = pipe.event({action: 'read_doc', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
	   	   if (recd.length==0) {alert('Input: error conection database') }

	   	   grid_input.recordset['nm_zpd']= doc_panel.nmzp;
		   grid_input.recordset['dt_dk'] = recd['dt_dk'];
		   grid_input.recordset['kd_op'] = recd['kd_op'];
		   grid_input.recordset['kd_dk'] = recd['kd_dk'];
		   grid_input.recordset['pr_sum']= 1;
		   grid_input.recordset['nm_skz']= recd['nm_sk'];
			
		   var kod = pipe.event({action: 'add_record', file: 'ms_sum', nmzpd: doc_panel.nmzp,
	   	         record: grid_input.recordset, kdus: cbox.kdus },true);
	  	   if (!((kod==true)|(kod=''))) {  alert(kod); }  
		   else { 
               var fields = pipe.event({action: 'get_fields', fl: 'taxe', nz: 0},true);
               grid_input.setCellText(fields);
               grid_input.setRowCount(fields.length);
               grid_input.refresh();
               read_dir('sprsm','',1);
               GridDir.setStyle("visibility","visible");
               grid_input.selectCell(1,0);

  		   	   var records2 = pipe.event({action:'get_sum', nmzp: doc_panel.nmzp, prsum: 1, kdus: cbox.kdus },true);
               grid_doc2.setCellText(records2);
               grid_doc2.setRowCount(records2.length);
               grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);
               grid_doc2.refresh();
		   }
	    }

	    // Edit taxes ==========================================================
		if (grid_input.opr== 'Edit taxe') {
			//grid_input.nmz
		    kod = pipe.event({action: 'update_record', file: 'ms_sum', nmzp: grid_input.nmz,
	   	         record: grid_input.recordset, kdus: cbox.kdus },true);
	  	   if (!((kod==true)|(kod=''))) { alert(kod) ; }
		   else { 
     		  input_close();
  		   	  records2 = pipe.event({action:'get_sum', nmzp: doc_panel.nmzp, prsum: 1, kdus: cbox.kdus },true);
              grid_doc2.setCellText(records2);
              grid_doc2.setRowCount(records2.length);
              grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);
              grid_doc2.refresh();
		   }
	    }

	    // Add services ==========================================================
		if (grid_input.opr== 'Add service') {
	   	   // add block informations
	   	   recd = pipe.event({action: 'read_doc', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
	   	   if (recd.length==0) {alert('Input: error conection database') }

	   	   grid_input.recordset['nm_zpd']= doc_panel.nmzp;
		   grid_input.recordset['dt_dk'] = recd['dt_dk'];
		   grid_input.recordset['kd_op'] = recd['kd_op'];
		   grid_input.recordset['kd_dk'] = recd['kd_dk'];
		   grid_input.recordset['pr_sum']= 0;
		   grid_input.recordset['nm_skz']= recd['nm_sk'];
			
		   kod = pipe.event({action: 'add_record', file: 'ms_sum', nmzpd: doc_panel.nmzp,
	   	         record: grid_input.recordset, kdus: cbox.kdus },true);
	  	   if (!((kod==true)|(kod=''))) { alert(kod);  }
		   else { 

               fields = pipe.event({action: 'get_fields', fl: 'service', nz: 0},true);
               grid_input.setCellText(fields);
               grid_input.setRowCount(fields.length);
               grid_input.refresh();
               read_dir('sprsm','',1);
               GridDir.setStyle("visibility","visible");
  
               grid_input.selectCell(1,0);
		   	  //input_close();
  		   	   records2 = pipe.event({action:'get_sum', nmzp: doc_panel.nmzp, prsum: 0, kdus: cbox.kdus },true);
               grid_doc2.setCellText(records2);
               grid_doc2.setRowCount(records2.length);
               grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);
               grid_doc2.refresh();
		   }
	    }

	    // Edit services ==========================================================
		if (grid_input.opr== 'Edit service') {
			//grid_input.nmz
		    kod = pipe.event({action: 'update_record', file: 'ms_sum', nmzp: grid_input.nmz,
	   	         record: grid_input.recordset, kdus: cbox.kdus },true);
	  	   if (!((kod==true)|(kod=''))) {  alert(kod); } 
		   else { 
     		  input_close();
  		   	  records2 = pipe.event({action:'get_sum', nmzp: doc_panel.nmzp, prsum: 0, kdus: cbox.kdus },true);
              grid_doc2.setCellText(records2);
              grid_doc2.setRowCount(records2.length);
              grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);
              grid_doc2.refresh();
		   }
	    }

	    // Add executors ==========================================================
		if (grid_input.opr== 'Add executor') {
	   	   // add block informations
	   	   recd = pipe.event({action: 'read_doc', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
	   	   if (recd.length==0) {alert('Input: error conection database') }

	   	   grid_input.recordset['nm_zpd']= doc_panel.nmzp;
		   grid_input.recordset['dt_dk'] = recd['dt_dk'];
		   grid_input.recordset['kd_op'] = recd['kd_op'];
		   grid_input.recordset['kd_dk'] = recd['kd_dk'];
			
		   kod = pipe.event({action: 'add_record', file: 'ms_rab', nmzpd: doc_panel.nmzp,
	   	         record: grid_input.recordset, kdus: cbox.kdus },true);
	  	   if (!((kod==true)|(kod=''))) { alert(kod);  }
		   else { 
               fields = pipe.event({action: 'get_fields', fl: 'executor', nz: 0},true);
               grid_input.setCellText(fields);
               grid_input.setRowCount(fields.length);
               grid_input.refresh();
               read_dir('sprkl','',1);
               GridDir.setStyle("visibility","visible");
               grid_input.selectCell(1,0);

		       //input_close();
  		   	   records2 = pipe.event({action:'get_rab', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
               grid_doc2.setCellText(records2);
               grid_doc2.setRowCount(records2.length);
               grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);
               grid_doc2.refresh();
		   }
	    }

	    // Edit executors ==========================================================
		if (grid_input.opr== 'Edit executor') {
			//grid_input.nmz
		    kod = pipe.event({action: 'update_record', file: 'ms_rab', nmzp: grid_input.nmz,
	   	         record: grid_input.recordset, kdus: cbox.kdus },true);
	  	   if (!((kod==true)|(kod=''))) {  alert(kod); } 
		   else { 
     		  input_close();
  		   	  records2 = pipe.event({action:'get_rab', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
              grid_doc2.setCellText(records2);
              grid_doc2.setRowCount(records2.length);
              grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);
              grid_doc2.refresh();
		   }
	    }

	    
  	    // Add product ==========================================================
		if (grid_input.opr== 'Add product') {
	   	   // add block informations
	   	   recd = pipe.event({action: 'read_doc', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
	   	   if (recd.length==0) {alert('Input: error conection database') }

	   	   grid_input.recordset['nm_zpd']= doc_panel.nmzp;
		   grid_input.recordset['dt_dk'] = recd['dt_dk'];
		   grid_input.recordset['kd_op'] = recd['kd_op'];
		   grid_input.recordset['kd_dk'] = recd['kd_dk'];
		
	   	   var recf = pipe.event({action: 'read_izd', kdim: grid_input.recordset['kd_im']},true);
	   	   if (recf.length==0) {alert('Input: error conection database') }

	   	   grid_input.recordset['nm_izm']= recf['nm_zp'];
		   	
		   kod = pipe.event({action: 'add_record', file: 'ms_obp', nmzpd: doc_panel.nmzp,
	   	         record: grid_input.recordset, kdus: cbox.kdus },true);
	  	   if (!((kod==true)|(kod=''))) { alert(kod);  }
		   else { 
               fields = pipe.event({action: 'get_fields', fl: 'product', nz: 0},true);
               grid_input.setCellText(fields);
               grid_input.setRowCount(fields.length);
               grid_input.refresh();
               read_izd('spriz','',1);
               GridDir.setStyle("visibility","visible");
               grid_input.selectCell(1,0);

		       //input_close();
  		   	   records2 = pipe.event({action:'get_obp', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
               grid_doc2.setCellText(records2);
               grid_doc2.setRowCount(records2.length);
               grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);
               grid_doc2.refresh();
		   }
	    }

	    // Edit products ==========================================================
		if (grid_input.opr== 'Edit product') {
			//grid_input.nmz
		    kod = pipe.event({action: 'update_record', file: 'ms_obp', nmzp: grid_input.nmz,
	   	         record: grid_input.recordset, kdus: cbox.kdus },true);
	  	   if (!((kod==true)|(kod=''))) {  alert(kod); } 
		   else { 
     		  input_close();
  		   	  records2 = pipe.event({action:'get_obp', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
              grid_doc2.setCellText(records2);
              grid_doc2.setRowCount(records2.length);
              grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);
              grid_doc2.refresh();
		   }
	    }

	    // Add sernum    ==========================================================
		if (grid_input.opr== 'Add serial number') {
	   	   // document
	   	   recd = pipe.event({action: 'read_doc', nmzpd: doc_panel.nmzp, kdus: cbox.kdus },true);
	   	   if (recd.length==0) { alert('Input: error conection database');  return false; }
           // record
  	       var rowr   = grid_doc.getCurrentRow();
           var nmzpr  = grid_doc.getCellValue(11, rowr);     // <<< take care >>>
           var nmzpo  = grid_doc.getCellValue(12, rowr);     // <<< take care >>>

           var recr = pipe.event({action: 'read_opr', nmzp: nmzpr, kdus: cbox.kdus },true);
	   	   if (recr.length==0) {alert('Input: No record for serial number'); return false; }

	   	   grid_input.recordset['nm_zpo'] = nmzpo;
  		   grid_input.recordset['nm_zpr'] = nmzpr;
  		   grid_input.recordset['nm_zpd'] = doc_panel.nmzp;
		   grid_input.recordset['kd_im']  = recr['kd_im'];
			
		   kod = pipe.event({action: 'add_record', file: 'ms_ser', nmzpd: doc_panel.nmzp,
	   	         record: grid_input.recordset, kdus: cbox.kdus },true);

	   	   if (!((kod==true)|(kod=''))) { alert(kod); return false;  }
		   else { 
     		   // input_close();
  		   	   records2 = pipe.event({action:'get_sernum', nmzpr: nmzpr, kdus: cbox.kdus },true);
               grid_doc2.setCellText(records2);
               grid_doc2.setRowCount(records2.length);
               grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);
               grid_doc2.refresh();
               // new add
               fields = pipe.event({action: 'get_fields', fl: 'sernum', nz: 0},true);
               grid_input.setCellText(fields);
               grid_input.setRowCount(fields.length);
               grid_input.refresh();
  
               //if (grid_input.row_old=0) {  grid_input.selectCell(1,0);};
               grid_input.raiseEvent("editCurrentCell",{},1,0);
      	       grid_input.flag=true;

		   }
	    }

	    // Edit sernum    =========================================================
		if (grid_input.opr== 'Edit serial number') {

			rowr   = grid_doc.getCurrentRow();	
            nmzpr  = grid_doc.getCellValue(11, rowr);     // <<< take care >>> 

			//grid_input.nmz
		    kod = pipe.event({action: 'update_record', file: 'ms_ser', nmzp: grid_input.nmz,
	   	         record: grid_input.recordset, kdus: cbox.kdus },true);
	  	   if (!((kod==true)|(kod=''))) {  alert(kod); } 
		   else { 
     		  input_close();
  		   	  records2 = pipe.event({action:'get_sernum', nmzpr: nmzpr, kdus: cbox.kdus },true);
              grid_doc2.setCellText(records2);
              grid_doc2.setRowCount(records2.length);
              grid_doc2.setColumnCount(doc_panel.HeaderDoc2.length);
              grid_doc2.refresh();
		   }
	    }
	    
	grid_input.flag=true;
	}
};
//=================================================================================================
                             var bt_input_cancel = new AW.UI.Button;
                             bt_input_cancel.setId("bt_input_cancel");
                             bt_input_cancel.setControlText("Cancel");

bt_input_cancel.onClick = function(){
   input_close();
};
//=================================================================================================
                             var toolbar_grid_input = new AW.HTML.DIV;

                             toolbar_grid_input.setContent("sc_labelc", function(){return lb_input_c});
                             lb_input_c.setStyle("left",10);
                             lb_input_c.setStyle("top",10);
                             lb_input_c.setStyle("width",200);

                             
                             toolbar_grid_input.setContent("sc_button1", function(){return bt_input_submit});
                             bt_input_submit.setStyle("left",10);
                             bt_input_submit.setStyle("top",40);
                             bt_input_submit.setStyle("width",100);
    
                             toolbar_grid_input.setContent("sc_button3", function(){return bt_input_cancel});
                             bt_input_cancel.setStyle("left",110);
                             bt_input_cancel.setStyle("top",40);
                             bt_input_cancel.setStyle("width",100);
    
                             grid_input.defineTemplate("toolbar", toolbar_grid_input);
                             grid_input.setLayoutTemplate(new AW.Panels.Horizontal);
                             grid_input.setPanelTemplate(function(i){
                                 switch(i){
                                 case "center": return this.getScrollTemplate();
                                 case "top": return this.getToolbarTemplate();
                                 }
                             });

                             grid_input.onPanelWidthChanged = function(width, panel){
                                 this.getLayoutTemplate().changePanelWidth(width, panel);
                             };
                             grid_input.onPanelHeightChanged = function(height, panel){
                                 this.getLayoutTemplate().changePanelHeight(height, panel);
                             };

                             grid_input.setPanelHeight(80, "top"); 

                             var GridInput = new input_obj(grid_input); 
                             GridInput.setStyle("visibility","hidden");
                             document.write(GridInput);

                             
// grid directory =================================================================================                             
var SearchHeader = ["NAME"];
                            var grid_dir = new AW.UI.Grid;
                            grid_dir.setId("grid_dir");
                            grid_dir.setCellText(s_records);
                            grid_dir.setHeaderText(SearchHeader);
                            grid_dir.setHeaderHeight(25);
                            grid_dir.setRowHeight(40);
                            grid_dir.setColumnCount(1);
                            grid_dir.setRowCount(10);
                            grid_dir.setColumnWidth(280, 0);
                            grid_dir.setCellEditable(false);  
                            
                            grid_dir.setPosition(lm+20+520,90);
                            grid_dir.setSize(350,ch-200); 
                            grid_dir.getRowTemplate().setClass("text", "wrap");
                            grid_dir.setCellTemplate(new AW.Templates.ImageText);
 
                            grid_dir.setSelectorVisible(true);
                            grid_dir.setSelectorWidth(35);
                            grid_dir.setSelectorText(function(i){return this.getRowPosition(i)+1});
// select row =============== 
grid_dir.onRowClicked = function(event, rowIndex){
  select_value();
};
// add new record =================================================================================
                             var bt_dir_add = new AW.UI.Button;
                             bt_dir_add.setId("bt_dir_add");
                             bt_dir_add.setControlText("Add  Record");

bt_dir_add.onClick = function(){
   var row_input  = grid_input.getCurrentRow();
   var col_input  = grid_input.getCurrentColumn();
   var text       = grid_input.getCellValue(col_input, row_input);
   // clear field
   grid_input.setCellText("",col_input,row_input);
   // add record
   add_dir(grid_dir.spr,text);
};
// page up ========================================================================================
                             var bt_dir_pu = new AW.UI.Button;
                             bt_dir_pu.setId("bt_dir_pu");
                             bt_dir_pu.setControlText("Page Up");

bt_dir_pu.onClick = function(){
   
};
// page down ======================================================================================
                             var bt_dir_dw = new AW.UI.Button;
                             bt_dir_dw.setId("bt_dir_dw");
                             bt_dir_dw.setControlText("Page Dn");

bt_dir_dw.onClick = function(){
  
};
//=================================================================================================
                            var toolbar_grid_dir = new AW.HTML.DIV;
    
                            toolbar_grid_dir.setContent("sc_button2", function(){return bt_dir_add});
                            bt_dir_add.setStyle("left",10);
                            bt_dir_add.setStyle("top",8);
                            bt_dir_add.setStyle("width",160);
    
                            toolbar_grid_dir.setContent("sc_button3", function(){return bt_dir_pu});
                            bt_dir_pu.setStyle("left",170);
                            bt_dir_pu.setStyle("top",8);
                            bt_dir_pu.setStyle("width",80);

                            toolbar_grid_dir.setContent("sc_button4", function(){return bt_dir_dw});
                            bt_dir_dw.setStyle("left",250);
                            bt_dir_dw.setStyle("top",8);
                            bt_dir_dw.setStyle("width",80);
    
                            grid_dir.defineTemplate("toolbar", toolbar_grid_dir);
                            grid_dir.setLayoutTemplate(new AW.Panels.Horizontal);
                            grid_dir.setPanelTemplate(function(i){
                                 switch(i){
                                 case "center": return this.getScrollTemplate();
                                 case "top": return this.getToolbarTemplate();
                                 }
                            });

                            grid_dir.onPanelWidthChanged = function(width, panel){
                                 this.getLayoutTemplate().changePanelWidth(width, panel);
                            };
                            grid_dir.onPanelHeightChanged = function(height, panel){
                                 this.getLayoutTemplate().changePanelHeight(height, panel);
                            };

                            grid_dir.setPanelHeight(40, "top"); 

                            var GridDir = new input_obj(grid_dir); 
                            GridDir.setStyle("visibility","hidden");
                            document.write(GridDir);                             
//=================================================================================================
//  end input
//================================================================================================