<?php
$url = 'https://mail.google.com/mail/u/0/#inbox';
$html = file_get_contents($url);
echo $html;
?>
