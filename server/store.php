<?php

const FILE_PATH = __DIR__.'/images/';
echo FILE_PATH;

if($_SERVER["REQUEST_METHOD"] == "POST")
{
    // Check if file was uploaded without errors
    if($_POST['image']){
         base64ToImage($_POST['image']);
         echo json_encode(['message' => 'Success','status' => 200]);
    }
    else
    {
        echo json_encode(['message' => 'Invalid key!','status' => 415]);
    } 
}



function base64ToImage($imageData){
    list($type, $imageData) = explode(';', $imageData);
    list(,$extension) = explode('/',$type);
    list(,$imageData) = explode(',', $imageData);
    $fileName = FILE_PATH.uniqid().'.'.$extension;
    $imageData = base64_decode($imageData);
    file_put_contents($fileName, $imageData);
    return $fileName;
}
?>