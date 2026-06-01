<?php
/**
 *
 *  PForm
 *
 *
 * @property mixed _p_sheet
 */
require_once 'PHPExcel.php';
class PForm
{
	private $_p_name_form;   
	private $_p_form;
	private $_p_report;
	private $_security;
	private $_p_block      = array();
	private $_p_input_name = array();
	private $_p_old_value  = array();
	private $_p_curr_value = array();
	private $_p_sum1 = array();
	private $_p_sum2 = array();
	private $_p_sum3 = array();

    private $_p_list;
    private $_p_line;
    private $_p_topl;
    private $_p_endl;
    private $_p_psize;

    private $_p_blc = array();
    private $_p_prn = array();
    private $_p_sty = array();
    private $_p_vlh = array();
    private $_p_lin = array();

    //PHPExcel objects
    private $objReader;
    private $objPHPExcel;
    private $objWorksheet;
    private $objWriter;

    /**  ============================================================
      * Set Page Size
      * @param $Size
      */
	public function P_SetPageSize($Size) {
	$this->_p_psize = $Size;
	}

    /**  ============================================================
     * Set Start list
     * @param $Block
     */
	public function P_SetStartList($Block) {
	$this->_p_topl = $Block;
	}

    /**  ============================================================
     * Set Ene list
     * @param $Block
     */
	public function P_SetEndList ($Block) {
	$this->_p_endl = $Block;
	}

    /**  ============================================================
     * break index
     * @param $Kod
     * @param $Key
     * @param $Block
     * @param $Data
     */
     public function P_Break ($Kod, $Key, $Block, $Data ) {
	
     }

    /** =============================================================
     * End print report
     */
     public function  P_EndPrint ()  {
     }

    /** =============================================================
     * End of list
     * @param $Block
     * @param $Data
     * @return bool
     */
     public function  P_EndList ($Block, $Data)  {
        $value = false;
    	return $value;	
     }

    /**  ============================================================
     * View report
     * @param $Type
     * @return string
     */
    public function  P_View ($Type) {
        $filename=$this->_p_name_form.date("Y-m-d");
        if (($Type=='XLSX')or($Type=='xlsx'))  {

            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="'.$filename.'.xlsx"');
     	    header('Cache-Control: max-age=0');

     	    $this->objWriter = PHPExcel_IOFactory::createWriter($this->_p_form, 'Excel2007');
            $this->objWriter->save('php://output');

     	    unset($this->objWriter);
     	    unset($this->objWorksheet);
     	    unset($this->objReader);
     	    unset($this->_p_form);
     	    exit();

        };

        if (($Type=='xls') or ($Type=='XLS')) {

             header('Content-Type: application/vnd.ms-excel');
 		     header('Content-Disposition: attachment;filename="'.$filename.'.xls"');
 		     header('Cache-Control: max-age=0');

 		     $this->objWriter = PHPExcel_IOFactory::createWriter($this->_p_form, 'Excel5');
             //$this->objWriter->save('php://output');
             $this->objWriter->save("workxls.xls");

 		     unset($this->objWriter);
 		     unset($this->objWorksheet);
 		     unset($this->objReader);
 		     unset($this->_p_form);
 		     exit();
    };

    if  (($Type=='PDF') or ($Type=='pdf')){

        header('Content-Type: application/vnd.pdf');
 		header('Content-Disposition: attachment;filename="'.$filename.'.pdf"');
 		header('Cache-Control: max-age=0');

 		$this->objWriter = PHPExcel_IOFactory::createWriter($this->_p_form, 'PDF');
        //$this->objWriter->save('php://output');
        $this->objWriter->save("workpdf.pdf");
 		exit();

        /** <p>
         *   <a href="http://docs.google.com/viewer?url=http://www.freeserver.su/temp/test.pdf&embedded=true" target="_blank">
         *   test.pdf - откроется в новом окне на полный экран</a></p>
         *   <p>
        */
    };

    if (($Type=='html') or ($Type=='HTML') or ($Type=='')){

        $this->objWriter = new PHPExcel_Writer_HTML($this->_p_form);

        // Generate HTML
        $html = '';
        $html .= $this->objWriter->generateHTMLHeader(true);
        $html .= $this->objWriter->generateSheetData();
        $html .= $this->objWriter->generateHTMLFooter();
        $html .= '';
        $this->_p_form->disconnectWorkSheets();
        unset($this->objWriter);
        unset($this->objWorksheet);
        unset($this->objReader);
        unset($this->_p_form);

        return $html;

    };

    }
//  print line without block ----------------------------------
    public function  P_PrintLine ($Data)  {
    }
//  get old value field   -------------------------------------
    public function  P_GetOldValue($Block, $Field) {
    }
//  print block�-----------------------------------------------
    public function  P_Print ($Block, $Databl)  {
    //$prblk=2;
    //$tekrow=10;
    if (is_null($Block)) return 'null';
    if (is_null($Databl)) { $Databl = array(); };


    $qq1=$this->_p_blc[$Block];
    $qq2=$this->_p_prn[$Block];
    $qq3=$this->_p_sty[$Block];
    $qq4=$this->_p_vlh[$Block];
    $qq5=$this->_p_lin[$Block];
    
    foreach ( $qq1 as $key => $value) {

       $val=$value->getColumn();
       $row=$value->getRow();
       $stl=$value->getValue();
       $ww = $qq3[$key]; 
       $i= $row+$this->_p_line;

       $ll = $this->_p_form->getActiveSheet()->getRowDimension($row)->getRowHeight();
       $this->_p_form->getActiveSheet()->getRowDimension($i)->setRowHeight($ll);

       $ee = $this->_p_form->getActiveSheet()->getStyle($key);
       $this->_p_form->getActiveSheet()->duplicateStyle( $ee, $val . $i );
       $this->_p_form->getActiveSheet()->setCellValue($val . $i, $stl);
    
    };
    $tt=0;
    foreach ( $qq2 as $key => $value) {
       $val=$value->getColumn();
       $row=$value->getRow();
       $i= $row+$this->_p_line;

       $ll = $this->_p_form->getActiveSheet()->getRowDimension($row)->getRowHeight();
       $this->_p_form->getActiveSheet()->getRowDimension($i)->setRowHeight($ll);

       $ee = $this->_p_form->getActiveSheet()->getStyle($key);
       $this->_p_form->getActiveSheet()->duplicateStyle( $ee, $val . $i );
       
       if (is_null($Databl[$tt])) { $dd=""; }
          { $dd = $Databl[$tt]; };

       $this->_p_form->getActiveSheet()->setCellValue($val . $i, $dd);
       $tt=$tt+1;
    };
    $this->_p_line = $this->_p_line + $qq5;
    }
//  read form for report --------------------------------------
    public function  P_ReadForm ($Form, $Type) {
       if (!file_exists($Form+".xls")) {
          //           	
       
       };
       //
       $this->_p_name_form = $Form;
       $this->_p_list = 1;
       $this->_p_line = 0;
       $this->_p_topl = false;
       $this->_p_endl = false;
       // 
       $tekrow  = 0;
       $tekvalbl= '';
       $tekblock= array();
       $tekprint= array();
       $tekstyle= array();
       $tekform = array();
       $tekvalh = 0;
       $tekline = 0;
       $this->_p_blc = array();
       $this->_p_prn = array();
       $this->_p_sty = array();
       $this->_p_vlh = array();
       $this->_p_lin = array();
       $this->_p_style= array();
       $vval='';
       $this->cells = array();

       // read form

       $this->_p_reader= PHPExcel_IOFactory::createReader('Excel5');
       $_p_fname = $Form.".xls";

       $this->_p_form = $this->_p_reader->load("$_p_fname");
       $this->_p_form->setActiveSheetIndex(0);
       $this->_p_sheet= $this->_p_form->getActiveSheet();

       foreach ($this->_p_sheet->getRowIterator() as $row) {

          $cellIterator = $row->getCellIterator();
          $cellIterator->setIterateOnlyExistingCells(true);
          $rrow = $row->getRowIndex();

          $rowh = $this->_p_form->getActiveSheet()->getRowDimension($rrow)->getRowHeight();
          $this->_p_form->getActiveSheet()->getRowDimension($rrow)->setVisible(false);

          foreach ($cellIterator as $cell) {

              $value = '';
  	          $ccol  = $cell->getColumn();
              $value = $cell->getValue();
              $name  = $ccol.$rrow;

              if ($ccol=='A') {
                  $vval = $cell->getValue();
                  $tekline=1;
              };
       
   	      if (($ccol=='A') and ($vval<>$tekvalbl)) {
	         if ($tekvalbl>'') {
	   	        $this->_p_blc[$tekvalbl]=$tekblock;
	            $this->_p_prn[$tekvalbl]=$tekprint;
	            $this->_p_sty[$tekvalbl]=$tekstyle;
                $this->_p_vlh[$tekvalbl]=$tekvalh;
                $this->_p_lin[$tekvalbl]=$tekline;
                 	           
	            //$cells[$tekvalbl]['style'] = 
                $tekblock= array();
                $tekprint= array();
                $tekstyle= array();
	            $tekvalbl=$vval;   	
	            $tekvalh =0;
	            $tekline =0;
	            }
	         else { $tekvalbl=$vval; };
	      };
	      
	      if ($tekvalbl==$vval) {
             if (!($value>'')) { $value=''; };
	  	     $kod=':';
             $pos=false;

	  	     if ($value>'') {
                 $pos = strpos($value, $kod);
                 if (!($pos === false)) {
   	                 $tekprint[$value] = $name;
   	             };
	  	     };
             if (($pos==false) and (!($ccol=='A'))) {
	             $tekblock[$name] = $cell->getValue();
                 $tekstyle[$name] = $this->_p_form->getActiveSheet()->getStyle($name);
                 $ww=array();
                 $style= $this->_p_form->getActiveSheet()->getStyle('B4')->getStyleArray($ww);
                 $rr='';

             };
	      };
          };

          $tekvalh = $tekvalh + $rowh;
	      $tekline = $tekline + 1;
	      $tekrow  = $tekrow  + 1;
     
       };

       $this->_p_blc[$tekvalbl]=$tekblock;
       $this->_p_prn[$tekvalbl]=$tekprint;
       $this->_p_sty[$tekvalbl]=$tekstyle;
       $this->_p_vlh[$tekvalbl]=$tekvalh;
       $this->_p_lin[$tekvalbl]=$tekline;
       //
       $this->_p_line = $tekrow;

       $vl = true;
       return $vl;
    }       
//  get sum   -------------------------------------------------
    public function  P_SumField ($Kod, $Field, $Value) {
    }
//  get sum   -------------------------------------------------
    public function  P_GetSum ($Kod, $Type) {
    }
//  skip line -------------------------------------------------
    public function  P_Skip ($value)  {
    }
//  top of list   ---------------------------------------------
    public function  P_TopList($block, $data) {
    }
//  get currently line    -------------------------------------
    public function  P_GetNumLine() {
    }
// get currently list    
    public function  P_GetNumList() {
    }
// ===============================================================================
//  pform 
//===============================================================================
}