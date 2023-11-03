<?php 

$idMusica = $_POST['idMusica'];

unset($_POST);

include_once("musicArea.php");

try {
    $musicArray = assembleMusic($idMusica);
    echo json_encode(['musicArray' => $musicArray]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e]);
    exit();
}

?>