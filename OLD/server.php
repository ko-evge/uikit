<?php
//==================================================================================================
// SERVER main program
// =================================================================================================
//include_once("lib/debug.php");

include_once("/var/www/mymss.com/jstcp.php");
include_once("/var/www/mymss.com/allsql.php");
include_once("opr_s.php");


error_reporting(E_ALL ^ E_DEPRECATED);
ini_set('display_errors',0);
ini_set("log_errors", 1);
ini_set("error_log", "/var/www/mymss.com/php-error.log");

date_default_timezone_set('America/Los_Angeles');

//=================================================================================================
// database connect
//=================================================================================================

$host = 'localhost';
$db   = 'msdata1';
$user = 'root';
$pass = 'pointer9';
$charset = 'utf8';

/** @var TYPE_NAME $event */

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$opt = array(
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
);
$conn = new PDO($dsn, $user, $pass, $opt);

// новый блок связи
//list($action,$args) = json_decode(file_get_contents('php://input'), true);
//function tc_return($data)
//{
//    header('Content-type: application/json');
    // send the result now
//    echo json_encode($data);
//}
//if ($action == 'test_action') {
//    tc_return($args['test_data'][0]+$args['test_data'][1]);
//}


//=================================================================================================
$rs = $conn->query( 'SELECT * FROM sprus');
//=================================================================================================

if (isset($event) and (isset($event['action']))) {
    $aa=$event['action'];
    if ($event['action'] == 'get_fields') {
        tc_return(get_fields($conn, $event['fl'], $event['nz']));
    }

    if ($event['action'] == 'test') {
        tc_return('test');
    }

    /**
     *   read record ser
     */
    if ($event['action'] == 'get_sernum') {
        tc_return(get_sernum($conn, $event['nmzpr'], $event['nmzpo'], $event['kdus']));
    }

    /**
     * delete record
     */
    if ($event['action'] == 'delete_record') {
        tc_return(delete_record($conn, $event['file'], $event['nmzp'], $event['kdus']));
    }

    /**
     * update record
     */
    if ($event['action'] == 'update_record') {
        tc_return(update_record($conn, $event['file'], $event['nmzp'], $event['record'], $event['kdus']));
    }

    /**
     * add record
     */
    if ($event['action'] == 'add_record') {
        tc_return(add_record($conn, $event['file'], $event['nmzpd'], $event['record'], $event['kdus']));
    }

    /**
     * add reserved
     */
    if ($event['action'] == 'add_reserv') {
        tc_return(add_reserv($conn, $event['nmzpd'], $event['nmzpr'], $event['kdus']));
    }

    /**
     * generate component
     */
    if ($event['action'] == 'gen_component') {
        tc_return(gen_component($conn, $event['nmzpd'], $event['kdus']));
    }

    /**
     * get cost
     */
    if ($event['action'] == 'get_cost') {
        tc_return(get_cost($conn, $event['kd_im'], $event['kd_st'], $event['nm_zpo'], $event['kdprs'],
            $event['kd_ps'], $event['pr_ch'], $event['nm_zps']));
    }

    /**
     * get fields new document
     */
    if ($event['action'] == 'get_ar_newdoc') {
        tc_return(ar_newdoc($event['tpop'], $event['kdop'], $event['imop'], $event['kdus']));
    }

    /**
     * get history
     */
    if ($event['action'] == 'get_history') tc_return(get_history($conn, $event['kod'], $event['kdim']));

    /**
     * delete document
     */
    if ($event['action'] == 'deldoc') {
        tc_return(deldoc($conn, $event['nrecord'], $event['kdus']));
    }

    /**
     * read product
     */
    if ($event['action'] == 'read_izd') {
        tc_return(read_izd($conn, $event['kdim']));
    }

    /**
     * read record DOC
     */
    if ($event['action'] == 'read_doc') {
        tc_return(read_doc($conn, $event['nmzpd'], $event['kdus']));
    }

    /**
     * read record OPR
     */
    if ($event['action'] == 'read_opr') {
        tc_return(read_opr($conn, $event['nmzp'], $event['kdus']));
    }

    /**
     * read ALLDOC
     */
    if ($event['action'] == 'get_alldoc') {
        tc_return(get_alldoc($conn, $event['kdus']));
    }

    /**
     * read document
     */
    if ($event['action'] == 'get_doc') {
        tc_return(get_doc($conn, $event['nmzp'], $event['kdop']));
    }

    /**
     * read product for document
     */
    if ($event['action'] == 'get_obp') {
        tc_return(get_obp($conn, $event['nmzpd'], $event['kdus']));
    }

    /**
     * read executors for document
     */
    if ($event['action'] == 'get_rab') {
        tc_return(get_rab($conn, $event['nmzpd'], $event['kdus']));
    }

    /**
     * read reservation for document
     */
    if ($event['action'] == 'get_reserv') {
        tc_return(get_reserv($conn, $event['nmzpd'], $event['kdus']));
    }

    /**
     * read EXPENSES for DOC
     */
    if ($event['action'] == 'get_sum') {
        tc_return(get_sum($conn, $event['nmzp'], $event['prsum'], $event['kdus']));
    }

    /**
     *print alldoc
     */
    if ($event['action'] == 'print_alldoc') {
      /*  tc_return(print_alldoc($conn)); */
    }

    /**
     * get price list
     */
    if ($event['action'] == 'get_price') {
        tc_return(get_price($conn, $event['kdps']));
    }

    /**
     * Add new doc
     */
    if ($event['action'] == 'add_newdoc') {
        tc_return(add_newdoc($conn, $event['fields'], $event['kdus']));
    }

    /**
     *  seek directory
     */
    if ($event['action'] == 'seek_spr') {
        if ($event['dir'] == 'spriz') {
            tc_return(seek_iz($conn, $event['seek']));
            exit;
        }
        if ($event['dir'] == 'ms_zak') {
            tc_return(seek_zak($conn, $event['seek']));
            exit;
        }
        tc_return(seek_spr($conn, $event['dir'], $event['seek'], $event['list'], $event['addsql']));
    }

    /**
     *  add directory
     */
    if ($event['action'] == 'add_spr') {
        tc_return(add_spr($conn, $event['dir'], $event['seek']));
    }

    /**
     *  seek warehouse
     */
    if ($event['action'] == 'seek_war') {
        tc_return(seek_war($conn, $event['nm_sk'], $event['imtb'], $event['nmzpo'],
            $event['ser'], $event['kdst'], $event['zak'], $event['kd_ps'], $event['dt_dk'],
            $event['kd_op'], $event['cnsk'], $event['nm_zp']));
    }

    /**
     * read SPRARM
     */
    if ($event['action'] == 'get_arm') {
        tc_return(sprarm($conn));
    }

    /**
     * read SPRCHK
     */
    if ($event['action'] == 'sprchk') {
        tc_return(sprchk($conn, $event['prch']));
    }

    /**
    * read SPRUS
    */
    if ($event['action'] == 'get_us') {
        tc_return(sprus($conn, $event['user'], $event['pass']));
    }
}


//$conn->null;
//=============================================================================
//=================================================================