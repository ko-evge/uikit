<?php
global $event;

function tc_header($type,$value=array())
{
    static $packet_id;

    if (!isset($packet_id))
    {
        $packet_id="{".substr(chunk_split(strtoupper(md5(uniqid($type))),8,'-'),0,-1)."}";
        header("Content-type: text/plain; charset=utf-8");
        //header('Content-type: text/JSTCP');
        header('JSTCP_PACKET: '.$packet_id);

    }
    else
    {
        echo $packet_id;
    }
    $value['type']=$type;
    echo tc_serialize($value);
    echo $packet_id;
    flush();


}

function tc_serialize($something)
{
    if (is_null($something)) return 'null';
    elseif (is_numeric($something))
    {
        return $something;
    }
    elseif(is_string($something))
    {
        return '"'.str_replace(array("\\",'"',"\n","\t","\r"),array('\\\\','\"'),$something).'"';
    }
    elseif (is_array($something))
    {
        if (!count($something)) return "[]";
        $arrayed=array();
        foreach ($something as $key => $value) {
            if(is_array($arrayed)&&is_numeric($key))
            {
             $arrayed[$key]=tc_serialize($value);
            } else $arrayed=false;
            
            $values[]=$key.':'.tc_serialize($value);
        }
        
        
        
        if (is_array($arrayed)) return '['.implode(',',$arrayed).']';    
        else return '{'.implode(',',$values).'}';
    }
    elseif (is_bool($something))
    {
        return ($something)?'true':'false';
    }
    else {
        return 'ACHTUNG! undefined';
    }
}

function tc_write($target,$value='',$mode='w')
{

    tc_header('write',array('target'=>$target, 'mode'=>$mode));
    echo $value;
}
function tc_set($data)
{
    tc_header('set');
    echo tc_serialize($data);
}
function tc_eval($data)
{
    tc_header('eval');
    echo str_replace(array("\n"),'',$data);
}
function tc_return($data)
{
    tc_header('return');
    echo tc_serialize($data);
}


function tc_get(&$data)
{
//    return false;
    global $event;
    if (isset($event['get']))
    {

        $data=$event['get'];
        return true;
    }
    else
    {
        tc_header('get',array('event'=>$event));
        echo tc_serialize($data);
        return false;
    }
}


/*if(isset($_SERVER['HTTP_JSTCP_PACKET'])&&isset($HTTP_RAW_POST_DATA))
{
    if (strtoupper($_SERVER['HTTP_JSTCP_PACKET'])=='EVENT'
    ||strtoupper($_SERVER['HTTP_JSTCP_PACKET'])=='RETURN')
    {
        $event=unserialize($HTTP_RAW_POST_DATA);
    }
}
 */
$event=unserialize(file_get_contents("php://input"));
$event['alive']='yes';

/* phpinfo();
if(isset($_SERVER['HTTP_JSTCP_PACKET']))
{
        if (strtoupper($_SERVER['HTTP_JSTCP_PACKET'])=='EVENT'||strtoupper($_SERVER['HTTP_JSTCP_PACKET'])=='COMPOSITE')
*/