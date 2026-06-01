<?php
//===============================================================================
//  OBRPRID
//===============================================================================
function ObrPriD($conn, $nmzpd, $kdus) {
// receiving document
 
 $Result = '';
 $lg ='';
 // main dir ==============================================
 $sqlarm = ' select * from sprarm '; 
 $sprarm = $conn->SelectLimit($sqlarm,1,0);
 if ($sprarm->RecordCount() == 0) { RETURN "ObrPriD: Error 1"; };

 $dokrec = QDOK($conn, $lg, $nmzpd);
 if ($dok->RecordCount() == 0) { RETURN "ObrPriD: Error 2"; };
 $dok = $dokrec->fields;
 
 // check period ==========================================
 if ( $dok['dt_dk']<=$sprarm->fields['dt_zk']) { RETURN "PERIOD IS CLOSED FOR JOB"; };

 // check type operation ==================================
 if  (! ($dok['kd_op']='1')) { RETURN "ObrPriD: Error 3"; };
 
 $s_smdk = 0;
 $s_smdkdl =0;
 $kdps=$dok['kd_ps'];
 
 // open price ============================================
 $sqlprice = " select * from sprprs where kd_ps=$kdps "; 
 $pricerec = $conn->Execute($sqlprice);
 if ($price->RecordCount() == 0) {
    $record = array();
    $record["kd_ps"]  = $dok['kd_ps'];
    $record["im_prs"] = $dok['kdps'];
    $record["dt_prs"] = $dok['dt_dk'];
    $conn->autoexecute('sprprs', $record, 'insert');
    $pricerec = $conn->Execute($sqlprice);
 };

 // open ms_opr ===========================================
 $oprrec = taOPR($conn, $lg, $dok['nm_zp']);

 // take all operatio =====================================
 while (!$oprrec->EOF) {

     $opr  = $oprrec->fields; 
     $nmzp = $opr['nm_zp'];
     
     // total document ====================================�
     if ($opr['pr_op']=='+') { $s_smdk = $s_smdk + ($opr['kol_op'] * $opr['sm_op1']);}
     else { $s_smdk = $s_smdk - ($opr['kol_op'] * $opr['sm_op1']); }

     // check not ready operation =============================  
     if ($opr['st_dk'] =='1') {

        // find description
        if ($opr['nm_zpo'] > 0) {
           $nmzpo = $opr['nm_zpo'];
           $sqlops = " select * from ms_ops where nm_zp=$nmzpo "; 
           $opsrec = $conn->Execute($sqlops);
           if ($opsrec->RecordCount() == 0) {$opr['nm_zpo'] == 0; };
           if ($opsrec->fields['kd_im'] != $opr['kd_im']) {$opr['nm_zpo'] == 0; };
        };
        // if no description ================================== 
        if ($opr['nm_zpo'] == 0) {
           $record = array();
           $record["kd_kl"] = $opr['nm_zp'];
           $conn->AutoExecute('ms_ops',$record,'insert');
           
           // find add description  �
           $nmzpo = $opr['nm_zp'];
           $sqlops = " select * from ms_ops where kd_kl=$nmzpo "; 
           $opsrec = $conn->Execute($sqlops);
        };
        if ($opsrec->RecordCount() == 0) { RETURN "ObrPriD: Error 4"; };
        $nmzpo = $opsrec->fields['nm_zp'];

        // remember description in the operation ==============
        $record = array();
        $record['nm_zpo'] = $nmzpo;
        $updateSQL = $conn->AutoExecute ('ms_opr', $record, 'update', "where nm_zp= $nmzp ");

        // looking for warehouse record =======================�
        $sklrec = QSKLP($conn, $lg, $opr['nm_zps'], $opr['nm_zpo'], 0);
        if ($sklrec->RecordCount() == 0) {
           // if not found insert =============================
           $record = array();
           $record["nm_zps"] = $opr['nm_zp'];
           $record["nm_zpo"] = $opr['nm_zpo'];
           $conn->AutoExecute('ms_skl',$record,'insert');
           // looking for insert record 
           $sklrec = QSKLP($conn, $lg, 0, $opr['nm_zpo'], $opr['nm_zp']);
           if ($sklrec->RecordCount()>1) {RETURN "ObrPriD: Error 5"; };
        };

        $nmzps = $sklrec->fields['nm_zp'];
        $nmzpn = 0;
        
        if ($nmzps == 0) {RETURN "ObrPriD: Error 5"; };

        // update warehouse record ===============================
        $record = array();
        $record['nm_sk']  = $opr['nm_sk'];
        $record['kd_ps']  = $dok['kd_ps'];
        $record['kd_pd']  = $opr['sk_pd'];
        $record['ps_pd']  = $opr['ps_pd'];
        $record['pr_zp']  = '1';
        $record['kd_pd']  = $opr['sk_pd'];
        
        $record['nm_zpo'] = $nmzpo;
        $record['nm_zps'] = 0;
        $record['nm_zpr'] = $opr['nm_zp'];

        $record['dt_prs'] = $dok['dt_dk'];
        $record['nm_par'] = $opr['nm_par'];
        $record['kd_kl']  = $opr['kd_kl'];
        
        $record['ed_iz']  = $opr['ed_iz'];
        $record['kd_tg']  = $opr['kd_tg'];
        $record['kd_ig']  = $opr['kd_ig'];
        $record['kd_st']  = $opr['kd_st'];
        $record['kd_md']  = $opr['kd_md'];
        $record['bs_iz']  = $opr['bs_iz'];
        $record['sm_tk']  = $opr['sm_op'];
        $record['sm_tkdl'] = $opr['sm_opdl'];

        $record['dt_us']  = $dok['dt_dk'];
        $record['kol_tk'] = $opr['kol_op'];
        $record['kd_ds']  = $opr['kd_ds'];
        $record['pr_aa']  = $opr['pr_aa'];
        $record['nm_zak'] = $opr['nm_zak'];
        
        $updateSQL = $conn->AutoExecute ('ms_skl', $record, 'update', "where nm_zp= $nmzps ");

        // update description record ==============================��
        $record = array();
        $record['kd_dk']  = $dok['kd_dk'];
        $record['dt_dk']  = $dok['dt_dk'];
        $record['kd_op']  = $dok['kd_op'];
        
        $record['kd_im']  = $opr['kd_im'];
        $record['kd_ps']  = $opr['kd_ps'];
        $record['pr_dl']  = '0';
        $record['kl_pr']  = $opsrec->fields['kl_pr'] + $opr['kol_op'];
        $record['sm_pr']  = $opr['sm_op1'];
        $record['sm_prdl']  = $opr['sm_op1dl'];

        $updateSQL = $conn->AutoExecute ('ms_ops', $record, 'update', "where nm_zp= $nmzpo ");

        // update operation record =================================��
        $record = array();
        $record['pr_ch']  = $dok['pr_ch'];
        $record['nm_zps'] = $nmzps;
        $record['st_dk']  = '0';
        $record['pr_zp']  = 0;
        $record['nm_ka']  = $dok['nm_ka'];
        $record['nm_zak'] = $dok['nm_zak'];

        $updateSQL = $conn->AutoExecute ('ms_opr', $record, 'update', "where nm_zp= $nmzp ");

        // open price list =========================================
        $zprsrec = ZPRS($conn, $lg, $opr['kd_im'], $opr['kd_ps'] );     
        if ($zprsrec->RecordCount() == 0) {
            // if not found create new price list 
        	$record = array();
            $record['kd_prs']  = $pricerec->fields['kd_prs'];
            $record['kd_ps']   = $dok['kd_ps'];
            $record['kd_im']  = $opr['kd_im'];
            $record['kd_st']  = $opr['kd_st'];
            $record['sm_sp']  = $opr['sm_op1'];
            $record['dt_prs'] = $dok['dt_dk'];
            $conn->AutoExecute('ms_prs',$record,'insert');
        }   
        else {
            if ($zprsrec->fields['dt_prs']<$dok['dt_dk']) {
            	// remember last price
            	$record = array();
                $record['dt_prs']  = $dok->fields['dt_prs'];
                $record['sm_sp']  = $opr['sm_op1'];
   
                $nmzprs = $zprsrec->fields['nm_zp'];  
                $updateSQL = $conn->AutoExecute ('ms_prs', $record, 'update', "where nm_zp = $nmzprs ");              }; 
        };
        
        // operation ready 
       	$record = array();
        $record['st_dk']  = '0';
        $updateSQL = $conn->AutoExecute ('ms_opr', $record, 'update', "where nm_zp = $nmzp ");
     };
     $oprrec->MoveNext();
 };
 // create account records
 // $textcth = RASCTH(1);

 // total sum ========================================================�
 $sumrec = taSUM($lg, $dok['kd_op'], $dok['dt_dk'], $dok['kd_dk'], 2);
 while (!$sumrec->EOF) {
     $s_smdk = $s_smdk +  $sumrec->fields['sm_op'];
     $sumrec->MoveNext();
 };

 // if was payment =================================================== 
 if ($dok['nm_ka']>0) {
   //�if need create new payment record��
   $imopk = $dok['prch'];
   $sqlspropk = " select * from spropk where im_op=$imopk "; 
   $spropkrec = $conn->Execute($sqlspropk);
   if ($spropkrec->RecordCount() == 0) {
      $record = array();
      $record['im_op']  = $imopk;
      $conn->AutoExecute('spropk', $record, 'insert');
      $spropkrec = $conn->Execute($sqlspropk);
   };

   //�open document fo payment =======================================
   $dokprec=taDOKP($conn, $dok['kd_dk'], $dok['dt_dk'], 3);
   // if need add new document�
   if ($dokprec->RecordCount() == 0) {
       $record = array();
       $record['kd_dk']  = $dok['kd_dk'];
       $record['dt_dk']  = $dok['dt_dk'];
       $record['kd_op']  = '3';
       $record['st_dk']  = '0';
       $record['pr_ch']  = $dok['pr_ch'];
       $record['nm_ka']  = $dok['nm_ka'];
       $record['kd_ps']  = $dok['kd_ps'];
       $record['ps_pd']  = $dok['kd_dk'];     
       $record['pr_us']  = $kdus;
       $conn->AutoExecute('ms_dok', $record, 'insert');
   };	 
   
   // update payment operation
   $record = array();
   $record['kd_dk']  = $dok['kd_dk'];
   $record['dt_dk']  = $dok['dt_dk'];
   $record['kd_op']  = '3';
   $record['st_dk']  = '0';
   $record['pr_ch']  = $dok['pr_ch'];
   $record['nm_ka']  = $dok['nm_ka'];
   $record['kd_dkk'] = $dok['kd_dk'];
   $record['dt_dkk'] = $dok['dt_dk'];     
   $record['nm_zpd'] = $dokprec->fields['nm_zp'];
   $record['kd_ps']  = $dok['kd_ps'];
   $record['ps_pd']  = $dok['ps_pd'];
   $record['pr_us']  = $kdus;
   $record['kd_opk'] = $spropkrec->fields['kd_opk'];
   $record['sm_op1'] = $s_smdk;
   $record['sm_op1dl']  = $s_smdkdl;
   $record['pr_op']  = '-';
   $conn->AutoExecute('ms_opr', $record, 'insert');
};  
//mark document as ready 
$record = array();
$record['st_dk']  = '0';
$record['dt_ob']  = date();
$record['pr_us']  = $kdus;
$record['sm_zd']  = $s_smdk;
$record['sm_zddl']  = $s_smdkdl;
$record['kr_kr']  = $spropkrec->fields['kr_dol'];
$updateSQL = $conn->AutoExecute ('ms_dok', $record, 'update', "where nm_zp= $nmzpd ");

RETURN '';   
};   
//===============================================================================
//  OBRRASD
//=============================================================================
function ObrRasD($conn, $nmzpd, $kdus) {
// shiping

$Result = '';
$lg ='';

// main dir 
$sqlarm = ' select * from sprarm '; 
$sprarm = $conn->SelectLimit($sqlarm,1,0);
if ($sprarm->RecordCount() == 0) { RETURN "ObrRasD: Error 1"; };
 
$s_smdk = 0;
$s_smdkdl = 0;

$dokrec = QDOK($conn, $lg, $nmzpd);
if ($dokrec->RecordCount() == 0) {RETURN "ObrRasD: Error 2"; };
 
$dok = $dokrec->fields;
 
// check date  ======================================
if ( $dok['dt_dk']<=$sprarm->fields['dt_zk']) { RETURN "PERIOD IS CLOSED FOR JOB"; };

// check type  ======================================
if  (! (($dok['kd_op']='2') or ($dok['kd_op']='5')))  { RETURN "ObrRasD: Error 3"; };

// read operations 
$oprrec = taOPR($conn, $lg, $dok['nm_zp']);
$s_smdk =0;


// exec operations
$tstr =0;
while (!$oprrec->EOF) {

     $opr  = $oprrec->fields; 
     $nmzp = $opr['nm_zp'];

     if ($opr['pr_op']=='+')  
          { $s_smdk = $s_smdk + ($opr['kol_op'] * $opr['sm_op']); }
     else { $s_smdk = $s_smdk - ($opr['kol_op'] * $opr['sm_op']); };

     if ($opr['st_dk']=='1') {
        // if operation not ready
        $qsklprec = QSKLp($conn,$lg, $opr['nm_zps'], $opr['nm_zpo'], 0);
        $qsklp = $qsklprec->fields;
        $tstr  =  $this + 1;
        $nmzps = $opr['nm_zps'];
        $nmzpe = $qsklp['nm_zp'];
        $nmzpp = 0;
        $nmzpa = 0;
        $kolsk = 0;
        
        // check operation and warehouse 
        if (!(($qsklp['kd_im'] == $opr['kd_im']) and
              ($qsklp['kd_st'] == $opr['kd_st']))) 
              { RETURN "ObrRasD :PROCESSING STOPPED. INVALID DATA."; };
       
        // check quantity 
        if (($qsklp['kol_tk'] - $opr['kol_op'] < 0) or
            (($qsklp['pr_zp'] =='0') and ($opr['kol_op']>0)))
            { RETURN "ObrRasD: NOT NECESSARY QUANTITY " + $opr['kdim']; };

        // remove operation
        if ($dok['ou_sk']>0) {
            $qsklp1rec = QSKLP1($conn,$lg, $opr['nm_zpp'], $opr['nm_zpo'], 0);
            $qsklp1 = $qsklp1rec->fields;
            
            // check address warehouse record
            if ($qsklp1rec->RecordCount()==0) {
               // create new warehouse record
               $record = array();
               $record['nm_zps']  = -1;
               $record['nm_zpo']  = $opr['nm_zpo'];
               $conn->AutoExecute('ms_skl', $record, 'insert');

               $qsklp1rec = QSKLP1($conn,$lg, 0, $opr['nm_zpo'], -1);
               $qsklp1 = $qsklp1rec->fields;

               if ($qsklp1rec.RecordCount>1) {  RETURN "ObrRasD:','PROGRAM ERROR','004"; };
            };
            $nmzpp = $qsklp1['nm_zp'];
        };
        // updare warehouse record 
        $record = array();
        // update quntity 
        $kolp = ($qsklp['kol_tk'] - $opr['kol_op']);
        if ($kolp < 0.0001) { $kolp = 0; };
        $record['kol_tk'] = $kolp;
        // update date of change 
        if ($qsklp['dt_us'] < $dok['dt_dk']) {
        	$record['dt_us'] = $dok['dt_dk']; };
        // update soft reserve 
        if ($opr['pr_rzm']>0) {
            $record['kol_rzm'] =  $qsklp['kol_rzm']-$opr['kol_op']; };
        // if quntity fineshed make record not active 
        if ($kolp==0) {$record['pr_zp'] = '0'; }
        else {$record['pr_zp']='1'; };
        $updateSQL = $conn->AutoExecute ('ms_skl', $record, 'update', "where nm_zp= $nmzpe ");  
        
        $kolsk = $qsklp['kol_tk'];

        // change soft reserve 
        if ((($dok['kd_op']=='2') and ($dok['kd_ps']>0)) or
            ($dok['kd_op']=='5')) {

           $kdim = $opr['kd_im'];
           $klrs = $opr['kol_op'];

           $qresrec = QRES($conn,$lg, $kdim, $nmzpo);
           $qres=$qresrec->fields;          
  
           while (!$qresrec->EOF) {
               if (($qres['nm_zak']==$opr['nm_zak']) or
                   ($qres['nm_zpd']==$opr['nm_zpd'])) {
 
                   	$nmzpe = $qres['nm_zp'];
                   	
                   	if (klrs>=$qres['kl_rs']) {
                        $sqlres = " delete from ms_res where nm_zp=$nmzpe" ;
                        $conn->Execute($sqlres);               
                        $klrs =$klrs-$qres['kl_rs']; }
                    else {
                        $record = array();
                        $kltk = $qres['kl_rs'];
                        $record['kl_rs']  = $kltk-$klrs;
                        $updateSQL = $conn->AutoExecute ('ms_res', $record, 'update', "where nm_zp= $nmzpe ");  
                    };
                    break;           
               }
               else $qresrec->MoveNext();   
           };
       };
     
     // location
     $nmzpd = $opr['nm_zpd'];

     $sqllop = " 
        select m.*  
        from ms_lop m
        where m.nm_zpo=$nmzpo and m.nm_zpd=$nmzpd
        order by m.kol_lc desc ";

     $loprec = $conn->Execute($sqllop);
     $lop = $loprec->fields;          
  
     while (!$loprec->EOF) {
     	  $kdlc = $lop['kd_lc'];
          $nmsk = $lop['nm_sk'];
          $kollp= $lop['kol_lc'];
          
          $sqlloc = " 
          select m.*
          from ms_loc  m
          where (m.kd_lc=($kdlc)) and (m.nm_sk=($nmsk)) and (m.kd_im=($kdim)) ";

          $locrec = $conn->Execute($sqlloc);
          $loc=$locrec->fields;          
          
          while (!$locrec->EOF) {
               
          	   $nmzplc=$loc['nm_zp'];        
               $record = array();
               $kollc  = $loc['kol_lc'] - $kollp; 
               if ($kollc<0){$kollc=0;};
               $record['kol_lc']  = $kollc; 
               $updateSQL = $conn->AutoExecute ('ms_loc', $record, 'update', "where nm_zp= $nmzplc ");  

               $locrec->MoveNext();
          };  
          $loprec->MoveNext();
     }; 

     // sale
     if ((($dok['kd_op']=='2') and ($dok['nm_ka']>0)) and
        ($dok['kd_op']=='5')) {

        // discount number
        if ($opr['kd_dis']>0) {
           
           // currently discount 
           // create quary for discount
           $dtdk=$dok['dt_dk'];
           $sqlsds = " 
              select   sds. *, 
              zp.im_zp$lg as  kdzp
              from sprsds sds
              left join sprzp zp  on sds.kd_zp=zp.kd_zp ";
           $sdsrec = $conn->Execute($sqlsds);
           $sds=$sdsrec->fields;
           $ii=0;
           $sqlzap='';
           //       
           while (!$sdsrec->EOF) {

           	 if (($sds['kd_zp']>0) and
                 ((($sds['dt_sks']>0) and ($sds['dt_sks']<=$dtdk))
                    or ($sds['dt_sks']==0)) and
                 ((($sds['dt_skd']>0) and ($sds['dt_skd']>=$dtdk))
                    or ($sds['dt_skd']==0))) {

                 $kod= $sds['kd_zp'];
                 $sqlzp = " select   *.* from sprzp where kd_zp=$kod "; 
                 $sprzp = $conn->Execute($sqlzp);

                 if ($sprrec->RecordCount() >0) {
                     $textzp=$sprzp->fields['tx_zp']; 
                     if ($ii==0) {
                       $sqlzap=" 
                       select m.*,s.*   
                       from ms_skl m, sprsds s 
                       where (m.nm_zp=$nm_zp) and (s.kd_zp=$kod $textzp) "; }
                     else {$sqlzap=$sqlzap + " or (s.kd_zp=$kod  $textzp ) "; };
                                  
                 $ii=$ii+1;
                 };
             };
             $sdsrec->MoveNext();
           };      
           if ($ii>0) { $sqlzap=$sqlzap + ")"; };
  
           // find discount 
          $disrec = $conn->Execute($sqlzap);
          $dis=$disrec->fields;          

          while (!$disrec->EOF) {
             if ($dis['kol_tk']>0) {
                 // 
                 $qdisrec=QDIS($conn, $opr['kd_dis'],$dis['kd_zp']);
                 $qdis=$qdisrec->fileds;
                 if ($qdisrec->RecordCount()>0) {
                    $record = array();
                    $record['kd_dis']  = $opr['kd_dis'];
                    $record['kd_zp']   = $dis['kd_zp'];
                    $record['bs_dis']  = $opr['kol_op'] * $opr['bs_iz'];
                    $record['sc_dis']  = $opr['kol_op'] * $opr['sm_op'];
                    $record['sd_dis']  = $dis['kol_op'] * $opr['sm_opdl'];
                    $conn->AutoExecute('ms_dis', $record, 'insert'); }
                 else {
                    $nmzpdis = $qdis['nm_zp'];   
                 	$record = array();
                    $record['bs_dis']  = $qdis['bs_dis'] + ($opr['kol_op'] * $opr['bs_iz']);
                    $record['sc_dis']  = $qdis['sc_dis'] + ($opr['kol_op'] * $opr['sm_op']);
                    $record['sd_dis']  = $qdis['sd_dis'] + ($dis['kol_op'] * $opr['sm_opdl']);
                    $updateSQL = $conn->AutoExecute ('ms_dis', $record, 'update', "where nm_zp= $nmzpdis ");  
                 };   
             };    
             $disrec->MoveNext();
          };  
        };
     };
     
     // out warehouse}
     if ($dok['ou_sk'] > 0) {
        $record = array();
        $record['nm_sk']  = $opr['ou_sk'];
        $record['kd_pd']  = $opr['ou_pd'];
        $record['kd_ps']  = $qskl['kd_ps'];
        $record['ps_pd']  = $qskl['kd_ps'];
        $record['pr_zp']  = '1';
        $record['nm_zpo'] = $opr['nm_zpo'];
        $record['nm_zps'] = $qskl['nm_zp'];
        $record['dt_prs'] = $opr['dt_dk'];
        $record['nm_zpr'] = $opr['nm_zpr'];

        $record['kd_kl']  = $opr['kd_kl'];
        $record['ed_iz']  = $opr['ed_iz'];
        $record['kd_tg']  = $opr['kd_tg'];
        $record['kd_ig']  = $opr['kd_ig'];
        $record['kd_ds']  = $opr['kd_ds'];
        $record['kd_st']  = $opr['kd_st'];
        $record['kd_md']  = $opr['kd_md'];
        $record['kd_im']  = $opr['kd_im'];
        $record['bs_iz']  = $opr['bs_iz'];
        $record['dt_us']  = $dok['dt_dk'];
        $record['ed_iz']  = $opr['ed_iz'];
        $record['nm_par'] = $opr['nm_par'];
        $record['pr_aa']  = $opr['pr_aa'];
        $record['sm_tk']  = $opr['sm_op'];
        $record['sm_tkdl'] = $opr['sm_opdl'];
        $record['kol_tk'] = $opr['kol_op'];
        $record['nm_zak'] = $opr['nm_zak'];

        $updateSQL = $conn->AutoExecute ('ms_skl', $record, 'update', "where nm_zp= $nmzpp ");  

     // if move
     $nmzpa =0;
     if ($dok['ou_sk']>0) {
        // add new operation 
        $record = $oprrec->fields;
        unset($record['nm_zp']);
        $record['pr_op']  = '+';
        $record['st_dk']  = '0';
        $record['pr_dl']  = '1';
        $record['nm_sk']  = $opr['ou_sk'];
        $record['sk_pd']  = $opr['ou_pd'];
        $record['ou_sk']  = $opr['nm_sk'];
        $record['ou_pd']  = $opr['sk_pd'];
        $record['kd_ps']  = 0;
        $record['ps_pd']  = 0;

        $record['sm_op']  = $opr['sm_op'];
        $record['sm_op1'] = $opr['sm_op'];
        $record['sm_opdl']  = $opr['sm_opdl'];
        $record['sm_op1dl'] = $opr['sm_opdl'];
        $record['nm_zpa']  = $opr['nm_zp'];
        $record['nm_zpr']  = $opr['nm_zpr'];
        $record['nm_zpd']  = $opr['nm_zpd'];
        $record['nm_zps']  = $nmzpp;
        $record['nm_zpp']  = $nmzps;
        $record['pr_zp']   = 1;
        $conn->AutoExecute('ms_opr', $record, 'insert'); }
        // find insert record
        $sqlzap=" select from ms_opr where nm_zpa=$nmzp";
        $sqlrec = $conn->Execute($sqlzap);
        if ($sklrec.RecordCount>1) {  RETURN "ObrRasD:','PROGRAM ERROR','005"; };
        $nmzpa=$sklrec->fileds['nm_zp'];
     };   
     // correct operation
     $record = array();
     $record['nm_ka']  = $dok['nm_ka'];
     $record['nm_zak'] = $dok['nm_zak'];
     $record['pr_ch']  = $dok['pr_ch'];
     if ($dok['kd_op']=='5') {
            $record['kd_dkk']  = $dok['kd_dk'];
            $record['dt_dkk']  = $dok['dt_dk'];
     }; 
     $record['nm_zpd']  = $dok['nm_zp'];
     $record['nm_zps']  = $nmzps;
     $record['nm_zpp']  = $nmzpp;
     $record['nm_zpa']  = $nmzpa;
     $record['kol_op1'] = $kolsk;
     $record['st_dk']   = '0';
     if ($nmzpp>0) { $record['pr_zp'] = 1; }
     else { $record['pr_zp']  = 0; };

     $updateSQL = $conn->AutoExecute ('ms_opr', $record, 'update', "where nm_zp= $nmzp ");  
     };
        
     $oprrec->MoveNext();     
};

// account record
// $text =RASCTH(1);

// 
if ($s_smdk<0) {$s_smdk=$s_smdk*(-1);};

// total sum ========================================================�
 $sumrec = taSUM($lg, $dok['kd_op'], $dok['dt_dk'], $dok['kd_dk'], 2);
 while (!$sumrec->eof) {
     $s_smdk = $s_smdk +  $sumrec->fields['sm_op'];
     $sumrec->MoveNext();
 };

 // if was payment =================================================== 
 if (($dok['nm_ka']>0) and ($dok['kd_op']='2' or $dok['kd_op']='5')) {
 	//�if need create new payment record��
   $imopk = $dok['prch'];
   $sqlspropk = " select * from spropk where im_op=$imopk "; 
   $spropkrec = $conn->Execute($sqlspropk);
   if ($spropkrec->RecordCount() == 0) {
      $record = array();
      $record['im_op']  = $imopk;
      $conn->AutoExecute('spropk', $record, 'insert');
      $spropkrec = $conn->Execute($sqlspropk);
   };

   //�open document fo payment =======================================
   $dokprec=taDOKP($conn, $dok['kd_dk'], $dok['dt_dk'], 3);
   // if need add new document�
   if ($dokprec->RecordCount() == 0) {
       $record = array();
       $record['kd_dk']  = $dok['kd_dk'];
       $record['dt_dk']  = $dok['dt_dk'];
       $record['kd_op']  = '3';
       $record['st_dk']  = '0';
       $record['pr_ch']  = $dok['pr_ch'];
       $record['nm_ka']  = $dok['nm_ka'];
       $record['kd_ps']  = $dok['kd_ps'];
       $record['ps_pd']  = $dok['kd_dk'];     
       $record['pr_us']  = $kdus;
       $conn->AutoExecute('ms_dok', $record, 'insert');
   };	 
   
   // update payment operation
   $record = array();
   $record['kd_dk']  = $dok['kd_dk'];
   $record['dt_dk']  = $dok['dt_dk'];
   $record['kd_op']  = '3';
   $record['st_dk']  = '0';
   $record['pr_ch']  = $dok['pr_ch'];
   $record['nm_ka']  = $dok['nm_ka'];
   $record['kd_dkk'] = $dok['kd_dk'];
   $record['dt_dkk'] = $dok['dt_dk'];     
   $record['nm_zpd'] = $dokprec->fields['nm_zp'];
   $record['kd_ps']  = $dok['kd_ps'];
   $record['ps_pd']  = $dok['ps_pd'];
   $record['pr_us']  = $kdus;
   $record['kd_opk'] = $spropkrec->fields['kd_opk'];
   $record['sm_op1'] = $s_smdk;
   $record['sm_op1dl']  = $s_smdkdl;
   $record['pr_op']  = '-';
   $conn->AutoExecute('ms_opr', $record, 'insert');
};  
//mark document as ready 
$record = array();
$record['st_dk']  = '0';
$record['dt_ob']  = date();
$record['pr_us']  = $kdus;
$record['sm_zd']  = $s_smdk;
$record['sm_zddl']  = $s_smdkdl;
$record['kr_kr']  = $spropkrec->fields['kr_dol'];
$updateSQL = $conn->AutoExecute ('ms_dok', $record, 'update', "where nm_zp= $nmzpd ");

RETURN '';   
};   

//===============================================================================
//  OBRKASD
//=============================================================================
function ObrKasD($conn, $nmzpd, $kdus) {
// account
$lg ='';

// main dir 
$sqlarm = ' select * from sprarm '; 
$sprarm = $conn->SelectLimit($sqlarm,1,0);
if ($sprarm->RecordCount() == 0) { RETURN "ObrKasD: Error 1"; };
 
$s_smdk = 0;
$s_smdkdl = 0;

$dokrec = QDOK($conn, $lg, $nmzpd);
if ($dokrec->RecordCount() == 0) {RETURN "ObrKasD: Error 2"; };
 
$dok = $dokrec->fields;
 
// check date  ======================================
if ( $dok['dt_dk']<=$sprarm->fields['dt_zk']) { RETURN "PERIOD IS CLOSED FOR JOB"; };

// check type  ======================================
if  (! ($dok['kd_op']='3') )  { RETURN "ObrKasD: Error 3"; };

// read operations 
$oprrec  = taOPR($conn, $lg, $dok['nm_zp']);
$s_smdk  =0;
$s_smdkdl=0;

// exec operations
$tstr =0;
while (!$oprrec->EOF) {

     $opr  = $oprrec->fields; 
     $nmzp = $opr['nm_zp'];

     if ($opr['st_dk']=='1') {

         $record = array();
         $record['nm_ka']  = $dok['nm_ka'];
         $record['nm_zak'] = $dok['nm_zak'];
         $record['nm_zpd'] = $dok['nm_zp'];
         if ($opr['kd_dkk']=='') {
             $record['kd_dkk']  = $dok['kd_dk'];
             $record['dt_dkk']  = $dok['dt_dk']; };
         $record['pr_ch']  = $dok['pr_ch'];
         $record['st_dk']  = '0';
         
         $updateSQL = $conn->AutoExecute ('ms_opr', $record, 'update', "where nm_zp= $nmzp ");
     };  
};     	
//mark document as ready 
$record = array();
$record['st_dk']  = '0';
$record['dt_ob']  = date();
$record['pr_us']  = $kdus;
$updateSQL = $conn->AutoExecute ('ms_dok', $record, 'update', "where nm_zp= $nmzpd ");

//?????? ????????}
//$text =RASCTH(1);

RETURN '';
};

//===============================================================================
//  OBRSTRD
//=============================================================================
function ObrStrD($conn, $nmzpd, $kdus) {
// storno
$lg ='';

// main dir 
$sqlarm = ' select * from sprarm '; 
$sprarm = $conn->SelectLimit($sqlarm,1,0);
if ($sprarm->RecordCount() == 0) { RETURN "ObrKasD: Error 1"; };
 
$s_smdk = 0;
$s_smdkdl = 0;

$dokrec = QDOK($conn, $lg, $nmzpd);
if ($dokrec->RecordCount() == 0) {RETURN "ObrKasD: Error 2"; };
 
$dok = $dokrec->fields;
 
// check date  ======================================
if ( $dok['dt_dk']<=$sprarm->fields['dt_zk']) { RETURN "PERIOD IS CLOSED FOR JOB"; };

// check type  ======================================
if  (! ($dok['kd_op']='7') )  { RETURN "ObrKasD: Error 3"; };

// read operations 
$oprrec  = taOPR($conn, $lg, $dok['nm_zp']);

$s_smdk  =0;
$s_smdkdl=0;
$nmzpr = 0;
$kdps  = 0;

while (!$oprrec->EOF) {

    if ($opr['pr_op']=='+')  
         { $s_smdk = $s_smdk + ($opr['kol_op'] * $opr['sm_op']); }
    else { $s_smdk = $s_smdk - ($opr['kol_op'] * $opr['sm_op']); };
	 
    if (!(($opr['kd_st']='Delete') or ($opr['kd_st']='Not found')))  {
        // read warehouse
        $qsklprec = QSKLP($conn, $lg, $opr['nm_zps'], $opr['nm_zpo'], 0);
        $qsklp = $qsklp1rec->fields;

        if (($kdps==0) and ($qsklprec->RecordCount()>0)) {     
           $kdps =$qsklp['kd_ps'];  
           $nmzpr=$qsklp['nm_zpr']; }
        else {    
           $kdps=$sprarm->fields['kd_ps'];
           $nmzpr =0;
           break;  	
        };
    };
    $oprrec->MoveNext();
};        

//
if ($kdps==0) {
    $kdps=$sprarm->fields['kd_ps'];
    $nmzpr =0;
};

// read operation
$oprrec->first();
while (!$oprrec->EOF) {

    if ($opr['st_dk']=='1') {
    	
    	$opr  = $oprrec->fields; 
        $nmzp = $opr['nm_zp'];

      	// skip if nessasary
      	if (($opr['pr_op']=='-')  and
      	     (($opr['kd_st']=='Delete') or ($opr['kd_st']=='Not found'))) {
             $record = array();
             $record['st_dk']  = '0';
             $updateSQL = $conn->AutoExecute ('ms_opr', $record, 'update', "where nm_zp= $nmzp ");
             $oprrec->MoveNext();
             continue;
      	};       
        
      	// 
        if ($opr['pr_op']=='+') {
           // currently record
           // check decription
           if ($opr['nm_zpo']==0) {
              // add new description
              $record = array();
              $record["kd_kl"] = $opr['nm_zp'];
              $conn->AutoExecute('ms_ops',$record,'insert');
           
              // find add description  �
              $nmzpo = $opr['nm_zp'];
              $sqlops = " select * from ms_ops where kd_kl=$nmzpo "; 
              $opsrec = $conn->Execute($sqlops);
              }
           else { 
              $nmzpo = $opr['nm_zp'];
              $sqlops = " select * from ms_ops where nm_zp=$nmzpo "; 
              $opsrec = $conn->Execute($sqlops);
           };
           if ($opsrec->RecordCount() == 0) { RETURN "ObrStrD: Error 4"; };
           $ops=$opsrec->fields;
           $nmzpo = $opsrec->fields['nm_zp'];
           // update description
           $record = array();
           $record['kd_dk'] = $dok['kd_dk'];
           $record['dt_dk'] = $dok['dt_dk'];
           $record['kd_op'] = $dok['kd_op'];
           $record['kd_im'] = $opr['kd_im'];
           $record['kd_st'] = $opr['kd_st'];
           $record['kd_ps'] = $kdps;
           $record['pr_dl'] = '0';
           $record['kl_pr'] = $opsrec->fileds['kl_pr']+$opr['kol_op'];
           $record['sm_pr'] = $opr['sm_op1'];
           $record['sm_prdl'] = $opr['sm_op1dl'];
           $updateSQL = $conn->AutoExecute ('ms_ops', $record, 'update', "where nm_zp= $nmzpo ");

           // remember description in the operation ==============
           $record = array();
           $record['nm_zpo'] = $nmzpo;
           $updateSQL = $conn->AutoExecute ('ms_opr', $record, 'update', "where nm_zp= $nmzp ");

           // looking for warehouse record =======================�
           $sklrec = QSKLP($conn, $lg, $opr['nm_zps'], $opr['nm_zpo'], 0);

           if ($sklrec->RecordCount()==0)  {
              $record = array();
              $record['nm_zps'] = $opr['nm_zp'];
              $record['nm_zpo'] = $opr['nm_zpo'];
              $conn->AutoExecute('ms_skl',$record,'insert');
              // looking for insert record 
              $sklrec = QSKLP($conn, $lg, 0, $opr['nm_zpo'], $opr['nm_zp']);
              if ($sklrec->RecordCount()>1) {RETURN "ObrStrD: Error 5"; };
           };
           
           // all clear
           $nmzpo = $opr['nm_zpo'];
           $nmzps = $sklrec->fields['nm_zp'];
           $nmzpn = 0;
              
           if ($nmzps==0) {RETURN "ObrStrD: Error 3"; };
              
           // edit nem record
           $record = array();
           $record['nm_sk'] = $opr['nm_sk'];
           $record['kd_ps'] = $kdps;
           $record['pr_zp'] = '1';
           $record['nm_zpo'] = $nmzpo;
           $record['nm_zps'] = 0;
           if ($nmzpr==0)  {$record['nmz_zpr'] = $opr['nm_zp']; }
           else {$record['nm_zpr']=$nmzpr;  };
           $record['dt_prs'] = $dok['dt_dk'];
           $record['nm_par'] = $opr['nm_par'];
           $record['kd_kl']  = $opr['kd_kl'];
           $record['ed_iz']  = $opr['ed_iz'];
           $record['kd_tg']  = $opr['kd_tg'];
           $record['kd_ig']  = $opr['kd_ig'];
           $record['kd_st']  = $opr['kd_st'];
           $record['kd_md']  = $opr['kd_md'];
           $record['bs_iz']  = $opr['bs_iz'];

           $record['sm_tk']  = $opr['sm_op'];
           $record['kol_tk'] = $opr['kol_op'];
           $record['dt_us']  = $dok['dt_dk'];
           $record['pr_aa']  = $opr['pr_aa'];
           $record['kd_ds']  = $opr['kd_ds'];
           $record['nm_zak'] = $opr['nm_zak'];

           $updateSQL = $conn->AutoExecute ('ms_skl', $record, 'update', "where nm_zp= $nmzps ");

           // update description
           if ($ops['nm_zp']>0) {
              $record = array();
              $record['kd_dk'] = $dok['kd_dk'];
              $record['dt_dk'] = $dok['dt_dk'];
              $record['kd_op'] = $dok['kd_op'];
              $record['kd_im'] = $opr['kd_im'];
              $record['kd_ps'] = $opr['kd_ps'];
              $record['kd_st'] = $opr['kd_st'];
              $record['pr_dl'] = '0';
              $record['kl_pr'] = $ops['kl_pr']+$opr['kol_op'];
              if ($opr['sm_op1']>0)   { $record['sm_pr'] = $opr['sm_op1']; };
              if ($opr['sm_op1dl']>0) { $record['sm_prdl'] = $opr['sm_op1dl']; };
              $updateSQL = $conn->AutoExecute ('ms_ops', $record, 'update', "where nm_zp= $nmzpo ");
           };
           // update operation
           $record = array();
           $record['pr_ch']  = $dok['pr_ch'];
           $record['nm_zps'] = $nmzps;
           $record['st_dk']  = '0';
           $record['nm_ka']  = $dok['nm_ka'];
           $record['nm_zak'] = $dok['nm_zak'];
           if ($opr['sm_opdl']>0) 
              { $record['sm_op'] = round(($opr['sm_opdl'*$sprarm->fields['kr_dol']]),5); };
           if ($opr['sm_op1dl']>0) 
              { $record['sm_op1'] = round(($opr['sm_op1dl'*$sprarm->fields['kr_dol']]),5); };
           $record['pr_zp'] = '1';

           $updateSQL = $conn->AutoExecute ('ms_opr', $record, 'update', "where nm_zp= $nmzp ");
         };   
              
         // out line
         if ($opr['pr_op']=='-') {

             // warehouse in
             $qsklprec = QSKLP($conn,$lg, $opr['nm_zps'], $opr['nm_zpo'], 0);
             $qsklp = $qsklprec->fields;
             // $tstr = $tstr+1;
             $nmzps = $opr['nm_zps'];

             // check record
             if (not(($qsklp['kd_im']==$opr['kd_im']) and
                     ($qsklp['kd_st']==$opr['kd_st'])))
                { RETURN "PROCESSING STOPPED. INVALID DATA "; };

             // check quantity 
             if ((($qsklp['kol_tk'] - $opr['kol_op'])<0.0) or
                (($qsklp['pr_zp']=='0') and ($opr['kol_op']>0)))
                {  RETURN "NOT NECESSARY QUANTITY  "+$opr['kdim']; };
             
             // change warehouse
             $record = array();
             if (($qsklp['kol_tk']-$opr['kol_op']>0.0001))
                { $kolp=round(($qsklp['kol_tk']-$opr['kol_op']),4); }
             else  {$kolp=0;  };              
             $record['kol_tk']  = $kolp;
             // date last operation
             if ($qsklp['dt_us']<$dok['dt_dk'])
                { $record['dt_us'] = $dok['dt_dk']; };
             // reservation   
             if ($opr['pr_rzm']>0)    
                { $record['kol_rzm']  = $qsklp['kol_rzm'] - $opr['kol_op']; };
             // if record not active
             if ($kolp==0) 
                { $record['pr_zp']  = '0'; }
             else { $record['pr_zp']  = '1'; };
                
             $updateSQL = $conn->AutoExecute ('ms_skl', $record, 'update', "where nm_zp= $nmzps ");
             
             $kolsk = round($qsklp['kol_tk'],4);
             
             // change reservation
             $kdim = $opr['kd_im'];
             $klrs = $opr['kol_op'];
                
             $qresrec = QRES($conn,$lg, $kdim, $nmzpo);
             $qres=$qresrec->fields;          
  
             while (!$qresrec->EOF) {
             	{if (($qres['nm_zak']==$opr['nm_zak']) or
                   ($qres['nm_zpd']==$opr['nm_zpd'])) {
 
                   	$nmzpe = $qres['nm_zp'];
                   	
                   	if (klrs>=$qres['kl_rs']) {
                        $sqlres = " delete from ms_res where nm_zp=$nmzpe" ;
                        $conn->Execute($sqlres);               
                        $klrs =$klrs-$qres['kl_rs']; }
                    else {
                        $record = array();
                        $kltk = $qres['kl_rs'];
                        $record['kl_rs']  = $kltk-$klrs;
                        $updateSQL = $conn->AutoExecute ('ms_res', $record, 'update', "where nm_zp= $nmzpe ");  
                    };
                    break;           
                 }
                 else { $qresrec->MoveNext(); };  
               };
             };
             // location
             $nmzpd = $opr['nm_zpd'];

             $sqllop = " select m.*  from ms_lop m
                         where m.nm_zpo=$nmzpo and m.nm_zpd=$nmzpd
                         order by m.kol_lc desc ";

             $loprec = $conn->Execute($sqllop);
             $lop = $loprec->fields;          
  
             while (!$loprec->EOF) {
     	        $kdlc = $lop['kd_lc'];
                $nmsk = $lop['nm_sk'];
                $kollp= $lop['kol_lc'];
          
                $sqlloc = " select m.* from ms_loc  m
                where (m.kd_lc=($kdlc)) and (m.nm_sk=($nmsk)) and (m.kd_im=($kdim)) ";

                $locrec = $conn->Execute($sqlloc);
                $loc=$locrec->fields;          
          
                while (!$locrec->EOF) {
               
          	        $nmzplc=$loc['nm_zp'];        
                    $record = array();
                    $kollc  = $loc['kol_lc'] - $kollp; 
                    if ($kollc<0){$kollc=0;};
                    $record['kol_lc']  = $kollc; 
                    $updateSQL = $conn->AutoExecute ('ms_loc', $record, 'update', "where nm_zp= $nmzplc ");  

                    $locrec->MoveNext();
                };  
                $loprec->MoveNext();
             }; 
         }; 
         // change operation
         $record = array();
         $record['nm_ka']  = $dok['nm_ka']; 
         $record['nm_zak'] = $dok['nm_zak']; 
         $record['pr_ch']  = $dok['pr_ch']; 
         $record['nm_zpd'] = $dok['nm_zp']; 
         $record['nm_zps'] = $nmzps; 
         $record['nm_zpp'] = $nmzpp; 
         $record['kol_op1']= $kolsk; 
         $record['st_dk']  = '0'; 
         $record['pr_zp']  = 1; 

         $updateSQL = $conn->AutoExecute ('ms_opr', $record, 'update', "where nm_zp= $nmzp ");  
    };
    $oprrec->MoveNext();     
};
// account
// $text =RASCTH(1);

// total document
 $sumrec = taSUM($lg, $dok['kd_op'], $dok['dt_dk'], $dok['kd_dk'], 2);
 while (!$sumrec->EOF) {
     $s_smdk = $s_smdk +  $sumrec->fields['sm_op'];
     $sumrec->MoveNext();
 };

//mark document as ready 
$record = array();
$record['st_dk']  = '0';
$record['dt_ob']  = date();
$record['pr_us']  = $kdus;
$record['sm_zd']  = $s_smdk;
$record['sm_zddl']  = $s_smdkdl;
$record['kr_kr']  = $spropk rec->fields['kr_dol'];
$updateSQL = $conn->AutoExecute ('ms_dok', $record, 'update', "where nm_zp= $nmzpd ");

RETURN '';   
};   

//===============================================================================
// control operation 
//===============================================================================
function ConOpr($conn, $oper, $file, $kdus) {

return '';
};

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
};
RETURN "";
};
//=====================================================================================================================
// control new document 
//=====================================================================================================================
function ConNewDoc($conn, $record, $kdus) {
// account
$lg ='';

// main dir ======================================================================================= 
$sqlarm = ' select * from sprarm '; 
$sprarm = $conn->SelectLimit($sqlarm,1,0);
if ($sprarm->RecordCount() == 0) { RETURN "ConNewDoc: Error 1"; };

//=================================================================================================
if (count($record)==0) {RETURN "UNKNOWN OPERATION."; };

//=================================================================================================
// check code operation
if (isset($record['kd_op'])) {
   $kod = $record['kd_op'];
	if (!(($kod='1') or ($kod='2') or ($kod='3') or ($kod='5') or ($kod='4') or
	    ($kod='7') or ($kod='9'))) {
	    RETURN "UNKNOWN OPERATION."	;
	};
   }
else {RETURN "UNKNOWN OPERATION."; };

//=================================================================================================
//  check number document  	    
if ((!isset($record['kd_dk'])) or ($record['kd_dk']=='')) { RETURN "ENTER DOCUMENT NUMBER.";};

//  check date document============================================================================
if ((!isset($record['dt_dk'])) or ($record['dt_dk']=='')) { RETURN "ENTER DATE DOCUMENT.";};
if ( $record['dt_dk']<=$sprarm->fields['dt_zk']) { RETURN "PERIOD IS CLOSED FOR JOB"; };

//=================================================================================================
// check exist document
$rec = taDOKP($conn, $record['kd_dk'], $record['dt_dk'], $record['kd_op']);
if ($rec->RecordCount()>0) {RETURN "DOCUMENT EXISTS"; };

// check receiving ================================================================================
if ($kod=='1') {
   if ((!isset($record['nm_sk'])) or ($record['nm_sk']=='')) { RETURN "ENTER VALUE OF THE WAREHOUSE";};
   if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION";};
   if ((!isset($record['kd_ps'])) or ($record['kd_ps']=='')) { RETURN "ENTER VALUE OF THE COMPANY";};
};    
// check shiping ==================================================================================
if ($kod=='2') {
   if ((!isset($record['nm_sk'])) or ($record['nm_sk']=='')) { RETURN "ENTER VALUE OF THE WAREHOUSE";};
   if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION";};
   if ((!isset($record['kd_ps'])) or ($record['kd_ps']=='')) {
      if ((!isset($record['ou_sk'])) or ($record['ou_sk']=='')) { RETURN "ENTER VALUE OF THE COMPANY OR WAREHOUSE"; }
   };
   if ((isset($record['nm_sk'])) and (isset($record['ou_sk']))) {
      if ($record['ou_sk'] == $record['nm_sk']) { RETURN "WAREHOUSES SHOULD NOT BE EQUAL"; }
   };
};    

//check order =====================================================================================
if ($kod=='4') {
   if ((!isset($record['ou_ps'])) or ($record['ou_ps']=='')) { RETURN "ENTER VALUE OF THE COMPANY(OUT)"; };
   if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION"; };
   if ((!isset($record['kd_ps'])) or ($record['kd_ps']=='')) { RETURN "ENTER VALUE OF THE COMPANY"; };
};    

//check ==========================================================================================
if ($kod=='5') {
   if ((!isset($record['nm_sk'])) or ($record['nm_sk']=='')) { RETURN "ENTER VALUE OF THE WAREHOUSE";};
   if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION";};
   if ((!isset($record['nm_ka'])) or ($record['nm_ka']=='')) { RETURN "ENTER VALUE OF THE BANK";};
};    

//check ==========================================================================================
if ($kod=='3') {
   if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION"; };
   if ((!isset($record['nm_ka'])) or ($record['nm_ka']=='')) { $nmk=''; } else {$nmk=$record['nm_ka']; };
   if ((!isset($record['kd_kl'])) or ($record['kd_kl']=='')) { $kkl=''; } else {$kkl=$record['kd_kl']; };
   if (($nmk=='') and ($kkl=='')) {RETURN "ENTER VALUE OF THE BANK OR PERSON"; };
   if (($nmk>'')  and ($kkl>''))  {RETURN "ENTER VALUE OF THE BANK OR PERSON"; };
   
};    

//check manufacture storno ========================================================================
if ($kod=='7') {
   if ((!isset($record['nm_sk'])) or ($record['nm_sk']=='')) { RETURN "ENTER VALUE OF THE WAREHOUSE";};
   if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION";};
};    

//check discount ==================================================================================
if ($kod=='9') {
   if ((!isset($record['nm_sk'])) or ($record['nm_sk']=='')) { RETURN "ENTER VALUE OF THE WAREHOUSE";};
   if ((!isset($record['pr_ch'])) or ($record['pr_ch']=='')) { RETURN "ENTER VALUE OF THE OPERATION";};
};    
RETURN "";
};

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