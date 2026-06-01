<?php
$file_array=file("/var/www/mymss.com/AllDoc1.html");

$fp = @fopen("/var/www/mymss.com/AllDoc1.html", "r");
if ($fp) {
    while (($buffer = fgets($fp, 4096)) !== false) {
        echo $buffer;
    }
    if (!feof($fp)) {
        echo "Ошибка: fgets() неожиданно потерпел неудачу\n";
    }
    fclose($fp);
}
?>