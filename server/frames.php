<?php
$path = str_replace('/server','',__DIR__);
$path .= '/frames';
$files = scandir($path);
$files = array_diff(scandir($path), array('.', '..'));
$frames = '';
foreach($files as $file){
    $url = "frames/$file";
  $frames.= "<img src='$url' onclick=setFrame('$url') class='frames'>";
}

echo json_encode(['status' => 200, 'frames' => $frames]);