<?php
//===============================================================================
//  string control
//===============================================================================
// 2023 проверка на лишние символы strig переменные
function txtc($txt){
    $forbidden = '\/:*?"<>|+%!@';
    $stringWithoutForbiddenCharacters = preg_replace("/[${forbidden}]/", '', $txt);
    return $stringWithoutForbiddenCharacters;
}
//===============================================================================
//  read SPRARM
//===============================================================================
// 2023 - получение системных настроек
function sprarm($conn){
$sqlt = ' select * from sprarm '; 
$res = $conn-> query($sqlt);
return $res->fetch();
}
//===============================================================================
//  read SPRCHK
//===============================================================================
// 2023 - получение операции из справочника операций
function sprchk($conn, $prch){
$sqlt = " select * from sprchk where pr_ch = ${prch}  ";
$res = $conn->query($sqlt);
return $res->fetch();
}

//===============================================================================
//  read SPRUS
//===============================================================================
function sprus($conn, $user, $pass){
    $res = $conn->prepare('SELECT * FROM sprus WHERE (kd_p = ?)');
    $res->execute([$user]);
return $res->fetch(PDO::FETCH_NUM);
}

//===============================================================================
//  read MS_OPR
//===============================================================================
function msopr($conn, $nmzp){
$sqlt = " select * from ms_opr where (nm_zpd=${nmzp}) ";
$res = $conn->query($sqlt);
return $res->fetch();
}

//===============================================================================
//  sql for alldoc
//===============================================================================
function sql_alldoc($lg, $sd) {
$sql_text = " 
select  m.kd_dk,
         m.dt_dk,
         ch.im_ch${lg}   as prch,
         m.nm_zak,
         ps.im_ps${lg}   as  kdps,
         sk.im_sk${lg}   as  nmsk,
         ka.im_ka${lg}   as  nmka,
         os.im_sk${lg}   as  ousk,
         kl.im_kl${lg}   as  kdkl,
         m.text,
         m.pr_dl,
         m.nm_zp,
         m.color,
         m.kd_op,
         m.pr_prd,
         m.pr_ch,
         m.kd_ps,
         m.nm_sk,
         us.im_p${lg}    as  impl,
         sm.im_sm${lg}   as  imsm,
         opl.im_opl${lg} as  imopl,
         dg.im_dg${lg}   as  kddg,
         re.im_ps${lg}   as  kdre,
         op.im_ps${lg}   as  oups

from  ms_dok m  
  left join sprkl  kl  on  m.kd_kl=kl.kd_kl
  left join sprsk  sk  on  m.nm_sk=sk.nm_sk
  left join sprsk  os  on  m.ou_sk=os.nm_sk
  left join sprka  ka  on  m.nm_ka=ka.nm_ka
  left join sprchk ch  on  m.pr_ch=ch.pr_ch
  left join sprdg  dg  on  m.kd_dg=dg.kd_dg
  left join sprps  ps  on  m.kd_ps=ps.kd_ps
  left join sprps  re  on  m.kd_re=re.kd_ps
  left join sprus  us  on  m.kd_p=us.kd_p
  left join sprsm  sm  on  m.kd_sm=sm.kd_sm
  left join spropl opl on  m.kd_opl=opl.kd_opl  
  left join sprps  op  on  m.ou_ps=op.kd_ps
 where ((m.st_dk='1')  or  (m.st_dk='${sd}')) 
 order by dt_dk ";

return $sql_text;
}

//===============================================================================
//  header for alldoc
//===============================================================================
function header_alldoc($lg) {
return array("","Nunber", "Data", "Operation", "Order", "Company", "Warehause", "Bank", "Warehouse(out)","Contact","Comment");
}

//===============================================================================
//  read records  DOC
//===============================================================================
function get_doc($conn, $nmzp, $kdop) {
$lg='';
$sqlt = " 
select m.*,
  im.im_tb${lg}   as  kdim,
  ps.im_ps${lg}   as  kdps,
  kl.im_kl${lg}   as  kdkl,
  ch.im_ch${lg}   as  prch,
  ks.im_op${lg}   as  ksop,
  sk.im_sk${lg}   as  nmsk,
  re.im_ps${lg}   as  kdre
from ms_opr m
  left join sprim  im on m.kd_im=im.kd_im
  left join sprps  ps on m.kd_ps=ps.kd_ps
  left join sprkl  kl on m.kd_kl=kl.kd_kl
  left join sprsk  sk on m.nm_sk=sk.nm_sk
  left join sprps  re on m.kd_re=re.kd_ps
  left join sprchk ch on m.pr_ch=ch.pr_ch
  left join spropk ks on m.kd_opk=ks.kd_opk
  left join ms_ops os on m.nm_zpo=os.nm_zp
where m.nm_zpd=('${nmzp}')  
order by m.nm_st ";

$res = $conn->query($sqlt);
$rows = array();
// 
$recordset = array();
if ($res && $res->RowCount() > 0) {
   //
   foreach ($res as $row) {
      $record = array();
      if ($kdop=='1') {
         $record[] =  $res->fields['kdim'];              // 0
         $record[] =  $res->fields['kd_st'];             // 1
         $record[] =  $res->fields['kol_op'];            // 2
         $record[] =  $res->fields['sm_op1'];            // 3
         $record[] =  $res->fields['sm_op'];             // 4
         $record[] =  $res->fields['nm_zak'];            // 5 
         $record[] =  $res->fields['ed_iz'];             // 6
         $record[] =  $res->fields['bs_iz'];             // 7
         $record[] =  $res->fields['pr_dl'];             // 8
         $record[] =  $res->fields['pr_dl'];             // 9
         $record[] =  $res->fields['pr_dl'];             // 10
         //
         $record[] =  $res->fields['nm_zp'];             // 11
         $record[] =  $res->fields['nm_zpo'];            // 12
         $record[] =  $res->fields['nm_zps'];            // 13
         $record[] =  $res->fields['st_dk'];             // 14
         $record[] =  $res->fields['kd_im'];             // 15
      }
       if ($kdop=='2') {
         $record[] =  $res->fields['kdim'];
         $record[] =  $res->fields['kd_st'];
         $record[] =  $res->fields['kol_op'];
         $record[] =  $res->fields['sm_op'];
         $record[] =  $res->fields['nm_zak'];
         $record[] =  $res->fields['ed_iz'];
         $record[] =  $res->fields['bs_iz'];
         $record[] =  $res->fields['pr_dl'];
         $record[] =  $res->fields['pr_dl'];
         $record[] =  $res->fields['pr_dl'];
         $record[] =  $res->fields['pr_dl'];
         //
         $record[] =  $res->fields['nm_zp'];             // 11
         $record[] =  $res->fields['nm_zpo'];
         $record[] =  $res->fields['nm_zps'];
         $record[] =  $res->fields['st_dk'];
         $record[] =  $res->fields['kd_im'];             // 15
      }
       if ($kdop=='3') {
         $record[] =  $res->fields['ksop'];
         $record[] =  $res->fields['sm_op'];
         $record[] =  $res->fields['sm_op1'];
         $record[] =  $res->fields['kd_dkk'];
         $record[] =  $res->fields['dt_dkk'];
         $record[] =  $res->fields['kdkl'];
         $record[] =  $res->fields['kdps'];
         $record[] =  $res->fields['nm_zak'];
         $record[] =  $res->fields['pr_dl'];
         $record[] =  $res->fields['pr_dl'];
         $record[] =  $res->fields['pr_dl'];
         //
         $record[] =  $res->fields['nm_zp'];            // 11
         $record[] =  $res->fields['nm_zpo'];
         $record[] =  $res->fields['nm_zps'];
         $record[] =  $res->fields['st_dk'];
      }
       if ($kdop=='4') {
         $record[] =  $res->fields['ksop'];
         $record[] =  $res->fields['kol_op'];
         $record[] =  $res->fields['sm_op'];
         $record[] =  $res->fields['sm_op1'];
         $record[] =  $res->fields['kd_dkk'];
         $record[] =  $res->fields['dt_dkk'];
         $record[] =  $res->fields['kdkl'];
         $record[] =  $res->fields['kdps'];
         $record[] =  $res->fields['nm_zak'];
         $record[] =  $res->fields['pr_dl'];
         $record[] =  $res->fields['pr_dl'];
         //
         $record[] =  $res->fields['nm_zp'];
         $record[] =  $res->fields['nm_zpo'];
         $record[] =  $res->fields['nm_zps'];
         $record[] =  $res->fields['st_dk'];
      }
       if ($kdop=='5') {
         $record[] =  $res->fields['kdim'];
         $record[] =  $res->fields['kd_st'];
         $record[] =  $res->fields['kol_op'];
         $record[] =  $res->fields['sm_op'];
         $record[] =  $res->fields['nm_zak'];
         $record[] =  $res->fields['ed_iz'];
         $record[] =  $res->fields['bs_iz'];
         $record[] =  $res->fields['pr_dl'];
         $record[] =  $res->fields['pr_dl'];
         $record[] =  $res->fields['pr_dl'];
         $record[] =  $res->fields['pr_dl'];
         //
         $record[] =  $res->fields['nm_zp'];            //11
         $record[] =  $res->fields['nm_zpo'];
         $record[] =  $res->fields['nm_zps'];
         $record[] =  $res->fields['st_dk'];
         $record[] =  $res->fields['kd_im'];            //15
      }
       if ($kdop=='7') {
         $record[] =  $res->fields['pr_op'];
         $record[] =  $res->fields['kdim'];
         $record[] =  $res->fields['kd_st'];
         $record[] =  $res->fields['kol_op'];
         $record[] =  $res->fields['sm_op'];
         $record[] =  $res->fields['nm_zak'];
         $record[] =  $res->fields['kdps'];
         $record[] =  $res->fields['ed_iz'];
         $record[] =  $res->fields['bs_iz'];
         $record[] =  $res->fields['pr_dl'];
         $record[] =  $res->fields['pr_dl'];
         //
         $record[] =  $res->fields['nm_zp'];            //11
         $record[] =  $res->fields['nm_zpo'];
         $record[] =  $res->fields['nm_zps'];
         $record[] =  $res->fields['st_dk'];
         $record[] =  $res->fields['kd_im'];            // 15
      }
       //
      $recordset[] = $record;
      // 
   }
} 
return $recordset;
}

//==============================================================================
//  read records  ALLDOC
//==============================================================================
function get_alldoc($conn, $kdus) {
$sqlt = "
select
  m.kd_dk, m.dt_dk, ch.im_ch as prch, m.nm_zak, ps.im_ps as kdps,
  sk.im_sk as nmsk, ka.im_ka as nmka, os.im_sk as ousk, kl.im_kl as kdkl,
  m.text,  m.pr_dl, m.nm_zp, m.color, m.kd_op, m.pr_prd, m.pr_ch,
  m.kd_ps, m.nm_sk
from  ms_dok m
  left join sprkl  kl  on  m.kd_kl=kl.kd_kl
  left join sprsk  sk  on  m.nm_sk=sk.nm_sk
  left join sprsk  os  on  m.ou_sk=os.nm_sk
  left join sprka  ka  on  m.nm_ka=ka.nm_ka
  left join sprchk ch  on  m.pr_ch=ch.pr_ch
  left join sprdg  dg  on  m.kd_dg=dg.kd_dg
  left join sprps  ps  on  m.kd_ps=ps.kd_ps
where (m.st_dk='1') order by dt_dk ";

$res = $conn->query($sqlt);
$recordset = array();

if ($res && $res->RowCount() > 0) {
    foreach ($res as $row) {
      $recordset[] = $res->fetch(PDO::FETCH_NUM);}
    }
return $recordset;
}
//===============================================================================
//  read records  sernum
//===============================================================================
function get_sernum($conn, $nmzpr, $nmzpo, $kdus)  {
// 
$res = taSER($conn, $nmzpr, $nmzpo);
$recordset = array();
if ($res && $res->RecordCount() > 0) {
   // 
   while (!$res->EOF) {
      $record = array();
      $record[] = $res->fields['nm_ser'];
      //
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      
      $record[] = $res->fields['nm_zp'];   // 11
      $record[] = $res->fields['nm_zpo'];
      $record[] = $res->fields['nm_zpr'];
      //
      $recordset[] = $record;
      // 
      $res->MoveNext();
   } 
} 
return $recordset;
}
//===============================================================================
//  read records  RAB
//===============================================================================
function get_rab($conn, $nmzpd, $kdus)  {
// 
$res = taRAB($conn, $nmzpd, $kdus);
$recordset = array();
if ($res && $res->RecordCount() > 0) {
   // 
   while (!$res->EOF) {
      $record = array();
      
      $record[] = $res->fields['kdkl'];
      $record[] = $res->fields['text'];
      $record[] = $res->fields['kl_op'];
      $record[] = $res->fields['kdpd'];
      $record[] = $res->fields['kd_kl'];
      $record[] = $res->fields['kd_pd'];
      //
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl']; 
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      
      $record[] = $res->fields['nm_zp'];  // 11
      //
      $recordset[] = $record;
      // 
      $res->MoveNext();
   } 
} 
return $recordset;
}
//===============================================================================
//  read records  OBP
//===============================================================================
function get_obp($conn, $nmzpd, $kdus)  {
// 
$res = taOBP($conn, $nmzpd);
$recordset = array();
if ($res && $res->RecordCount() > 0) {
   // 
   while (!$res->EOF) {
      $record = array();
      
      $record[] = $res->fields['imiz'];
      $record[] = $res->fields['kd_st'];
      $record[] = $res->fields['kl_iz'];
      $record[] = $res->fields['st_izs'];
      $record[] = $res->fields['kd_im'];
      $record[] = $res->fields['pr_dl'];
      //
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl']; 
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      
      $record[] = $res->fields['nm_zp'];  // 11
      //
      $recordset[] = $record;
      // 
      $res->MoveNext();
   } 
} 
return $recordset;
}
//===============================================================================
//  read records  RES
//===============================================================================
function get_reserv($conn, $nmzpd, $kdus)  {
// 
$res = taRES($conn, $nmzpd, $kdus);
$recordset = array();
if ($res && $res->RecordCount() > 0) {
   // 
   while (!$res->EOF) {
      $record = array();
      $record[] = $res->fields['kl_rs']; 
      $record[] = $res->fields['nm_zak'];
      $record[] = $res->fields['dt_rs'];
      $record[] = $res->fields['kdim'];
      $record[] = $res->fields['kd_st'];
      //
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl']; 
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      $record[] = $res->fields['pr_dl'];
      //
      $record[] = $res->fields['nm_zp'];   // 11
      //
      $recordset[] = $record;
      // 
      $res->MoveNext();
   } 
} 
return $recordset;
}
//===============================================================================
//  read records  PRICE LIST
//===============================================================================
function get_price($conn, $kdps)  {
//
$lg="";
if ($kdps==0) {
   $sqlt = " 
    select m.*,
    ps.im_ps$lg   as  kdps
    from sprprs m
    left join sprps  ps on m.kd_ps=ps.kd_ps
    where m.kd_prs>0  
    group by kdps "; }
else {
   $sqlt = " 
    select m.*,
    ps.im_ps$lg   as  kdps
    from sprprs m
    left join sprps  ps on m.kd_ps=ps.kd_ps
    where m.kd_ps=$kdps  
    group by kdps "; }
    $res = $conn->Execute($sqlt);
$rows = array();
$recordset = array();
if ($res && $res->RecordCount() > 0) {
   // 
   while (!$res->EOF) {
      $record = array();
      $record[] = $res->fields['im_prs'];
      $record[] = $res->fields['kdps'];
      $record[] = $res->fields['dt_prs'];
      $record[] = $res->fields['kd_ps'];
      $record[] = $res->fields['kd_prs'];
      //
      $recordset[] = $record;
      // 
      $res->MoveNext();
   } 
} 
return $recordset;
}
//===============================================================================
//  read records  SUM
//===============================================================================
function get_sum($conn, $nmzp, $prsum, $kdus)  {
// prsum 0 - expenses 1 - taxes;
$res = taSUM($conn, $nmzp, $prsum,  $kdus);
$recordset = array();
if ($res && $res->RecordCount() > 0) {
   // 
   while (!$res->EOF) {
      $record = array();
      if ($prsum==0) {
         $record[] = $res->fields['imsm'];
         $record[] = $res->fields['kl_op'];
         $record[] = $res->fields['st_op'];
         $record[] = $res->fields['sm_op'];
         $record[] = $res->fields['text'];
         $record[] = $res->fields['kd_sm'];

         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
 
         $record[] = $res->fields['nm_zp'];  // 11
      }
      else {
         $record[] = $res->fields['imsm'];
         $record[] = $res->fields['sm_op'];
         $record[] = $res->fields['kd_sm'];

         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         
         $record[] = $res->fields['nm_zp'];  // 11
      }
       //
      $recordset[] = $record;
      // 
      $res->MoveNext();
   } 
} 
return $recordset;
}

//===============================================================================
//  array fields new document
//===============================================================================
function get_fields($conn, $fl, $nz) {
$recordset = array();
// ==============================================
if ($fl=='taxe') {
   if ($nz==0) {	
       $recordset = array(
                           array("Name:",   "", "kd_sm", ""),
                           array("Amount:", "", "sm_op", ""), );
      }
   else {
      $res = QSUM($conn, $nz);	
      $recordset = array(
                      array("Name:",  $res->fields['imsm'],"kd_sm",$res->fields['kd_sm']),
                      array("Amount:",$res->fields['sm_op'],"sm_op",$res->fields['sm_op']), );
   }
}
// ==============================================
if ($fl=='service') {
   if ($nz==0) {	
       $recordset = array(
                           array("Name:",     "", "kd_sm", ""),
                           array("Qauntity:", "", "kl_op", ""),
                           array("Price:",    "", "st_op", ""), 
                           array("Amount:",   "", "sm_op", ""),
                           array("Comment:",  "", "text",  ""), );
    }
   else {
      $res = QSUM($conn, $nz);	
      $recordset = array(
                      array("Name:",    $res->fields['imsm'], "kd_sm",$res->fields['kd_sm']),
                      array("Qauntity:",$res->fields['kl_op'],"kl_op",$res->fields['kl_op']), 
                      array("Price:",   $res->fields['st_op'],"st_op",$res->fields['st_op']),
                      array("Amount:",  $res->fields['sm_op'],"sm_op",$res->fields['sm_op']),
                      array("Comment:", $res->fields['text'], "text", $res->fields['text']) );
   }
}
// ==============================================
if ($fl=='executor') {
   if ($nz==0) {	
       $recordset = array(
                           array("Name:",      "", "kd_kl", ""),
                           array("Comment:",   "", "text", ""),
                           array("Quantity:",  "", "kl_op",""), 
                           array("Department:","", "kd_pd", ""), );
    }
   else {
      $res = QRAB($conn, $nz);	
      $recordset = array(
                      array("Name:",      $res->fields['kdkl'], "kd_kl",$res->fields['kd_kl']),
                      array("Comment:",   $res->fields['text'], "text", $res->fields['text']), 
                      array("Quantity:",  $res->fields['kl_op'],"kl_op",$res->fields['kl_op']),
                      array("Department:",$res->fields['kdpd'], "kd_pd",$res->fields['kd_pd']) );
   }
}
// ==============================================
if ($fl=='product') {
   if ($nz==0) {	
       $recordset = array(
                           array("Product:",   "", "kd_im", ""),
                           array("Code:",      "", "kd_st", ""),
                           array("Quantity:",  "", "kl_iz",""), 
                           array("Price:",     "", "st_izs", ""), );
    }
   else {
      $res = QOBP($conn, $nz);	
      $recordset = array(
                      array("Product:",  $res->fields['imiz'], "kd_im",$res->fields['kd_im']),
                      array("Code:",     $res->fields['kd_st'],"kd_st",$res->fields['kd_st']), 
                      array("Quantity:", $res->fields['kl_iz'],"kl_iz",$res->fields['kl_iz']),
                      array("Price:",    $res->fields['st_izs'],"st_izs",$res->fields['st_izs']) );
   }
}
// ==============================================
if ($fl=='sernum') {
   if ($nz==0) {	
       $recordset = array(
                           array("Serial Number:",      "", "nm_ser", "") );
     }
   else {
      $res = QSERD($conn, $nz);	
      $recordset = array(
                      array("Serial Number:",      $res->fields['nm_ser'], "nm_ser",$res->fields['nm_ser']) );
   }
}
//===============================================

return $recordset;
}

//===============================================================================
//  add reserv
//===============================================================================
function add_reserv($conn, $nmzpd, $nmzpr, $kdus) {
// reservation record
if ($nmzpr>0) { 
	$sqlres = " delete from ms_res where nm_zpd=$nmzpr" ;
    $conn->Execute($sqlres);               
    $sqlres = " select * from ms_opr where nm_zp=$nmzpr" ; 
    $res = $conn->Execute($sqlres);               
}
// reservation document
if ($nmzpd>0) { 
	$sqlres = " delete from ms_res where nm_zpd=$nmzpd" ; 
    $conn->Execute($sqlres);               
    $sqlres = " select * from ms_opr where nm_zpd=$nmzpd" ;  
    $res = $conn->Execute($sqlres);               
}

    if ($res && $res->RecordCount() > 0) {
   while (!$res->EOF) {
        if 	(($res->fields['kd_im']>'')and($res->fields['nm_zak']>'')and($res->fields['kol_op']>0)) {
            $record = array();
            $record['kd_im'] = $res->fields['kd_im'];
            $record['kd_st'] = $res->fields['kd_st'];
            $record['nm_zak']= $res->fields['nm_zak'];
            $record['kl_rs'] = $res->fields['kol_op'];
            $record['nm_zpo']= $res->fields['nm_zpo'];
            $record['nm_zpr']= $res->fields['nm_zp'];
            $record['nm_zpd']= $res->fields['nm_zpd'];
            $record['tp_rs'] = 1;
            $record['st_rs'] = 0;
            $record['dt_rs'] = date("Y-m-d");
            $record['kd_p']  = $kdus;
            
            $ress= $conn->AutoExecute("ms_res",$record,'INSERT');
        }
       //
      $res->MoveNext();
   }
}
    return '';
}

//===============================================================================
//  generate component
//===============================================================================
function gen_component($conn, $nmzpd, $kdus) {
$kod=RasProd($conn,$nmzpd,$kdus);
return '';
}
//===============================================================================
//  add newdoc
//===============================================================================
function add_newdoc($conn, $recordset, $kdus) {
// control new document
$res = ConNewDoc($conn, $recordset, $kdus);	
// add new document
 if ($res=='') {$res= $conn->AutoExecute("ms_dok",$recordset,'INSERT'); }
return $res;
}

//===============================================================================
//  delete record
//===============================================================================
function delete_record($conn, $file, $nmzp, $kdus) {
// delete record
$res = ConOpr($conn, 'delete_record', $file, $kdus); 
if ($res=='') {
	$sqlres = " delete from $file where nm_zp=$nmzp" ;
    $res = $conn->Execute($sqlres);               
}
return $res;
}

//===============================================================================
//  add record
//===============================================================================
function add_record($conn, $file, $nmzpd, $record,  $kdus) {
$res = ConOpr($conn, 'add_record', $file, $kdus); 
if ($res=='') {
    $res= $conn->AutoExecute($file, $record, 'INSERT'); 
}
return $res;
}

//===============================================================================
// read document 
//===============================================================================
function read_doc($conn, $nmzpd, $kdus) {
// read document
$lg ='';
$dokrec = QDOK($conn, $lg, $nmzpd);
return $dokrec->fields;
}

//===============================================================================
// read record  
//===============================================================================
function read_opr($conn, $nmzp, $kdus) {
// read record
$lg ='';
$dokrec = QOPR($conn, $nmzp, $kdus);
return $dokrec->fields;
}

//===============================================================================
//  update record
//===============================================================================
function update_record($conn, $file, $nmzp, $record, $kdus) {
$res = ConOpr($conn, 'update_record', $file, $kdus); 
if ($res=='') {
	//$conn->debug = true;
	$res = $conn->AutoExecute($file, $record, 'UPDATE', "nm_zp = $nmzp"); 
}
return $res;
}

//===============================================================================
//  array fields new document
//===============================================================================
//2023 - заполнение полей для нового документа
//       поля зависят от типа операции
function ar_newdoc($tpop, $kdop, $imop, $kdus) {
   $recordset = array();
   if ($tpop=='0') {
      $recordset = array(array("Operation:", "","pr_ch",""));
   }
   if ($tpop=='1') {
   /* receiving */ 
   $recordset = array(
    array("Operation:", $imop,"pr_ch",$kdop),
    array("Number:", "","kd_dk",""),
    array("Date (yyyy-mm-dd):", "","dt_dk",""),
    array("Work Order:","","nm_zak",""),
    array("From Company:", "","kd_ps",""),
    array("To Warehouse:", "","nm_sk",""),
    array("Comment:", "","text",""),
    array("Contact:", "","kd_kl",""),
    array("Collor:", "","color",""));
   }
    if ($tpop=='2') {
   /* shipping */ 
   $recordset = array(
    array("Operation:", $imop,"pr_ch",$kdop),
    array("Number:", "","kd_dk","","Val"),
    array("Date (yyyy-mm-dd):", "","dt_dk",""),
    array("Work Order:","","nm_zak",""),
    array("Warehouse From:", "","nm_sk",""),
    array("To Company:", "","kd_ps",""),
    array("Warehouse To:", "","ou_sk"),
    array("Ship To:", "","ou_ps",""),
    array("Comment:", "","text",""),
    array("Contact:", "","kd_kl",""),
    array("Collor:", "","color","")
    );
    }
    if ($tpop=='3') {
   /* service */ 
   $recordset = array(
    array("Operation:", $imop,"pr_ch",$kdop),
    array("Number:", "","kd_dk",""),
    array("Date (yyyy-mm-dd):", "","dt_dk",""),
    array("Work Order:","","nm_zak",""),
    array("From Company:", "","kd_ps",""),
    array("To Company:", "","ou_ps","" ),
    array("Account:", "","nm_ka",""),
    array("Payment:", "","tp_opl",""),
    array("Comment:", "","text",""),
    array("Contact:", "","kd_kl",""),
    array("Collor:", "","color","")
    );
    }
    if ($tpop=='4') {
   /* order */
   $recordset = array(
    array("Operation:", $imop,"pr_ch",$kdop),
    array("Number:", "","kd_dk",""),
    array("Date (yyyy-mm-dd):", "","dt_dk",""),
    array("Work Order:","","nm_zak",""),
    array("Company:", "","kd_ps",""),
    array("Ship To:", "","ou_ps",""),
    array("Comment:", "","text",""),
    array("Contact:", "","kd_kl",""),
    array("Collor:", "","color","")
    );
    }
    if ($tpop=='5') {
   /* sell */
   $recordset = array(
    array("Operation:", $imop,"pr_ch", $kdop), 
    array("Number:", "","kd_dk",""),
    array("Date (yyyy-mm-dd):", "","dt_dk",""),
    array("Work Order:","","nm_zak",""),
    array("Warehouse From:", "","nm_sk",""),
    array("To Company:", "","kd_ps","" ),
    array("Ship To:", "","ou_ps",""),
    array("Seller:", "","kd_re",""),
    array("Account:", "","nm_ka",""),
    array("Payment:", "","tp_opl",""),
    array("Comment:", "","text",""),
    array("Contact:", "","kd_kl",""),
    array("Collor:", "","color","")
    );
    }
    if ($tpop=='7') {
   /* manufacture */
   $recordset = array(
    array("Operation:", $imop,"pr_ch",$kdop),
    array("Number:", "","kd_dk",""),
    array("Date (yyyy-mm-dd):", "","dt_dk",""),
    array("Work Order:","","nm_zak",""),
    array("Warehouse:", "","nm_sk",""),
    array("Comment:", "","text",""),
    array("Contact:", "","kd_kl",""),
    array("Collor:", "","color","")
    );
    }
return $recordset;
}

//===============================================================================
//  add record directory
//===============================================================================
function add_spr($conn, $dir, $seek) {
//
$sqli = array();	
if ($dir == 'sprch')  { $sqlt = "select * from sprch  where im_pr='$seek'"; $sqli["im_pr"] = $seek; }
    if ($dir == 'sprchd') { $sqlt = "select * from sprchd where im_ch='$seek'"; $sqli["im_ch"] = $seek; }
    if ($dir == 'sprchk') { $sqlt = "select * from sprchk where im_ch='$seek'"; $sqli["im_ch"] = $seek; }
    if ($dir == 'sprdg')  { $sqlt = "select * from sprdg  where im_dg='$seek'"; $sqli["im_dg"] = $seek; }
    if ($dir == 'sprdok') { $sqlt = "select * from sprdok where im_dk='$seek'"; $sqli["im_dk"] = $seek; }
    if ($dir == 'sprds')  { $sqlt = "select * from sprds  where im_ds='$seek'"; $sqli["im_ds"] = $seek; }
    if ($dir == 'sprgo')  { $sqlt = "select * from sprgo  where im_go='$seek'"; $sqli["im_go"] = $seek; }
    if ($dir == 'sprgs')  { $sqlt = "select * from sprgs  where im_gs='$seek'"; $sqli["im_gs"] = $seek; }
    if ($dir == 'sprig')  { $sqlt = "select * from sprig  where im_ig='$seek'"; $sqli["im_ig"] = $seek; }
    if ($dir == 'sprim')  { $sqlt = "select * from sprim  where im_tb='$seek'"; $sqli["im_tb"] = $seek; }
    if ($dir == 'sprka')  { $sqlt = "select * from sprka  where im_ka='$seek'"; $sqli["im_ka"] = $seek; }
    if ($dir == 'sprkl')  { $sqlt = "select * from sprkl  where im_kl='$seek'"; $sqli["im_kl"] = $seek; }
    if ($dir == 'sprkn')  { $sqlt = "select * from sprchk where im_ch='$seek'";$sqli["im_kon"]= $seek; }
    if ($dir == 'sprkr')  { $sqlt = "select * from sprkr  where in_vl='$seek'"; $sqli["im_vl"] = $seek; }
    if ($dir == 'sprmod') { $sqlt = "select * from sprmod where kd_md='$seek'"; $sqli["kd_md"] = $seek; }
    if ($dir == 'sprmu')  { $sqlt = "select * from sprmu  where im_mu='$seek'"; $sqli["im_mu"] = $seek; }
    if ($dir == 'sprnl')  { $sqlt = "select * from sprnl  where im_nl='$seek'"; $sqli["im_nl"] = $seek; }
    if ($dir == 'spropk') { $sqlt = "select * from spropk where im_op='$seek'"; $sqli["im_op"] = $seek; }
    if ($dir == 'spropl') { $sqlt = "select * from spropl where im_opl='$seek'";$sqli["im_opl"]= $seek; }
    if ($dir == 'sprpd')  { $sqlt = "select * from sprpd  where im_pd='$seek'"; $sqli["im_pd"] = $seek; }
    if ($dir == 'sprprb') { $sqlt = "select * from sprprb where im_prb='$seek'";$sqli["im_prb"]= $seek; }
    if ($dir == 'sprprg') { $sqlt = "select * from sprprg where im_prg='$seek'";$sqli["im_prg"]= $seek; }
    if ($dir == 'sprprs') { $sqlt = "select * from sprprs where im_prs='$seek'";$sqli["im_prs"]= $seek; }
    if ($dir == 'sprps')  { $sqlt = "select * from sprps  where im_ps='$seek'"; $sqli["im_ps"] = $seek; }
    if ($dir == 'sprsk')  { $sqlt = "select * from sprsk  where im_sk='$seek'"; $sqli["im_sk"] = $seek; }
    if ($dir == 'sprsm')  { $sqlt = "select * from sprsm  where im_sm='$seek'"; $sqli["im_sm"] = $seek; }
    if ($dir == 'sprst')  { $sqlt = "select * from sprst  where im_ss='$seek'"; $sqli["im_ss"] = $seek; }
    if ($dir == 'sprtg')  { $sqlt = "select * from sprtg  where im_tg='$seek'"; $sqli["im_tg"] = $seek; }
    if ($dir == 'sprtop') { $sqlt = "select * from sprtop where im_ops='$seek'";$sqli["im_ops"]= $seek; }
    if ($dir == 'sprus')  { $sqlt = "select * from sprus  where im_p='$seek'";  $sqli["im_p"]  = $seek; }
    if ($dir == 'sprusl') { $sqlt = "select * from sprusl where im_usl='$seek'";$sqli["im_usl"]= $seek; }
    if ($dir == 'sprzp')  { $sqlt = "select * from sprzp  where im_zp='$seek'"; $sqli["im_zp"] = $seek; }
    if ($dir == 'sprzv')  { $sqlt = "select * from sprzv  where im_zv='$seek'"; $sqli["im_zv"] = $seek; }
    if ($dir == 'sysfl')  { $sqlt = "select * from sysfl  where im_fe='$seek'"; $sqli["im_fe"] = $seek; }
    if ($dir == 'syspl')  { $sqlt = "select * from syspl  where im_pl='$seek'"; $sqli["im_pl"] = $seek; }
    if ($dir == 'sysprn') { $sqlt = "select * from sysprn where im_prn='$seek'";$sqli["im_prn"]= $seek; }

    if ($sqlt !=="") {
   $res = $conn->Execute($sqlt);
   if ($res->RecordCount() == 0) {
      $res = $conn->AutoExecute($dir, $sqli,  'INSERT');
   }
}
    return $res;
}

//===============================================================================
// seek zak
//===============================================================================
function seek_zak($conn, $seek) {
$lg ="";
$sqlt ="
select m.*, 
  ps.im_ps$lg as  kdps, 
  kl.im_kl$lg as  kdkl 
from  ms_zak m  
  left join sprps ps on m.kd_ps=ps.kd_ps
  left join sprkl kl on   m.kd_kl=kl.kd_kl ";
if ($seek>"") { $sqlt .= "  where (m.nm_zak=$seek)  "; }
    $sqlt .= " order by m.dt_dks ";

$rows = array();
$recordset = array();

if ($sqlt !==""){ 
   //$res = $conn->SelectLimit($sqlt,10,0);
   $res = $conn->SelectLimit($sqlt);
   $recordset = array();
   if ($res && $res->RecordCount() > 0) {
       
      while (!$res->EOF) {
         $record = array();
         $record[] = $res->fields['nm_zak'];
         $record[] = $res->fields['kdps'];
         $record[] = $res->fields['kdkl'];
         $recordset[] = $record;
         $res->MoveNext();
      }
   }
}      
return $recordset;

}

//===============================================================================
// seek product
//===============================================================================
function seek_iz($conn, $seek) {
$lg ="";
$sqlt ="
select m.*, 
  im.im_tb$lg as  imiz 
from  spriz m  
  left join sprim im on m.kd_im=im.kd_im ";
$sqlt .= " group by imiz ";
if ($seek>"") { $sqlt .= "  having (imiz  like '%$seek%' )  "; }

    $rows = array();
$recordset = array();

if ($sqlt !==""){ 
   //$res = $conn->SelectLimit($sqlt,10,0);
   $res = $conn->SelectLimit($sqlt);
   $recordset = array();
   if ($res && $res->RecordCount() > 0) {
       
      while (!$res->EOF) {
         $record = array();
         $record[] = $res->fields['imiz'];
         $record[] = $res->fields['kd_im'];
         $recordset[] = $record;
         $res->MoveNext();
      }
   }
}      
return $recordset;
}

//===============================================================================
// seek spr
// 2023 - поиск по справочникам
//===============================================================================
function seek_spr($conn, $dir,  $seek, $list, $addsql)
{
    $sqlt="";
    $sqli = array();

    if ($dir == 'sprch')   $sqli = array("pr_ch", "im_pr");
    if ($dir == 'sprchd')  $sqli = array("kd_ch", "im_ch");
    if ($dir == 'sprchk')  $sqli = array("pr_ch", "im_ch");
    if ($dir == 'sprdg')   $sqli = array("kd_dg", "im_dg");
    if ($dir == 'sprdok')  $sqli = array("kd_dk", "im_dk");
    if ($dir == 'sprds')   $sqli = array("kd_ds", "im_ds");
    if ($dir == 'sprgo')   $sqli = array("kd_go", "im_go");
    if ($dir == 'sprgs')   $sqli = array("kd_gs", "im_gs");
    if ($dir == 'sprig')   $sqli = array("kd_ig", "im_ig");
    if ($dir == 'sprim')   $sqli = array("kd_im", "im_im");
    if ($dir == 'sprka')   $sqli = array("nm_ka", "im_ka");
    if ($dir == 'sprkl')   $sqli = array("kd_kl", "im_kl");
    if ($dir == 'sprkn')   $sqli = array("kd_kon", "im_kon");
    if ($dir == 'sprkr')   $sqli = array("nm_zp", "im_vl");
    if ($dir == 'sprmod')  $sqli = array("nm_zp", "kd_md");
    if ($dir == 'sprmu')   $sqli = array("kd_mu", "im_mu");
    if ($dir == 'sprnl')   $sqli = array("kd_nl", "im_nl");
    if ($dir == 'spropk')  $sqli = array("kd_opk", "im_op");
    if ($dir == 'spropl')  $sqli = array("kd_opl", "im_opl");
    if ($dir == 'sprpd')   $sqli = array("kd_pd", "im_pd");
    if ($dir == 'sprprb')  $sqli = array("kd_prb", "im_prb");
    if ($dir == 'sprprg')  $sqli = array("kd_prg", "im_prg");
    if ($dir == 'sprprs')  $sqli = array("kd_prs", "im_prs");
    if ($dir == 'sprps')   $sqli = array("kd_ps", "im_ps");
    if ($dir == 'sprsk')   $sqli = array("nm_sk", "im_sk");
    if ($dir == 'sprsm')   $sqli = array("kd_sm", "im_sm");
    if ($dir == 'sprst')   $sqli = array("kd_ss", "im_ss");
    if ($dir == 'sprtg')   $sqli = array("kd_tg", "im_tg");
    if ($dir == 'sprtop')  $sqli = array("tp_ops", "im_ops");
    if ($dir == 'sprus')   $sqli = array("kd_p", "im_p");
    if ($dir == 'sprusl')  $sqli = array("nm_zp", "im_usl");
    if ($dir == 'sprzp')   $sqli = array("kd_zp", "im_zp");
    if ($dir == 'sprzv')   $sqli = array("kd_zv", "im_zv");
    if ($dir == 'sysfl')   $sqli = array("nm_fl", "im_fe");
    if ($dir == 'syspl')   $sqli = array("im_pe", "im_pl");
    if ($dir == 'sysprn')   $sqli = array("kd_prn", "im_prn");
//
    $seek_array = explode(" ", $seek);
    $seek_array[] = "";
    $seek_array[] = "";
    $seek_array[] = "";
//
    $imp = $sqli[1];
    $kdp = $sqli[0];

    if ($addsql > "") {
        $sqlta = " where $addsql";
    } else {
        $sqlta = "";
    }

    $sqlt = " select $imp as names, $kdp as kod from $dir $sqlta group by names, kod ";
    if ($seek_array[0] !== "") {
        $sqlt .= " having names like '%$seek_array[0]%'  ";
    }
    if ($seek_array[1] !== "") {
        $sqlt .= " and names like '%$seek_array[1]%' ";
    }
    if ($seek_array[2] !== "") {
        $sqlt .= " and names like '%$seek_array[2]%' ";
    }

    $rows = array();
    $recordset = array();

    if ($sqlt !== "") {
        $sth = $conn->query( $sqlt )->fetchAll();
        foreach ($sth as $row) {
            $record = array();
            $record[] = $row['names'];
            $record[] = $row['kod'];
            $recordset[] = $record;
        }


    }
return $recordset;
}
//===============================================================================
// seek warehouse
//===============================================================================
function seek_war($conn, $nm_sk, $imtb, $nmzpo, $ser, $kdst, $zak, $kd_ps, $dt_dk, $kd_op, $cnsk, $nm_zp) {
/*
$conn  - connection
$nmsk  - warehouse 
$imtb  - goods name
$ser   - serial number
$nmzpo - system number 
$kdst  - code
$ord   - order
$kd_ps  - company
$dtdk  - document date
$kd_op - type operation (1,2)
$cndt  - control date
	
*/	
$lg='';
$textz="";
$selt="";
// shiping
if ($kd_op=="2") {
   //
   $sqlt= "
   select m.* ,
      nm_zp       as  nmzpo,
      im.im_tb$lg as  kdim,
      ps.im_ps$lg as  kdps,
      kl.im_kl$lg as  kdkl,
      ns.im_sk$lg as  nmsk
   from ms_skl m
      left join sprim im  on m.kd_im=im.kd_im
      left join sprps ps  on m.kd_ps=ps.kd_ps
      left join sprkl kl  on m.kd_kl=kl.kd_kl
      left join sprsk ns  on m.nm_sk=ns.nm_sk
   where (m.nm_sk=$nm_sk)  
   and (m.pr_zp='1') ";
   if ($cnsk == true) {  $sqlt .= " and (m.dt_prs<='$dt_dk' ) "; }
    if ($nmzpo>0) { $sqlt .= " and (m.nm_zpo=$nmzpo) ";  	}
    if ($nm_zp>0) { $sqlt .= " and (m.nm_zp=$nm_zp) ";     	}
    if ($kdst>"") { $sqlt .= " and (m.kd_st like '%$kdst') ";  	}
    if ($zak>"")  { $sqlt .= " and (m.nm_zak = '$zak' ) ";  	}
    if ($ser>"")  {
      $sqlts= "
       select * 
       from sprser
       where (nm_ser like '%$ser%' )
          or (nm_srp like '%$ser%' )
       order by nm_zpo ";    
       $resser = $conn->SelectLimit($sqlts);
       if ($resser && $resser->RecordCount() > 0) {
          $sqlt .= " and ( ";
          while (!$resser->EOF) {
            $nmzpos = $resser->fields['nm_zpo'];
            if ($resser->RecordCount()==1) {$sqlt .= " "; } else { $sqlt .= " or "; }
              $sqlt .= " (m.nm_zpo = $nmzpos )";
            $resser->MoveNext();
            $sqlt .= " or ";
          }
           $sqlt .= "  )";
       }

   }
    //
   $sqlt .= "    and (m.kol_tk>0) ";
   $sqlt .= " group by kdim,nm_zp,sm_tk,dt_prs " ;
   //
   if ($imtb>"") {
  	   $seek_array = explode(" ", $imtb);  
       $seek_array[] = "";  
       $seek_array[] = "";
       $seek_array[] = "";

       if ($seek_array[0] !=="") { $sqlt .=" having kdim like '%$seek_array[0]%'  "; }
       if ($seek_array[1] !=="") { $sqlt .=" and kdim like '%$seek_array[1]%' ";  }
       if ($seek_array[2] !=="") { $sqlt .=" and kdim like '%$seek_array[2]%' ";  }
   }
}

// receiving
if ($kd_op=="1") {	
   //
   $sqlt= "
   select m.* ,
      nm_zp       as  nmzpo,
      im.im_tb$lg as  kdim,
      ps.im_ps$lg as  kdps,
      kl.im_kl$lg as  kdkl,
      ns.im_sk$lg as  nmsk
   from ms_skl m
      left join sprim im  on m.kd_im=im.kd_im
      left join sprps ps  on m.kd_ps=ps.kd_ps
      left join sprkl kl  on m.kd_kl=kl.kd_kl
      left join sprsk ns  on m.nm_sk=ns.nm_sk
   where (m.nm_sk=$nm_sk)
   and (m.kd_ps=$kd_ps) ";   
   
   if ($cnsk == true) {  $sqlt .= " and (m.dt_prs<='$dt_dk' )"; }
    if ($nmzpo>0) { $sqlt .= " and (m.nm_zpo=$nmzpo) ";  	  }
    if ($nm_zp>0) { $sqlt .= " and (m.nm_zp=$nm_zp) ";     	  }
    if ($kdst>"") { $sqlt .= " and (m.kd_st like '%$kdst') ";  }
    if ($zak>"")  { $sqlt .= " and (m.nm_zak = '$zak' ) ";  	  }
    if ($ser>"")  {
      $sqlts= "
       select * 
       from sprser
       where (nm_ser like '%$ser%' )
          or (nm_srp like '%$ser%' )
       order by nm_zpo ";    
       $resser = $conn->SelectLimit($sqlts);
       if ($resser && $resser->RecordCount() > 0) {
          $sqlt .= " and ( ";
          while (!$resser->EOF) {
            $nmzpos = $resser->fields['nm_zpo'];
            if ($resser->RecordCount()==1) {$sqlt .= " "; } else { $sqlt .= " or "; }
              $sqlt .= " (m.nm_zpo = $nmzpos )";
            $resser->MoveNext();
            $sqlt .= " or ";
          }
           $sqlt .= "  )";
       }

   }
    //
   $sqlt .= "   and ((m.kol_tk>0) or (m.kol_tk=0)) ";
   $sqlt .= " group by kdim,nm_zp,sm_tk,dt_prs " ;
   //
   if ($imtb>"") {
  	   $seek_array = explode(" ", $imtb);  
       $seek_array[] = "";  
       $seek_array[] = "";
       $seek_array[] = "";

       if ($seek_array[0] !=="") { $sqlt .=" having kdim like '%$seek_array[0]%'  "; }
       if ($seek_array[1] !=="") { $sqlt .=" and kdim like '%$seek_array[1]%' ";  }
       if ($seek_array[2] !=="") { $sqlt .=" and kdim like '%$seek_array[2]%' ";  }
   }
}
//
$res = $conn->SelectLimit($sqlt,50,0);
$recordset = array();
if ($res && $res->RecordCount() > 0) {
      while (!$res->EOF) {
         $record = array();
         $record[] = $res->fields['kdim'];
         $record[] = $res->fields['kd_st'];
         $record[] = $res->fields['kol_tk'];
         $record[] = $res->fields['sm_tk'];
         $record[] = $res->fields['kol_rzs'];
         $record[] = $res->fields['kdps'];
         $record[] = $res->fields['nm_zpo'];
         $record[] = $res->fields['dt_prs'];
         $record[] = $res->fields['kd_im'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['nm_zp'];
         $recordset[] = $record;
         $res->MoveNext();
      }
}

    return $recordset;
}


//===============================================================================
//  taCTH
//===============================================================================
function taCTH($conn, $lg, $kd_op, $dt_dk, $kd_dk){
$sqlt = " select ch.*,
             sm.im_sm$lg as imsm
          from  ms_cth ch
             left join sprsm sm on ch.kd_sm=sm.kd_sm
          where (ch.kd_op=($kd_op) and (ch.dt_dk=($dt_dk)) and (ch.kd_dk=($kd_dk)) ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  DDOK
//===============================================================================
function DDOK($conn, $nm_zp){
$sqlt = " select * from dl_dok
          where nm_zp=$nm_zp ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taDIS
//===============================================================================
function taDIS($conn, $lg){
$sqlt = "
   select   ds. *,
     im_zp$lg  as  kdzp
   from ms_dis ds
     left join sprzp zp  on ds.kd_zp=zp.kd_zp
  order by kd_dis,pr_kd ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taDOG
//===============================================================================
function taDOG($conn, $lg, $kd_dg){
$sqlt = "
   select dg.*,
     im.im_tb$lg as kdim
   from  ms_dog dg
     left join sprim im on dg.kd_im=im.kd_im
   where dg.kd_dg=($kd_dg)
   order by kdim  ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taDOK
//===============================================================================
function taDOK($conn, $lg, $stdk){
$sqlt = "
 select m.*, 
   ps.im_ps$lg    as  kdps, 
   sk.im_sk$lg    as  nmsk,
   os.im_sk$lg    as  ousk,
   ka.im_ka$lg    as  nmka,
   ch.im_ch$lg    as  prch,
   us.im_p$lg     as  impl,
   kl.im_kl$lg    as  kdkl, 
   sm.im_sm$lg    as  imsm, 
   opl.im_opl$lg  as  imopl, 
   dg.im_dg$lg    as  kddg,
   re.im_ps$lg    as  kdre, 
   op.im_ps$lg    as  oups 
 from  ms_dok m  
   left join sprsk  sk  on  m.nm_sk=sk.nm_sk
   left join sprkl  kl  on  m.kd_kl=kl.kd_kl
   left join sprsk  os  on  m.ou_sk=os.nm_sk
   left join sprka  ka  on  m.nm_ka=ka.nm_ka
   left join sprchk ch  on  m.pr_ch=ch.pr_ch
   left join sprdg  dg  on  m.kd_dg=dg.kd_dg
   left join sprps  ps  on  m.kd_ps=ps.kd_ps
   left join sprps  re  on  m.kd_re=re.kd_ps
   left join sprps  op  on  m.ou_ps=op.kd_ps
   left join sprus  us  on  m.kd_p=us.kd_p
   left join sprsm  sm  on  m.kd_sm=sm.kd_sm
   left join spropl opl on  m.kd_opl=opl.kd_opl
 where ((m.st_dk='1')  or  (m.st_dk=$stdk)) ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taDOKP
//===============================================================================
function taDOKP($conn, $kddk, $dtdk, $kdop){
$sqlt = "
 select * from ms_dok d
 where (d.kd_dk='$kddk') and (d.dt_dk='$dtdk') and (d.kd_op='$kdop') ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taDOKZ
//===============================================================================
function taDOKZ($conn, $lg, $nmzak){
$sqlt = "
select m.*, 
  ps.im_ps$lg as  kdps, 
  sk.im_sk$lg as  nmsk,
  os.im_sk$lg as  ousk,
  ch.im_ch$lg as  prch,
  us.im_p$lg  as  impl
from  ms_dok m  
  left join sprsk  sk on m.nm_sk=sk.nm_sk
  left join sprsk  os on m.ou_sk=os.nm_sk
  left join sprchk ch on m.pr_ch=ch.pr_ch
  left join sprps  ps on m.kd_ps=ps.kd_ps
  left join sprus  us on m.kd_p=us.kd_p
where (m.nm_zak=$nmzak)
order by dt_dk ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  DOPR
//===============================================================================
function DOPR($conn, $nm_zp){
$sqlt = "
 select * from dl_opr
 where  nm_zp=($nm_zp)   ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taEVE
//===============================================================================
function taEVE($conn, $dtev){
$lg="";
$sqlt = "
select m.*,
  im.im_tb$lg   as  kdim,
  ps.im_ps$lg   as  kdps,
  ch.im_ch$lg   as  prch,
  ks.im_op$lg   as  ksop,
  us.im_p$lg    as  impl,
  sm.im_sm$lg   as  kdsm
from ms_eve m
  left join sprim  im on m.kd_im=im.kd_im
  left join sprps  ps on m.kd_ps=ps.kd_ps
  left join sprsm  sm on m.kd_sm=sm.kd_sm
  left join sprchk ch on m.pr_ch=ch.pr_ch
  left join spropk ks on m.kd_opk=ks.kd_opk
  left join sprus  us on m.kd_p=us.kd_p
where (m.dt_ev=($dtev)) 
order by m.kd_ps,m.nm_zak ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taITG
//===============================================================================
function taITG($conn){
$lg="";
$sqlt = "
select it.*,
  sk.im_sk$lg as nmsk,
  ps.im_ps$lg as kdps,
  kl.im_kl$lg as kdkl,
  ka.im_ka$lg as nmka,
  ch.im_ch$lg as kdch
from ms_itg it
  left join sprsk sk  on it.nm_sk=sk.nm_sk
  left join sprps ps  on it.kd_ps=ps.kd_ps
  left join sprkl kl  on it.kd_kl=kl.kd_kl
  left join sprka ka  on it.nm_ka=ka.nm_ka
  left join sprchd ch on it.kd_ch=ch.kd_ch  ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taIZD
//===============================================================================
function taIZD($conn, $lg, $nm_zp){
$sqlt = "
select iz.*, 
 im.im_tb$lg as kdim,
 ps.im_ps$lg as kdps,
 zv.im_zv$lg as kdzv
from  ms_izd iz
 left join sprim im on iz.kd_im=im.kd_im
 left join sprps ps on iz.kd_ps=ps.kd_ps
 left join sprzv zv on iz.kd_zv=zv.kd_zv
where (iz.nm_zpi=$nm_zp)
order by kdim ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taLAB
//===============================================================================
function taLAB($conn, $lg, $nmzak){
$sqlt = "
select m.*,
  im.im_tb$lg   as  kdim,
  ps.im_ps$lg   as  kdps,
  kl.im_kl$lg   as  kdkl,
  sm.im_sm$lg   as  kdsm
from ms_lab m
  left join sprim im on m.kd_im=im.kd_im
  left join sprps ps on m.kd_ps=ps.kd_ps
  left join sprsm sm on m.kd_sm=sm.kd_sm
  left join sprkl kl   on m.kd_kl=kl.kd_kl
where (m.nm_zak=($nmzak))
order by m.nm_st,kdsm ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taLOC
//===============================================================================
function taLOC($conn, $lg){
$sqlt = "
select m.*,
  im.im_tb$lg   as  kdim,
  sk.im_sk$lg   as  nmsk
from ms_loc  m
  left join sprim im on m.kd_im=im.kd_im
  left join sprsk sk on m.nm_sk=sk.nm_sk
  left join ms_ops os on m.nm_zpo=os.nm_zp
where m.kd_lc>''
order by m.kd_lc ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taLOP
//===============================================================================
function taLOP($conn, $nmzpd, $nmzpo){
$sqlt = "
select m.*
from ms_lop  m
where  (m.nm_zpd=($nmzpd)) and (m.nm_zpo=($nmzpo))
order by m.kd_lc ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  MD
//===============================================================================
function MD($conn, $lg, $kdst){
$sqlt = "
select m.kd_im,m.kd_tg,m.kd_ig,m.kd_ds,
    im.im_tb$lg  as kdim
from ms_skl m
  left join sprim im on m.kd_im=im.kd_im
where (m.kd_st=$kdst)
limit 1 ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  read product
//===============================================================================
function read_izd($conn, $kdim){
$lg='';
$sqlt = "
select iz.*
from   spriz iz
where (iz.kd_im=($kdim)) ";

$resrec = $conn->Execute($sqlt);
$res = $resrec->fields;
return $res;
}


//===============================================================================
//  taOBP
//===============================================================================
function taOBP($conn, $nmzp){
$lg='';
$sqlt = "
select ob.*,
 im.im_tb$lg as imiz
from   ms_obp ob
 left join sprim im on ob.kd_im=im.kd_im
where (ob.nm_zpd=($nmzp)) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taOPR
//===============================================================================
function taOPR($conn, $lg, $nmzp){
$sqlt = "
select m.*,
  im.im_tb$lg   as  kdim,
  ps.im_ps$lg   as  kdps,
  kl.im_kl$lg   as  kdkl,
  ch.im_ch$lg   as  prch,
  ks.im_op$lg   as  ksop,
  sk.im_sk$lg   as  nmsk,
  re.im_ps$lg   as  kdre,
  os.sm_pr      as  smpr,
  os.sm_prdl    as  smprdl
from ms_opr m
  left join sprim im  on  m.kd_im=im.kd_im
  left join sprps ps  on  m.kd_ps=ps.kd_ps
  left join sprkl kl  on  m.kd_kl=kl.kd_kl
  left join sprsk sk  on  m.nm_sk=sk.nm_sk
  left join sprps re  on  m.kd_re=re.kd_ps
  left join sprchk ch on  m.pr_ch=ch.pr_ch
  left join spropk ks on  m.kd_opk=ks.kd_opk
  left join ms_ops os on  m.nm_zpo=os.nm_zp
where (m.nm_zpd=($nmzp))
order by m.nm_st  ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taOPS
//===============================================================================
function taOPS($conn, $nm_zpo){
$sqlt = "
select m.*
from ms_ops m
where (m.nm_zp  =  ($nm_zpo)) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taOPSS
//===============================================================================
function taOPSS($conn, $lg, $nm_zpo){
$sqlt = "
select op.*,
 im.im_tb$lg  as kdim
from ms_ops op
 left join sprim im on op.kd_im=im.kd_im
where (op.nm_zp  = ($nm_zpo)) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  OPV
//===============================================================================
function OPV($conn, $lg, $nm_zpo){
$sqlt = "
select m.*,   
 im.im_tb$lg  as kdim,
 tg.im_tg$lg  as kdtg
from ms_opv m
  left join sprim im on m.kd_im=im.kd_im
  left join sprtg tg on m.kd_tg=tg.kd_tg
where (m.nm_zpo  = ($nm_zpo))  ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taOPZ
//===============================================================================
function taOPZ($conn, $lg, $nmzak){
$sqlt = "
select m.*,
  im.im_tb$lg   as  kdim,
  ps.im_ps$lg   as  kdps,
  sm.im_sm$lg   as  kdsm
from ms_opz m
  left join sprim im on m.kd_im=im.kd_im
  left join sprps ps on m.kd_ps=ps.kd_ps
  left join sprsm sm on m.kd_sm=sm.kd_sm
where (m.nm_zak=($nmzak))  and (m.pr_pr=0)
order by kdim  ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taORDZ
//===============================================================================
function taORDZ($conn, $lg, $kdim, $nmzak){
$sqlt = "
select m.*,
  im.im_tb$lg   as  kdim,
  ps.im_ps$lg   as  kdps,
  ch.im_ch$lg   as  prch,
  sk.im_sk$lg   as  nmsk
from ms_opr m
  left join sprim im on m.kd_im=im.kd_im
  left join sprps ps on m.kd_ps=ps.kd_ps
  left join sprsk sk on m.nm_sk=sk.nm_sk
  left join sprps re on m.kd_re=re.kd_ps
  left join sprchk ch on m.pr_ch=ch.pr_ch
where (m.kd_im=($kdim)) and (m.nm_zak=($nmzak)) and (m.kd_op='4')
order by kdim  ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taPRS
//===============================================================================
function taPRS($conn, $lg, $kd_prs){
$sqlt = "
select pr.*,
 im.im_tb$lg   as  kdim,
 sk.im_sk$lg   as  nmsk,
 ps.im_ps$lg   as  kdps,
 gs.im_gs$lg   as  kdgs,
 zv.im_zv$lg   as  kdzv
from ms_prs pr
 left join sprsk sk on pr.nm_sk=sk.nm_sk
 left join sprim im on pr.kd_im=im.kd_im
 left join sprps ps on pr.kd_ps=ps.kd_ps
 left join sprgs gs on pr.kd_gs=gs.kd_gs
 left join sprzv zv on pr.kd_zv=zv.kd_zv
where (kd_prs=($kd_prs))
order by kdim ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QDIS
//===============================================================================
function QDIS($conn, $kddis, $kdzp){
$sqlt = "
select * from ms_dis
where (kd_dis=$kddis) and (kd_zp=$kdzp)
order by pr_kd ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QIM
//===============================================================================
function QIM($conn, $kdim) {
$sqlt = "
select   s. *, 
  tg.kd_n1 as nl1,
  tg.kd_n2 as nl2
from sprim s
  left join sprtg tg on  s.kd_tg=tg.kd_tg
where (kd_im=($kdim)) ";
$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QINV
//===============================================================================
function QINV($conn, $nmsk) {
$lg="";
$sqlt = "
select distinct m.*,  
 o.nm_zps    as  nmzps,
 o.dt_dk     as  dtdk,
 im.im_tb$lg as  kdim,
 ps.im_ps$lg as  kdps,
 tg.im_tg$lg as  kdtg,
 ns.im_sk$lg as  nmsk
from ms_skl m, ms_opr o 
 left join sprim im  on m.kd_im=im.kd_im
 left join sprps ps  on m.kd_ps=ps.kd_ps
 left join sprkl kl  on m.kd_kl=kl.kd_kl
 left join sprtg tg  on m.kd_tg=tg.kd_tg
 left join sprsk ns  on m.nm_sk=ns.nm_sk
where (m.nm_sk=($nmsk))  and (m.nm_zp=o.nm_zps) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  get cost
//===============================================================================
function get_cost($conn, $kd_im, $kd_st, $nm_zpo, $kdprs, $kd_ps, $pr_ch, $nm_zps) {
$sttk =0;
$mes  ="";
$recordret =array();
$record    = array();
$kd_prs    =0;
//
$sqlt = " select * from sprchk where pr_ch=$pr_ch ";
$sprchk = $conn->Execute($sqlt);
if ($sprchk->RecordCount() == 0) { return $recordret ; }
    $chk = $sprchk->fields;
// receiving
if ($chk['tp_op']=='1') {
   // find description
   if ($nm_zpo > 0) {
      $sqlops = " select * from ms_ops where nm_zp=$nm_zpo "; 
      $opsrec = $conn->Execute($sqlops);
      if (($opsrec->RecordCount() >0) and ($kd_im=='')) {
      	  	$sttk=$opsrec->fields['sm_pr'];  
            $record[] = $sttk;
            $record[] = '';
            $recordret[] = $record;
            return $recordret; }
         else {
             $record[] = $sttk;
             $record[] = 'GetCost: Error 1';
             $recordret[] = $record;
             return $recordret;
         }
   }
}
   else {      
     $record[] = 0;  
     $record[] = 'GetCost: Error 2';
     $recordret[] = $record;
     return $recordret; 
   }
}

/*
// shiping
if ($chk['tp_op']=='2') {
// check price-list









   if ($kd_prs>0) {
   	  $stprs=0;
      $sqlprs = " select * from ms_prs where kd_im=$kd_im and kd_prs=$kd_prs "; 
      $prsrec = $conn->Execute($sqlprs);
	  if ($prsrec && $prsrec->RecordCount() > 0) {
         while (!$prsrec->EOF) {
           if ((($prsrec->fields['kd_st']>"") & ($prsrec->fields['kd_st']==$kd_st)) |($prsrec->fields['kd_st']=="")) {
           	  if ($stprs<$prsrec->fields['sm_sp']) {$stprs=$prsrec->fields['sm_sp']; };
           };
           $prsrec->MoveNext();
         };
      };
  };
	
};

/*

//����� ��� ����� ���� ������
FZapKol.LBRAS.Items.Clear;
smopL :=0;
//���������� �� ....
okrs:=2;
//��������
FZapKol.smop :=0;
//������
FZapKol.skdsm :=0;   {������ � ���������}
FZapKol.skdst :=0;   {������ � ���� }
FZapKol.smst  :=0;   {������ ����}
//����������� �� �����
FZapKol.msksm:=0;    {����������� ��������}
FZapKol.mkdst :=0;   {����������� � ���� }
FZapKol.mmst  :=0;   {������ ����}
//
prsk :=0; {��������� �� ������ �� ������ �����}
ssknc:=100;
//
FZapKol.smop :=dmms.taSKLSM_TK.Value;
//
FZapKol._LbPrice.Caption:=CurrToStr(FZapKol.smop);
FZapKol._LbDis.Caption  :=IntToStr(FZapKol.pDIS);
//��������
if dmms.taSKLSM_TK.Value<>0
then FZapKol.LBRAS.Items.Add('- Price:'+dmms.taSKLSM_TK.AsString);
//���� ��������� ����� �� ���� �� ������
if (Fsklad.TekPrs)>0 then begin {1}
   {����� ����������� ��� ����}
   FZapKol.QZAPS.Active:=false;
   FZapKol.QZAPS.Params.ParamByName('KDPRS').Value:=FSklad.TekPrs;
   FZapKol.QZAPS.Params.ParamByName('KDIM').Value :=dmms.taSKLKD_IM.Value;
   FZapKol.QZAPS.Active:=true;
   if (FZapKol.QZAPS.RecordCount>0) and (FZapKol.QZAPSSM_SP.Value>0)
      then begin {2}
      FZapKol.LBRAS.Items.Add('*** Price: '+IntToStr(FSklad.TekPrs));
      FZapKol.smop :=FZapKol.QZAPSSM_SP.Value;
   end; {2}
   FZapKol.QZAPS.Active:=false;
   //
   FZapKol._LbPrice.Caption:=CurrToStr(FZapKol.smop);
   //
   if FZapKol.QZAPSSM_SP.Value<>0
   then FZapKol.LBRAS.Items.Add('- Price: '+FZapKol.QZAPSSM_SP.AsString);
   EXIT;
end; {1}
//��������
if FzapKol.pDIS>0 then begin
   FZapKol.smop :=FZapKol.smop-FZapKol.QZAPSSM_SP.Value;
   FZapKol.smop:=FZapKol.smop-xround((FZapKol.smop*FzapKol.pDIS/ssknc),5);
   FZapKol.LBRAS.Items.Add('- Discount: '+IntToStr(FZapKol.pDis));
   FZapKol.LBRAS.Items.Add('* - Price: '+CurrToStr(FZapKol.smop));
end;
//������ �� ����������� ������\������� ���������� � FmOpr
dmms.QZAPSK.Close;
dmms.QZAPSK.Params.ParamByName('NM_ZP').Value:=dmms.taSKLNM_ZP.Value;
dmms.QZAPSK.Open;
with dmms.QZAPSK do begin {1}
  FIRST;
  while not eof do begin {2}
    if dmms.QZAPSKKOL_TK.Value>0 then begin {3}
       //������ ��� �����������
       if dmms.QZAPSKST_SKD.Value=0 then begin {4}
     	    LocateSP('SPRSKD',dmms.QZAPSKKD_SKD.Value,'');
          FZapKol.LBRAS.Items.Add('* Discount: '+dmms.taSPRSKDkdzp.Value);
          if (dmms.QZAPSKSM_SKD.Value>0) then
          FZapKol.LBRAS.Items.Add('* - percen: '+dmms.QZAPSKSM_SKD.AsString);
          if (dmms.QZAPSKSP_GRC.Value>0) then
          FZapKol.LBRAS.Items.Add('* - from price: '+dmms.QZAPSKSP_GRC.AsString);
          if (dmms.QZAPSKSM_GRC.Value>0) then
          FZapKol.LBRAS.Items.Add('* - price:   '+dmms.QZAPSKSM_GRC.AsString);
          //������ �� ���� � ���������
          if (dmms.QZAPSKSM_SKD.Value>FZapKol.skdsm)
          then FZapKol.skdsm:=dmms.QZAPSKSM_SKD.Value;
          //������ � ����
          if (dmms.QZAPSKSP_GRC.Value>FZapKol.skdst)
          then FZapKol.skdst:=dmms.QZAPSKSP_GRC.Value;
          //������ � ����
          if (dmms.QZAPSKSM_GRC.Value<FZapKol.smst)
          then FZapKol.smst:=dmms.QZAPSKSM_GRC.Value;
          end {4}
       else begin {4} {����������� dmms.QZAPSKST_SKD.Value=1}
          //����������� ��������� ��������� ����
     	    LocateSP('SPRSKD',dmms.QZAPSKKD_SKD.Value,'');
          FZapKol.LBRAS.Items.Add('* Limitation: '+dmms.taSPRSKDkdzp.Value);
          if (dmms.QZAPSKSM_SKD.Value>0) then
          FZapKol.LBRAS.Items.Add('* - percen: '+dmms.QZAPSKSM_SKD.AsString);
          if (dmms.QZAPSKSP_GRC.Value>0) then
          FZapKol.LBRAS.Items.Add('* - from price: '+dmms.QZAPSKSP_GRC.AsString);
          if (dmms.QZAPSKSM_GRC.Value>0) then
          FZapKol.LBRAS.Items.Add('* - price: '+dmms.QZAPSKSM_GRC.AsString);
          if (dmms.QZAPSKSM_SKD.Value=0) and (dmms.QZAPSKSP_GRC.Value=0) and
             (dmms.QZAPSKSM_GRC.Value=0) then begin {5}
             FZapKol.LBRAS.Items.Add('* PRICE CANNOT BE CHANGED');
             prsk:=1;     {���� �� ����� �������� ������}
             BREAK;
          end;{5}
          //����������� �� ���� � ���������
          if dmms.QZAPSKSM_SKD.Value>0 then begin
            if (dmms.QZAPSKSM_SKD.Value<FZapKol.msksm) or (FZapKol.msksm=0)
            then FZapKol.msksm:=dmms.QZAPSKSM_SKD.Value;
            end
          else begin
            if (dmms.QZAPSKSM_SKD.Value>FZapKol.msksm) or (FZapKol.msksm=0)
            then FZapKol.msksm:=dmms.QZAPSKSM_SKD.Value;
          end;
          //����������� � ����
          if dmms.QZAPSKSP_GRC.Value>0 then begin
             if (dmms.QZAPSKSP_GRC.Value<FZapKol.mkdst) or (FZapKol.mkdst=0)
             then FZapKol.mkdst:=dmms.QZAPSKSP_GRC.Value;
             end
          else begin
             if (dmms.QZAPSKSP_GRC.Value>FZapKol.mkdst) or (FZapKol.mkdst=0)
             then FZapKol.mkdst:=dmms.QZAPSKSP_GRC.Value;
          end;
          {����������� � ����}
          if dmms.QZAPSKSM_GRC.Value>0 then begin
             if (dmms.QZAPSKSM_GRC.Value<FZapKol.mmst)or(FZapKol.mmst=0)
             then FZapKol.mmst:=dmms.QZAPSKSM_GRC.Value;
             end
          else begin
             if (dmms.QZAPSKSM_GRC.Value>FZapKol.mmst)or(FZapKol.mmst=0)
             then FZapKol.mmst:=dmms.QZAPSKSM_GRC.Value;
          end;
       end; {4}
    end; {3}
    NEXT;
  end; {2}
end; {1}
{��� �������� � �����}
{������}
FZapKol.LBRAS.Items.Add('*** Real discount');
if FZapKol.skdsm>0
then FZapKol.LBRAS.Items.Add('* discount(%): '+FloatToStr(FZapKol.skdsm));
if FZapKol.skdst>0
then FZapKol.LBRAS.Items.Add('* from price: '+FloatToStr(FZapKol.skdst));
if FZapKol.smst>0
then FZapKol.LBRAS.Items.Add('* price: '+FloatToStr(FZapKol.smst));
{�����������}
FZapKol.LBRAS.Items.Add('*** Real limitation');
if FZapKol.msksm>0
then FZapKol.LBRAS.Items.Add('* discount(%): '+FloatToStr(FZapKol.msksm));
if FZapKol.mkdst>0
then FZapKol.LBRAS.Items.Add('* from then price: '+FloatToStr(FZapKol.mkdst));
if FZapKol.mmst>0
then FZapKol.LBRAS.Items.Add('* price: '+FloatToStr(FZapKol.mmst));
//�������� ��������� ����
if (prsk=0) then begin {1}
   //������ �� ���������
   {������ �������}
   if FZapKol.skdsm<>0 then begin
      if FZapKol.smop<>0
      then FZapKol.smop:=FZapKol.smop+xround((FZapKol.smop*FZapKol.skdsm/ssknc),5);
      FZapKol.LBRAS.Items.Add('*** Discount(%): '+FloatToStr(FZapKol.skdsm));
   end;
   {������ � ����}
   if FZapKol.skdst<>0 then begin
      if FZapKol.smop<>0 then FZapKol.smop:=FZapKol.smop-FZapKol.skdst;
      FZapKol.LBRAS.Items.Add('*** Discount of item: '+FloatToStr(FZapKol.skdst));
   end;
   {������ ����}
   if FZapKol.smst<>0 then begin
      if FZapKol.smop<>0 then FZapKol.smop:=FZapKol.smst;
      FZapKol.LBRAS.Items.Add('*** Price: '+FloatToStr(FZapKol.smst));
   end;
end;
//�������� �����������
if (prsk=0) then begin  {1}
   smopl:=0;
   {����������� �� ���� � ���������}
   if FZapKol.msksm>0 then begin {2}
      smopl:=dmms.taSKLSM_TK.Value;
      smopL :=smopL + xround((smopL*FZapKol.msksm/ssknc),5);
   end; {2}
   {����������� � ����}
   if (FZapKol.mkdst>0) then smopl:=dmms.taSKLSM_TK.Value-FZapKol.mkdst;
   {����������� � ����}
   if (FZapKol.mmst>0)  then smopl:=FZapKol.mmst;
   {��������� �����������}
   if FZapKol.smop<smopl then begin
      FZapKol.LBRAS.Items.Add('*** Restriction of price:'+FloatToStr(smopl));
      FZapKol.smop:=smopl;
   end;
end; {1}
//
FZapKol.LBRAS.Items.Add('*** -----------------------------------------');
if FZapKol.smop<>0
then FZapKol.LBRAS.Items.Add('**** PRICE:'+FloatToStr(FZapKol.smop));
//
FZapKol._LbPrice.Caption:=CurrToStr(FZapKol.smop);
end;



return $sttk;
};
*/
//===============================================================================
//  get history
//===============================================================================
function get_history($conn, $kod, $kdim) {
/* operation
	SELECT M.*,
  if((:LG)=0,CH.IM_CH,CH.IM_CH2)  AS prch,
  if((:LG)=0,PS.IM_PS,PS.IM_PS2)      AS kdps,
  if((:LG)=0,SK.IM_SK,SK.IM_SK2)   AS  nmsk
FROM MS_OPR M
  left join SPRSK SK on M.NM_SK=SK.NM_SK
  left join SPRCHK CH on M.PR_CH=CH.PR_CH
  left join SPRPS PS on M.KD_PS=PS.KD_PS
WHERE (M.KD_IM=:KDIM)  AND (M.ST_DK='0') AND 
               ((M.KD_OP='5') OR (M.KD_OP='2') OR (M.KD_OP='1'))
ORDER BY M.DT_DK    
*/
/* reservation
	SELECT RS.*,
 if((:LG)=0,PS.IM_PS,PS.IM_PS2)  AS  kdps,
 if((:LG)=0,IM.IM_TB,IM.IM_TB2)    AS  kdim,
 if((:LG)=0,US.IM_P,US.IM_P2)       AS  impl,
 if((:LG)=0,SK.IM_SK,SK.IM_SK2)   AS  nmsk
FROM MS_RES RS
 left join SPRPS PS on RS.KD_PS=PS.KD_PS
 left join SPRIM IM   on RS.KD_IM=IM.KD_IM
 left join SPRSK SK on RS.NM_SK=SK.NM_SK
 left join SPRUS US on RS.KD_P=US.KD_P
WHERE (RS.KD_IM=:KDIM) 
ORDER BY RS.DT_RS
*/
/* warehouse
SELECT M.* ,
 if((:LG)=0,PS.IM_PS,PS.IM_PS2) AS  kdps,
 if((:LG)=0,KL.IM_KL ,KL.IM_KL2) AS  kdkl,
 if((:LG)=0,NS.IM_SK,NS.IM_SK2) AS nmsk
FROM MS_SKL M
 left join SPRPS PS  on M.KD_PS=PS.KD_PS
 left join SPRKL KL   on M.KD_KL=KL.KD_KL
 left join SPRSK NS  on M.NM_SK=NS.NM_SK
WHERE (M.KOL_TK>0)  AND  (M.KD_IM=:KDIM)
ORDER BY NMSK    

*/
/* price
SELECT PR.*,
 if((:LG)=0,PS.IM_PS,PS.IM_PS2)  AS  kdps,
 if((:LG)=0,GS.IM_GS,GS.IM_GS2) AS  kdgs,
 if((:LG)=0,ZV.IM_ZV,ZV.IM_ZV2)  AS  kdzv
FROM MS_PRS PR
 left join SPRPS PS on PR.KD_PS=PS.KD_PS
 left join SPRGS GS on PR.KD_GS=GS.KD_GS
 left join SPRZV ZV on PR.KD_ZV=ZV.KD_ZV
WHERE (PR.KD_IM=:KD_IM)
ORDER BY PR.KD_PRS
*/
$lg='';
if ($kod=='operations') {
   // 
  $sqlt = "
  select m.*,
    ch.im_ch$lg as prch,
    ps.im_ps$lg as kdps,
    sk.im_sk$lg as  nmsk
  from ms_opr m
    left join sprsk  sk  on  m.nm_sk=sk.nm_sk
    left join sprchk ch  on  m.pr_ch=ch.pr_ch
    left join sprps  ps  on  m.kd_ps=ps.kd_ps
  where (m.kd_im=$kdim)  and (m.st_dk='0') and 
      ((m.kd_op='5') or (m.kd_op='2') or (m.kd_op='1'))
  order by m.dt_dk desc ";    
  
  $res = $conn->SelectLimit($sqlt,50,0);
  $recordset = array();
  if ($res && $res->RecordCount() > 0) {
      while (!$res->EOF) {
         $record = array();
         $record[] = $res->fields['kd_dk'];
         $record[] = $res->fields['dt_dk'];
         $record[] = $res->fields['prch'];
         $record[] = $res->fields['kdps'];
         $record[] = $res->fields['kol_op'];
         $record[] = $res->fields['sm_op'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         $record[] = $res->fields['pr_dl'];
         $recordset[] = $record;
         $res->MoveNext();
      }
  }
}
// prices
if ($kod=='prices') {
   // 
  $sqlt = "
  select pr.*,
     pp.im_prs$lg as  impr,
     ps.im_ps$lg  as  kdps,
     gs.im_gs$lg  as  kdgs,
     zv.im_zv$lg  as  kdzv
  from ms_prs pr
    left join sprprs pp on pr.kd_prs=pp.kd_prs
    left join sprps  ps on pr.kd_ps=ps.kd_ps
    left join sprgs  gs on pr.kd_gs=gs.kd_gs
    left join sprzv  zv on pr.kd_zv=zv.kd_zv
  where (pr.kd_im=$kdim)
  order by pr.kd_prs desc ";

  $res = $conn->SelectLimit($sqlt,50,0);
  $recordset = array();

  if ($res && $res->RecordCount() > 0) {
      while (!$res->EOF) {
         $record = array();
         $record[] = $res->fields['impr'];
         $record[] = $res->fields['kdps'];
         $record[] = $res->fields['dt_prs'];
         $record[] = $res->fields['sm_sp'];
         $record[] = $res->fields['dt_gd'];
         $recordset[] = $record;
         $res->MoveNext();
      }
  }
}
// warehouses
if ($kod=='warehouses') {
   // 
  $sqlt = "
  select m.* ,
    ps.im_ps$lg as  kdps,
    kl.im_kl$lg as  kdkl,
    ns.im_sk$lg as  nmsk
  from ms_skl m
    left join sprps ps  on m.kd_ps=ps.kd_ps
    left join sprkl kl   on m.kd_kl=kl.kd_kl
    left join sprsk ns  on m.nm_sk=ns.nm_sk
  where (m.kol_tk>0)  and  (m.kd_im=$kdim)  
  order by nmsk    ";
//         $tt = printf("% 10s",$res->fields['kol_tk']);

  $res = $conn->SelectLimit($sqlt,50,0);
  $recordset = array();

  if ($res && $res->RecordCount() > 0) {
      while (!$res->EOF) {
         //$a1 = strval($res->fields['kol_tk']);
         //$a2 = strval($res->fields['sm_tk']);
      	 $record = array();
         
         $record[] = $res->fields['nmsk'];
         $record[] = $res->fields['kol_tk'];
         $record[] = $res->fields['sm_tk'];
         $record[] = $res->fields['kdps'];
         $recordset[] = $record;
         $res->MoveNext();
      }
  }
}
// reserved
if ($kod=='reserved') {
   // 
  $sqlt = "
	select rs.*,
       ps.im_ps$lg  as  kdps,
       im.im_tb$lg  as  kdim,
       us.im_p$lg   as  impl,
       sk.im_sk$lg  as  nmsk
    from ms_res rs
       left join sprps ps on rs.kd_ps=ps.kd_ps
       left join sprim im on rs.kd_im=im.kd_im
       left join sprsk sk on rs.nm_sk=sk.nm_sk
       left join sprus us on rs.kd_p=us.kd_p
    where (rs.kd_im=$kdim) 
    order by rs.dt_rs desc ";
  
  $res = $conn->SelectLimit($sqlt,50,0);
  $recordset = array();
  
  if ($res && $res->RecordCount() > 0) {
      while (!$res->EOF) {
         $record = array();
         $record[] = $res->fields['dt_rs'];
         $record[] = $res->fields['nm_zak'];
         $record[] = $res->fields['nmsk'];
         $record[] = $res->fields['kl_rs'];
         $record[] = $res->fields['impl'];
         $recordset[] = $record;
         $res->MoveNext();
      }
  }
}
// location
if ($kod=='locations') {
   // 
  $sqlt = "
	select lc.*,
       im.im_tb$lg  as  kdim,
       sk.im_sk$lg  as  nmsk
    from ms_loc lc
       left join sprim im on lc.kd_im=im.kd_im
       left join sprsk sk on lc.nm_sk=sk.nm_sk
    where (lc.kd_im=$kdim) 
    order by lc.nm_sk ";
  
  $res = $conn->SelectLimit($sqlt,50,0);
  $recordset = array();
  
  if ($res && $res->RecordCount() > 0) {
      while (!$res->EOF) {
         $record = array();
         $record[] = $res->fields['nmsk'];
         $record[] = $res->fields['kd_st'];
         $record[] = $res->fields['kd_lc'];
         $record[] = $res->fields['kol_lc'];
         $recordset[] = $record;
         $res->MoveNext();
      }
  }
}
// orders
if ($kod=='orders') {
   // 
  $sqlt = "
	select skz.*,
       ps.im_ps$lg  as  kdps,
       zak.dt_dks   as  dtzks,
       zak.dt_dke   as  dtzke
    from ms_skz skz
       left join sprps ps   on skz.kd_ps=ps.kd_ps
       left join ms_zak zak on skz.nm_zpz=zak.nm_zp
    where (skz.kd_im=$kdim) 
    order by skz.nm_zp ";
  
  $res = $conn->SelectLimit($sqlt,50,0);
  $recordset = array();
  
  if ($res && $res->RecordCount() > 0) {
      while (!$res->EOF) {
         $record = array();
         $record[] = $res->fields['nm_zak'];
         $record[] = $res->fields['dtzks'];
         $record[] = $res->fields['kdps'];
         $record[] = $res->fields['kd_st'];
         $record[] = $res->fields['kl_zk'];
         $recordset[] = $record;
         $res->MoveNext();
      }
  }
}


    return $recordset;

}

//===============================================================================
//  QIZD
//===============================================================================
function QIZD($conn, $nmzp) {
$lg='';
$sqlt = "
select iz.*,
 im.im_tb$lg as kdim,
 ps.im_ps$lg as kdps,
 zv.im_zv$lg as kdzv
from  ms_izd iz 
 left join sprim im on iz.kd_im=im.kd_im
 left join sprps ps on iz.kd_ps=ps.kd_ps
 left join sprzv zv on iz.kd_zv=zv.kd_zv
where (iz.nm_zpi=($nmzp)) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QLG
//===============================================================================
function QLG($conn) {
$sqlt = "
select s.* 
from  sprlg s ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QOPR
//===============================================================================
function QOPR($conn, $nmzp, $kdus) {
$lg="";
$sqlt = "
select m.*,
  im.im_tb$lg  as  kdim,
  ps.im_ps$lg  as  kdps,
  kl.im_kl$lg  as  kdkl,
  ch.im_ch$lg  as  prch,
  ks.im_op$lg  as  ksop,
  sk.im_sk$lg  as  nmsk,
  os.im_sk$lg  as  ousk,
  ka.im_ka$lg  as  nmka,
  re.im_ps$lg  as  kdre,
  ss.sm_pr     as  smpr,
  ss.sm_prdl   as  smprdl
from ms_opr m
 left join sprim im  on m.kd_im=im.kd_im
 left join sprps ps  on m.kd_ps=ps.kd_ps
 left join sprkl kl  on m.kd_kl=kl.kd_kl
 left join sprchk ch on m.pr_ch=ch.pr_ch
 left join spropk ks on m.kd_opk=ks.kd_opk
 left join sprsk sk  on m.nm_sk=sk.nm_sk
 left join sprsk os  on m.ou_sk=os.nm_sk
 left join sprka ka  on m.nm_ka=ka.nm_ka
 left join ms_ops ss on m.nm_zpo=ss.nm_zp
 left join sprps re  on m.kd_re=re.kd_ps 
where (m.nm_zp=($nmzp)) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QOPS
//===============================================================================
function QOPS($conn, $nm_zpo) {
$sqlt = "
select op.*
from ms_ops op
where (op.nm_zp=($nm_zpo)) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QSER
//===============================================================================
function QSER($conn, $nmzp) {
$lg="";
$sqlt = "
select sr.*,
 im.im_tb$lg  as  kdim
from sprser sr
 left join sprim im on sr.kd_im=im.kd_im
where (sr.nm_zp=$nmzp) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QSERD
//===============================================================================
function QSERD($conn, $nmzp) {
$sqlt = "
select s.*
from ms_ser s
where (s.nm_zp=$nmzp)
order by s.nm_ser ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QSKL
//===============================================================================
function QSKL($conn, $nmsk, $kdim ) {
$sqlt = "
select * from ms_skl
where (((nm_sk=($nmsk))  and ($nmsk)>0) or ($nmsk)=0)
      and (((kd_im=($kdim))   and ($kdim)>0)  or ($kdim)=0)
     and (kol_tk>0)
order  by dt_prs,kol_tk   ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QSKLM
//===============================================================================
function QSKLM($conn ) {
$sqlt = "
select nm_sk,kol_tk,sm_tk,sm_tkdl,kol_ms from ms_skl
where (kol_tk>0) and (sm_tkdl>0)
order by nm_sk ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QDOK
//===============================================================================
function QDOK($conn, $lg, $nmzpd) {
$sqlt = "
   select m.*, 
   ps.im_ps$lg   as  kdps, 
   sk.im_sk$lg   as  nmsk
   from  ms_dok m  
   left join sprsk  sk  on m.nm_sk=sk.nm_sk
   left join sprps  ps  on m.kd_ps=ps.kd_ps
   where nm_zp=$nmzpd "; 

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QSKLP
//===============================================================================
function QSKLP($conn, $lg, $nmzp, $nmzpo, $nmzps ) {
$sqlt = "
select m.*,
 im.im_tb$lg as  kdim,
 kl.im_kl$lg as  kdkl,
 ns.im_sk$lg as  nmsk
from  ms_skl m
 left join sprim im  on m.kd_im=im.kd_im
 left join sprsk ns  on m.nm_sk=ns.nm_sk
 left join sprkl kl  on m.kd_kl=kl.kd_kl
where (nm_zpo=$nmzpo) and
   ((m.nm_zp=$nmzp ) and ($nmzp)<>0)  or ((m.nm_zps=$nmzps) and ($nmzps)<>0) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
function QSKLP1($conn, $lg, $nmzp, $nmzpo, $nmzps ) {
$sqlt = "
select m.*,
 im.im_tb$lg as  kdim,
 kl.im_kl$lg as  kdkl,
 ns.im_sk$lg as  nmsk
from  ms_skl m
 left join sprim im  on m.kd_im=im.kd_im
 left join sprsk ns  on m.nm_sk=ns.nm_sk
 left join sprkl kl  on m.kd_kl=kl.kd_kl
where (nm_zpo=$nmzpo) and
   ((m.nm_zp=$nmzp ) and ($nmzp)<>0)  or ((m.nm_zps=$nmzps) and ($nmzps)<>0) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QSKLS
//===============================================================================
function QSKLS($conn, $nmsk, $kdim, $kdst, $kdps, $smtk, $smtkdl, $smprdl, $smpr ) {
$sqlt = "
select m.*, o.sm_pr, o.sm_prdl
 from  ms_skl m
 left join ms_ops o on m.nm_zpo=o.nm_zp
where  (m.nm_sk=($nmsk))  and  (m.kd_im=($kdim))    and  (m.kd_st=($kdst))
       and  (m.kd_ps=($kdps))   and   (m.sm_tk=($smtk)) and (m.sm_tkdl=($smtkdl))
       and   (o.sm_prdl=($smprdl)) and (o.sm_pr=($smpr))
order by m.nm_zp ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QSOPR
//===============================================================================
function QSOPR($conn, $nm_zpo, $nm_zpa ) {
$sqlt = "
select * from ms_opr
where (nm_zpo=($nm_zpo)) and (nm_zpa=($nm_zpa))  ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QWOPR
//===============================================================================
function QWOPR($conn, $nmzp ) {
$sqlt = "
select * from ms_opr
where (nm_zp=($nmzp)) "; 

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QZAP
//===============================================================================
function QZAP($conn ) {
$lg="";
$sqlt = "
select m.*,
 sk.im_sk$lg   as  nmsk,
 ok.im_sk$lg   as  ousk,
 im.im_tb$lg   as  kdim,
 im.kl_ed      as  kled,
 ps.im_ps$lg  as  kdps,
 kl.im_kl$lg  as  kdkl,
 ch.im_ch$lg  as  prch,
 ks.im_op$lg  as  ksop,
 ka.im_ka$lg  as  nmka,
 re.im_ps$lg  as  kdre,
 os.sm_pr  as smpr,
 os.sm_prdl as smprdl
from ms_opr m
  left join sprim im  on m.kd_im=im.kd_im
  left join sprps ps  on m.kd_ps=ps.kd_ps
  left join sprkl kl  on m.kd_kl=kl.kd_kl
  left join sprsk sk  on m.nm_sk=sk.nm_sk
  left join sprchk ch on m.pr_ch=ch.pr_ch
  left join spropk ks on m.kd_opk=ks.kd_opk
  left join sprsk ok  on m.ou_sk=ok.nm_sk
  left join sprka ka  on m.nm_ka=ka.nm_ka
  left join sprps re  on m.kd_re=re.kd_ps
  left join ms_ops os on m.nm_zpo=os.nm_zp
where  (m.kd_op='1')  and  (m.st_dk='0') ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QZAPC
//===============================================================================
function QZAPC($conn, $lg, $kdch ) {
$sqlt = "
select ch.*,
   sm.im_op$lg as kdsm
from  ms_cth ch
 left join spropk sm on ch.kd_sm=sm.kd_opk
where (kd_chd=($kdch) or (kd_chk=($kdch))) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QRES
//===============================================================================
function QRES($conn, $lg, $kdim, $nmzpo ) {
$sqlt = "
select rs.*,
   ps.im_ps$lg  as  kdps,
   im.im_tb$lg  as  kdim,
   us.im_p$lg   as  impl,
   sk.im_sk$lg  as  nmsk
from ms_res rs
   left join sprps ps on rs.kd_ps=ps.kd_ps
   left join sprim im on rs.kd_im=im.kd_im
   left join sprsk sk on rs.nm_sk=sk.nm_sk
   left join sprus us on rs.kd_p=us.kd_p
where (rs.kd_im=$kdim) and 
 (((rs.nm_zpo=$nmzpo) and ($nmzpo)>0) or (($nmzpo)=0))
               order by rs.dt_rs  ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QZAPD
//===============================================================================
function QZAPD($conn ) {
$sqlt = "
select * from sprops
where nm_pl>0
order by nm_pl  ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QZAPDS
//===============================================================================
function QZAPDS($conn, $nm_zp ) {
$sqlt = "
select m.*, s.kd_zp
from ms_skl m, sprsds s 
where m.nm_zp=($nm_zp)  ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QZAPSK
//===============================================================================
function QZAPSK($conn, $nm_zp ) {
$sqlt = "
select m.*, s.* 
from ms_skl m, sprskd s
where (s.kd_skd=1) and (m.nm_zp=($nm_zp)) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QZAPSM
//===============================================================================
function QZAPSM($conn, $nm_zpd, $nmsk ) {
$sqlt = "
select 
os.sm_pr      as smpr,
os.sm_prdl    as smprdl,
sum(m.bs_iz*m.kol_op*if(m.pr_op="+",1,0)) as besp,
sum(m.bs_iz*m.kol_op*if(m.pr_op="-",1,0)) as besr,
sum(m.kol_op*if(m.pr_op="+",1,0))         as kolp,
sum(m.kol_op*if(m.pr_op="-",1,0))         as kolr,
sum(m.kol_op*if(m.pr_op="+",1,0)*if(os.sm_prdl>0,0,os.sm_pr))   as smzkp,
sum(m.kol_op*if(m.pr_op="-",1,0)*if(os.sm_prdl>0,0,os.sm_pr))   as smzkr,
sum(m.kol_op*if(m.pr_op="+",1,0)*if(os.sm_prdl>0,os.sm_prdl,0)) as smzkdp,
sum(m.kol_op*if(m.pr_op="-",1,0)*if(os.sm_prdl>0,os.sm_prdl,0)) as smzkdr,
sum(m.kol_op*if(m.pr_op="+",1,0)*if(m.sm_opdl>0,0,m.sm_op))     as smoup,
sum(m.kol_op*if(m.pr_op="-",1,0)*if(m.sm_opdl>0,0,m.sm_op))     as smour,
sum(m.kol_op*if(m.pr_op="+",1,0)*if(m.sm_opdl>0,m.sm_opdl,0))   as smoudp,
sum(m.kol_op*if(m.pr_op="-",1,0)*if(m.sm_opdl>0,m.sm_opdl,0))   as smoudr,
sum(m.kol_op*if(m.pr_op="+",1,0)*if(m.sm_op1dl>0,0,m.sm_op1))   as sminp,
sum(m.kol_op*if(m.pr_op="-",1,0)*if(m.sm_op1dl>0,0,m.sm_op1))   as sminr,
sum(m.kol_op*if(m.pr_op="+",1,0)*if(m.sm_op1dl>0,m.sm_op1dl,0)) as smindp,
sum(m.kol_op*if(m.pr_op="-",1,0)*if(m.sm_op1dl>0,m.sm_op1dl,0)) as smindr
from ms_opr m
  left join ms_ops os on m.nm_zpo=os.nm_zp
where (m.nm_zpd=($nm_zpd)) and (m.nm_sk=($nmsk))
group by  m.nm_zpd                        ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QOBP
//===============================================================================
function QOBP($conn, $nmzp) {
$lg ='';
$sqlt = "
select ob.*,
 im.im_tb$lg as imiz
from   ms_obp ob
 left join sprim im on ob.kd_im=im.kd_im
where (ob.nm_zp=($nmzp)) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QRAB
//===============================================================================
function QRAB($conn, $nmzp) {
$lg ='';
$sqlt = "
select rb.*, 
  kl.im_kl$lg   as  kdkl,
  pd.im_pd$lg   as  kdpd
from ms_rab rb
 left join sprkl kl on rb.kd_kl=kl.kd_kl
 left join sprpd pd on rb.kd_pd=pd.kd_pd
where (rb.nm_zp=$nmzp) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taRAB
//===============================================================================
function taRAB($conn, $nmzpd, $kdus) {
$lg ='';
$sqlt = "
select rb.*, 
  kl.im_kl$lg   as  kdkl,
  pd.im_pd$lg   as  kdpd
from ms_rab rb
 left join sprkl kl on rb.kd_kl=kl.kd_kl
 left join sprpd pd on rb.kd_pd=pd.kd_pd
where (rb.nm_zpd=$nmzpd) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taRES
//===============================================================================
function taRES($conn, $nmzpd, $kdus) {
$lg="";
$sqlt = "
select rs.*,
 ps.im_ps$lg  as  kdps,
 im.im_tb$lg  as  kdim,
 us.im_p$lg   as  impl,
 sk.im_sk$lg  as  nmsk
from ms_res rs
 left join sprps ps on rs.kd_ps=ps.kd_ps
 left join sprim im on rs.kd_im=im.kd_im
 left join sprsk sk on rs.nm_sk=sk.nm_sk
 left join sprus us on rs.kd_p=us.kd_p
where (rs.nm_zpd=$nmzpd)
order by rs.dt_rs     ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  RES
//===============================================================================
function RES($conn, $lg, $kdim) {
$sqlt = "
select rs.*,
 ps.im_ps$lg  as  kdps,
 im.im_tb$lg  as  kdim,
 us.im_p$lg   as  impl,
 sk.im_sk$lg  as  nmsk
from ms_res rs
 left join sprps ps on rs.kd_ps=ps.kd_ps
 left join sprim im   on rs.kd_im=im.kd_im
 left join sprsk sk on rs.nm_sk=sk.nm_sk
 left join sprus us on rs.kd_p=us.kd_p
where (rs.kd_im=$kdim)
order by rs.dt_rs     ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taSER
//===============================================================================
function taSER($conn, $nmzpr, $nmzpo) {
$lg="";
//   
if ($nmzpo>0) {
   $sqlt = "
     select sr.*, op.dt_dk, op.kd_op, op.kd_dk, op.nm_sk, op.kd_ps,
       im.im_tb$lg  as  kdim
     from ms_ser sr
       left join sprim im on sr.kd_im=im.kd_im
       left join ms_opr op on sr.nm_zpo=op.nm_zpo  
     where (sr.nm_zpo=($nmzpo))
     order by sr.nm_ser  "; 
}
//
if ($nmzpr>0) {
   $sqlt = "
     select sr.*, op.dt_dk, op.kd_op, op.kd_dk, op.nm_sk, op.kd_ps,
       im.im_tb$lg  as  kdim
     from ms_ser sr
       left join sprim im on sr.kd_im=im.kd_im
       left join ms_opr op on sr.nm_zpo=op.nm_zpo  
     where (sr.nm_zpr=($nmzpr))
     order by sr.nm_ser  "; 
}
    $res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taSET
//===============================================================================
function taSET($conn, $sts, $frm, $kdp) {
$sqlt = "
select m.*
from sprset m
where  (m.st_s>=($sts)) and (m.st_fr=($frm))  and 
               (m.kd_p<>($kdp)) and ((m.kd_pf=0) or (m.kd_pf=($kdp)))
order by m.st_s  ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taSKL
//===============================================================================
function taSKL($conn, $lg, $nmsk) {
$sqlt = "
select m.* ,
 nm_zp     as  nmzpo,
 im.im_tb$lg as  kdim,
 ps.im_ps$lg as  kdps,
 kl.im_kl$lg as  kdkl,
 ns.im_sk$lg as  nmsk
from ms_skl m
 left join sprim im  on m.kd_im=im.kd_im
 left join sprps ps  on m.kd_ps=ps.kd_ps
 left join sprkl kl  on m.kd_kl=kl.kd_kl
 left join sprsk ns  on m.nm_sk=ns.nm_sk
where (m.nm_sk=$nmsk)  
order by kdim   ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taSKZ
//===============================================================================
function taSKZ($conn, $lg, $nmzak) {
$sqlt = "
select m.*,
  im.im_tb$lg   as  kdim,
  ps.im_ps$lg   as  kdps
from ms_skz m
  left join sprim im on m.kd_im=im.kd_im
  left join sprps ps on m.kd_ps=ps.kd_ps
where (m.nm_zak=($nmzak))
order by kdim ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  QSUM
//===============================================================================
function QSUM($conn, $nmzp) {
$lg='';
$sqlt = "
select su.*, 
 sm.im_sm$lg as imsm,
 sk.im_sk$lg as nmskz
from ms_sum su
  left join sprsm sm on su.kd_sm=sm.kd_sm
  left join sprsk sk on su.nm_skz=sk.nm_sk
where (su.nm_zp=($nmzp)) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taSUM
//===============================================================================
function taSUM($conn, $nmzp, $prsum, $kdus) {
$lg='';
$sqlt = "
select su.*, 
 sm.im_sm$lg as imsm,
 sk.im_sk$lg as nmskz
from ms_sum su
  left join sprsm sm on su.kd_sm=sm.kd_sm
  left join sprsk sk on su.nm_skz=sk.nm_sk
where (su.nm_zpd=($nmzp)) and (((pr_sum=($prsum)) and (($prsum)<2)) or (($prsum)>1)) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taSysPrn
//===============================================================================
function taSysPrn($conn, $lg) {
$sqlt = "
select pr.*,
 pr.im_prn$lg as imprn
from sysprn pr
where (st_prn=0 )
order by imprn  ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  TEKE
//===============================================================================
function TEKE($conn, $lg, $stev, $dtev) {
$sqlt = "
select m.*,
  im.im_tb$lg     as  kdim,
  ps.im_ps$lg     as  kdps,
  ch.im_ch$lg     as  prch,
  ks.im_op$lg     as  ksop,
  us.im_p$lg      as  impl,
  sm.im_sm$lg     as  kdsm
from sprev m
  left join sprim im  on m.kd_im=im.kd_im
  left join sprps ps  on m.kd_ps=ps.kd_ps
  left join sprsm sm  on m.kd_sm=sm.kd_sm
  left join sprchk ch on m.pr_ch=ch.pr_ch
  left join spropk ks on m.kd_opk=ks.kd_opk
  left join sprus us  on m.kd_p=us.kd_p
where (m.st_ev=($stev))  and ((m.dt_ev<=($dtev)) or m.pr_ev=1)
order by m.kd_ps,m.nm_zak      ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  USL
//===============================================================================
function USL($conn, $lg, $kdsm) {
$sqlt = "
select usl.*,
 usl.im_usl$lg as imusl
from sprusl usl
where usl.kd_sm=$kdsm         ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taZAK
//===============================================================================
function taZAK($conn, $lg, $stdk) {
$sqlt = "
select m.*, 
  ps.im_ps$lg as  kdps, 
  kl.im_kl$lg as  kdkl, 
  op.im_ps$lg as  oups
from  ms_zak m  
  left join sprps ps on m.kd_ps=ps.kd_ps
  left join sprps op on m.ou_ps=op.kd_ps
  left join sprkl kl on   m.kd_kl=kl.kd_kl
where ((m.st_zak='1')  or  (m.st_zak = $stdk ))
order by dt_dks        ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  taZAPP
//===============================================================================
function taZAPP($conn, $nmzak) {
$sqlt = "
select m.*
from  ms_zak m  
where (m.nm_zak=$nmzak) ";

$res = $conn->Execute($sqlt);
return $res;
}

//===============================================================================
//  ZPRS
//===============================================================================
function ZPRS($conn, $lg, $kdim, $kdps) {
$sqlt = "
select pr.*,
 im.im_tb$lg     as  kdim,
 sk.im_sk$lg     as  nmsk,
 ps.im_ps$lg     as  kdps,
 prs.im_prs$lg   as  imprs
from ms_prs pr
 left join sprsk sk on pr.nm_sk=sk.nm_sk
 left join sprim im on pr.kd_im=im.kd_im
 left join sprps ps on pr.kd_ps=ps.kd_ps
 left join sprprs prs on prs.kd_prs=pr.kd_prs
where (pr.kd_im=($kdim)) and (pr.kd_ps=($kdps))
order by kd_im               ";

$res = $conn->Execute($sqlt);
return $res;
}

//====================================================================
//  
//====================================================================
?>