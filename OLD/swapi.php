<?php

list($action,$args) = json_decode(file_get_contents('php://input'), true);

function tc_return($data)
{
    header('Content-type: application/json');
    // send the result now
    echo json_encode($data);
}

if ($action == 'test_action') {
    tc_return($args['test_data'][0]+$args['test_data'][1]);
}

?>