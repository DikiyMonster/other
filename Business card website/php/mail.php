<?php

$message = '';
$message .= '<h1>Сообщение от Белфорт</h1>';
$message .= '<p><b>Кому: '.$_POST['author'].'</b></p>';
$message .= '<p><b>Куда: '.$_POST['email'].'</b></p>';
$message .= '<p><b>Сообщение: '.$_POST['text'].'</b></p>';

// print_r($message);

$to = 'averyanov@gmail.com'.',';
$to .= $_POST['email'];
$spectext = '<!DOCTYPE html><html lang="ru"<title>Сообщение от Белфорт</title></head><body>';
$headers = 'MIME-Version: 1.0'."\r\n";
$headers .= 'Content-type: text/html; charset=utf-8'."\r\n";

$m = mail($to, 'Сообщение от Белфорт', $spectext.$message.'</body></html>', $headers);

if($m) {echo "Сообщение отправлено!";} else {echo "Сообщение не отправилось :(";}