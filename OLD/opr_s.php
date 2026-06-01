<?php
//=====================================================================================================================
// control new document
//=====================================================================================================================
function ConNewDoc($conn, $record, $kdus) {
    // account
    $lg ='';

    // main dir =======================================================================================
    $sprarm = $conn->query( 'SELECT * FROM sprarm');
    if ($sprarm->rowCount() == 0) { RETURN "ConNewDoc: Error 1"; }

    //=================================================================================================
    if (count($record)==0) {RETURN "UNKNOWN OPERATION. 001"; }

    //=================================================================================================
    // check code operation
    if (isset($record['kd_op'])) {
        $kod = $record['kd_op'];
        if (!(($kod='1') or ($kod='2') or ($kod='3') or ($kod='5') or ($kod='4') or
            ($kod='7') or ($kod='9'))) {
            RETURN "UNKNOWN OPERATION.002"	;
        };
    }
    else {RETURN "UNKNOWN OPERATION.003"; }

    //=================================================================================================
    //  check number document
    if ((!isset($record['kd_dk'])) or ($record['kd_dk']=='')) { RETURN "ENTER DOCUMENT NUMBER.";}

   //  check date document============================================================================
    if ((!isset($record['dt_dk'])) or ($record['dt_dk']=='')) { RETURN "ENTER DATE DOCUMENT.";}
    if ( $record['dt_dk']<=$sprarm->fields['dt_zk']) { RETURN "PERIOD IS CLOSED FOR JOB"; }

    //=================================================================================================
    // check exist document
    $rec = taDOKP($conn, $record['kd_dk'], $record['dt_dk'], $record['kd_op']);
    if ($rec->rowCount()>0) {RETURN "DOCUMENT EXISTS"; }

    // check receiving ================================================================================
    if ($kod=='1') {
        if ((!isset($record['nm_sk'])) or ($record['nm_sk']=='')) { RETURN "ENTER VALUE OF THE WAREHOUSE";}
        if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION";}
        if ((!isset($record['kd_ps'])) or ($record['kd_ps']=='')) { RETURN "ENTER VALUE OF THE COMPANY";}
    }
   // check shiping ==================================================================================
    if ($kod=='2') {
        if ((!isset($record['nm_sk'])) or ($record['nm_sk']=='')) { RETURN "ENTER VALUE OF THE WAREHOUSE";}
        if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION";}
        if ((!isset($record['kd_ps'])) or ($record['kd_ps']=='')) {
            if ((!isset($record['ou_sk'])) or ($record['ou_sk']=='')) { RETURN "ENTER VALUE OF THE COMPANY OR WAREHOUSE"; }
        }
        if ((isset($record['nm_sk'])) and (isset($record['ou_sk']))) {
            if ($record['ou_sk'] == $record['nm_sk']) { RETURN "WAREHOUSES SHOULD NOT BE EQUAL"; }
        }
    }

    //check order =====================================================================================
    if ($kod=='4') {
        if ((!isset($record['ou_ps'])) or ($record['ou_ps']=='')) { RETURN "ENTER VALUE OF THE COMPANY(OUT)"; }
        if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION"; }
        if ((!isset($record['kd_ps'])) or ($record['kd_ps']=='')) { RETURN "ENTER VALUE OF THE COMPANY"; }
    }

    //check ==========================================================================================
    if ($kod=='5') {
        if ((!isset($record['nm_sk'])) or ($record['nm_sk']=='')) { RETURN "ENTER VALUE OF THE WAREHOUSE";}
        if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION";}
        if ((!isset($record['nm_ka'])) or ($record['nm_ka']=='')) { RETURN "ENTER VALUE OF THE BANK";}
    }

    //check ==========================================================================================
    if ($kod=='3') {
        if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION"; }
        if ((!isset($record['nm_ka'])) or ($record['nm_ka']=='')) { $nmk=''; } else {$nmk=$record['nm_ka']; }
        if ((!isset($record['kd_kl'])) or ($record['kd_kl']=='')) { $kkl=''; } else {$kkl=$record['kd_kl']; }
        if (($nmk=='') and ($kkl=='')) {RETURN "ENTER VALUE OF THE BANK OR PERSON"; }
        if (($nmk>'')  and ($kkl>''))  {RETURN "ENTER VALUE OF THE BANK OR PERSON"; }

    }

    //check manufacture storno ========================================================================
    if ($kod=='7') {
        if ((!isset($record['nm_sk'])) or ($record['nm_sk']=='')) { RETURN "ENTER VALUE OF THE WAREHOUSE";}
        if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION";}
    }

    //check discount ==================================================================================
    if ($kod=='9') {
        if ((!isset($record['nm_sk'])) or ($record['nm_sk']=='')) { RETURN "ENTER VALUE OF THE WAREHOUSE";}
        if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION";}
    }
    // возвращяем пустоту. Все нормально
    RETURN "";
}

//===============================================================================
// control operation 
//===============================================================================
function ConOpr($conn, $oper, $file, $kdus) {

return '';
}

//===============================================================================
// delete document 
//===============================================================================
function deldoc($conn, $nmzpd, $kdus) {
// delete document
$lg ='';
if ($nmzpd==0) { RETURN "DelDoc: Error 3"; };

// main dir 
$sqlarm = ' select * from sprarm '; 
$sprarm = $conn->SelectLimit($sqlarm,1,0);
if ($sprarm->RecordCount() == 0) { RETURN "DelDoc: Error 1"; };

$dokrec = QDOK($conn, $lg, $nmzpd);
if ($dokrec->RecordCount() == 0) { RETURN "DelDoc: Error 2"; };
$dok = $dokrec->fields;
 
// read operation ==================================
$oprrec = taOPR($conn, $lg, $dok['nm_zp']);

// take all operatio =====================================
while (!$oprrec->EOF) {
     $opr  = $oprrec->fields; 
     $nmzp = $opr['nm_zp'];
     if (($dok['kd_op']<>'4') and ($opr['st_dk']=='0') and 
        (!(($opr['kd_st']=='Delete') or ($opr['kd_st']=='Not found'))))
        { RETURN "THERE ARE ACTIVE LINES REMOVAL IT IS IMPOSSIBLE"; };
     $oprrec->MoveNext();
}; 
// delete cth
$sqlres = " delete from ms_cth where nm_zpd=$nmzpd" ;
$conn->Execute($sqlres);               
// delete sum
$sqlres = " delete from ms_sum where nm_zpd=$nmzpd" ;
$conn->Execute($sqlres);               
// delete rab
$sqlres = " delete from ms_rab where nm_zpd=$nmzpd" ;
$conn->Execute($sqlres);               
// delete obp
$sqlres = " delete from ms_obp where nm_zpd=$nmzpd" ;
$conn->Execute($sqlres);               
// delete reserv
$sqlres = " delete from ms_res where nm_zpd=$nmzpd" ;
$conn->Execute($sqlres);               
// delete opr
$sqlres = " delete from ms_opr where (nm_zpd=$nmzpd) and ((st_dk='1') or (kd_st='Delete') or (kd_st='Not found') or (kd_op='4'))" ;
$conn->Execute($sqlres);               
// check operation
$oprrec = taOPR($conn, $lg, $dok['nm_zp']);
$kk=0;
while (!$oprrec->EOF) {
     $opr  = $oprrec->fields; 
     $nmzp = $opr['nm_zp'];
     $kk =$kk+1;
     $oprrec->MoveNext();
}; 
if ($kk==0) {
   // delete dok
   $sqlres = " delete from ms_dok where nm_zp=$nmzpd" ;   
   $conn->Execute($sqlres);               
}
RETURN "";
}

//=====================================================================================================================
// generate component 
//=====================================================================================================================
function RasProd($conn, $nmzpd, $kdus) {
$lg='';
// read document
$dokrec = QDOK($conn, $lg, $nmzpd);
if ($dokrec->RecordCount() == 0) { RETURN "ObrPriD: Error 2"; };
$dok = $dokrec->fields;
 $nmsk=$dok['nm_sk'];
// delete old information	
$oprrec = taOPR($conn, $lg, $nmzpd);
while (!$oprrec->EOF) {
     $opr  = $oprrec->fields; 
     $nmzp = $opr['nm_zp'];
     //
     if (($opr['st_dk']=='0') and (!(($opr['kd_st']=='Delete') or ($opr['kd_st']=='Not found'))))
        { RETURN "THERE ARE ACTIVE LINES REMOVAL IT IS IMPOSSIBLE"; }
     else {
     	$sqlres = " delete from ms_opr where nm_zp=$nmzp" ;
        $res = $conn->Execute($sqlres);               
     };
     $oprrec->MoveNext();
}; 
// total all record for seek in warehouse
$sqlz="
 select p.nm_zpd, p.kl_iz, p.st_izs,
        iz.kd_im as kdimiz,
        iz.kd_st as kdstiz,
        sum(p.kl_iz * iz.kl_iz) as klob
from ms_obp p
        right join ms_izd iz on iz.nm_zpi=p.nm_izm
where nm_zpd=$nmzpd
group by kdimiz,kdstiz ";
//
$izrec = $conn->Execute($sqlz);

// take components from warehouse
while (!$izrec->EOF) {
  $izf  = $izrec->fields; 
  $kdim = $izf['kdimiz'];
  $kolvb= round($izf['klob'],4);
  $qskl  ="
    select * from ms_skl
    where ((nm_sk=$nmsk) and (kd_im=$kdim) and (kol_tk>0))
    order by dt_prs,kol_tk "; 
  $qsklrec = $conn->Execute($qskl);
  if ($qsklrec->RecordCount() >0) {
      while (!$qsklrec->EOF) {
         $qskl = $qsklrec->fields;
         if (round($qskl['kol_tk'],4)>=$kolvb) { $kolop=$kolvb;} 
         else { $kolop=$qskl['kol_tk']; }; 
 
         $kolvb = $kolvb - $kolop;
         
         // add record ms_opr
         $record = array();
         $record['kd_dk']  = $dok['kd_dk'];
         $record['dt_dk']  = $dok['dt_dk'];
         $record['kd_op']  = $dok['kd_op'];
         $record['st_dk']  = $dok['st_dk'];
         $record['pr_ch']  = $dok['pr_ch'];
         
         $record['kd_ps']  = $dok['kd_ps'];  
         $record['nm_ka']  = $dok['nm_ka'];  
         $record['nm_sk']  = $dok['nm_sk'];  
         $record['ou_sk']  = $dok['ou_sk'];  
         $record['pr_prd'] = $dok['pr_prd'];  
         $record['pr_prz'] = $dok['pr_prz'];  
         $record['nm_zak'] = $dok['nm_zak'];  

         $record['nm_zpd'] = $dok['nm_zp'];
         $record['nm_zpo'] = $qskl['nm_zpo'];
         $record['nm_zps'] = $qskl['nm_zp'];
         $record['nm_zpr'] = $qskl['nm_zpr'];

         $record['kd_kl']  = $qskl['kd_kl'];
         $record['ed_iz']  = $qskl['ed_iz'];
         $record['bs_iz']  = $qskl['bs_iz'];
         $record['kd_tg']  = $qskl['kd_tg'];
         $record['kd_ds']  = $qskl['kd_ds'];
         $record['kd_st']  = $qskl['kd_st'];
         $record['kd_md']  = $qskl['kd_md'];
         $record['kd_im']  = $qskl['kd_im'];
         $record['kol_op'] = round($kolop,4);
         $record['sm_op']  = $qskl['sm_tk'];
         $record['sm_opdl']  = $qskl['sm_tkdl'];
         $record['kol_op1']  = round($qskl['kol_tk'],4);
         $record['sm_op1']   = $qskl['sm_tk'];
         $record['sm_op1dl'] = $qskl['sm_tkdl'];
         $record['pr_aa']  = $qskl['pr_aa'];
         $record['pr_op']  = '-';
         //
         $conn->AutoExecute('ms_opr', $record, 'INSERT');
         if ($kolvb==0) { break; };
         $qsklrec->MoveNext();
      };
  }; 
  if ($kolvb>0) {
      $record = array();
      $record['kd_dk']  = $dok['kd_dk'];
      $record['dt_dk']  = $dok['dt_dk'];
      $record['kd_op']  = $dok['kd_op'];
      $record['st_dk']  = $dok['st_dk'];
      $record['pr_ch']  = $dok['pr_ch'];
      
      $record['kd_ps']  = $dok['kd_ps'];  
      $record['nm_ka']  = $dok['nm_ka'];  
      $record['nm_sk']  = $dok['nm_sk'];  
      $record['ou_sk']  = $dok['ou_sk'];  
      $record['pr_prd'] = $dok['pr_prd'];  
      $record['pr_prz'] = $dok['pr_prz'];  
      $record['nm_zak'] = $dok['nm_zak'];  

      $record['nm_zpd'] = $dok['nm_zp'];
      $record['kd_st']  = 'Not found';
      $record['kd_im']  = $kdim;
      $record['kol_op'] = round($kolvb,4);
      $record['pr_aa']  = $qskl['pr_aa'];
      $record['pr_op']  = '-';
      $conn->AutoExecute('ms_opr', $record, 'INSERT');
 };    
  $izrec->MoveNext();
};      
if ($dok['kd_op']=='7') {
   // manufacture
   $sqlz="
   select *
   from ms_obp p
   where nm_zpd=$nmzpd ";
   // add new product in document
   $izrec = $conn->Execute($sqlz);
   while (!$izrec->EOF) {
       $izf  = $izrec->fields; 
       $kdim = $izf['kd_im'];
       $kolvb= round($izf['klob'],4);
       //	
   	   $record = array();
       $record['kd_dk']  = $dok['kd_dk'];
       $record['dt_dk']  = $dok['dt_dk'];
       $record['kd_op']  = $dok['kd_op'];
       $record['st_dk']  = $dok['st_dk'];
       $record['pr_ch']  = $dok['pr_ch'];
         
       $record['kd_ps']  = $dok['kd_ps'];  
       $record['nm_ka']  = $dok['nm_ka'];  
       $record['nm_sk']  = $dok['nm_sk'];  
       $record['ou_sk']  = $dok['ou_sk'];  
       $record['pr_prd'] = $dok['pr_prd'];  
       $record['pr_prz'] = $dok['pr_prz'];  
       $record['nm_zak'] = $dok['nm_zak'];  

       $record['nm_zpd'] = $dok['nm_zp'];
       $record['kd_st']  = $izf['kd_st'];
       $record['kd_im']  = $kdim;
       $record['kol_op'] = round($kolvb,4);
       $record['sm_op']  = $izf['st_izs'];
       $record['sm_opdl']= $izf['st_izd'];
       $record['sm_op1']  = $izf['st_izs'];
       $record['sm_op1dl']= $izf['st_izd'];
       $record['pr_op']  = '+';
       $conn->AutoExecute('ms_opr', $record, 'INSERT');
       //
	   $izrec->MoveNext();
   };
};
return '';   
};

//===============================================================================
//  
//===============================================================================
?>