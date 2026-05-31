<?php

$connection = @mysql_connect('localhost', 'user', 'password');
@mysql_select_db('database', $connection);
$query = 'SELECT * FROM myTable LIMIT 0,10';
$dataset = @mysql_query($query, $connection);


// print MySQL query results as 2D javascript array
function aw_cells($dataset){

    $rows = array();
    while ($record = @mysql_fetch_row($dataset)) {
    $cols = array();
    foreach ($record as $value) {
        $cols[] = '"'.addslashes($value).'"';
    }
    $rows[] = "\t[".implode(",", $cols)."]";
    }
    echo "[\n".implode(",\n",$rows)."\n];\n";
}

// print MySQL field names as javascript array
function aw_headers($dataset){
    while ($field = @mysql_fetch_field($dataset)) {
    $cols[] = '"'.$field->name.'"';
    }
    echo "[".implode(",",$cols)."];\n";
}

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
	<title>ActiveWidgets Examples</title>

<!-- fix box model in firefox/safari/opera -->
<style type="text/css">
	.aw-quirks * {
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
</style>

<!-- include links to the script and stylesheet files -->
	<script src="../../runtime/lib/aw.js" type="text/javascript"></script>
	<link href="../../runtime/styles/system/aw.css" rel="stylesheet">

</head>
<body>
<script type="text/javascript">

//    insert javascript arrays produced by PHP functions
    var myHeaders = <?= aw_headers($dataset) ?>
    var myCells = <?= aw_cells($dataset) ?>

//    create grid control
    var obj = new AW.UI.Grid;

//    set grid text
    obj.setHeaderText(myHeaders);
    obj.setCellText(myCells);

//    set number of columns/rows
    obj.setColumnCount(myHeaders.length);
    obj.setRowCount(myCells.length);

//    write grid to the page
    document.write(obj);

</script>
</body>
</html>