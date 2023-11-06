<?php

session_start();

$idMusica = $_SESSION['loadedMusic'];

include_once("musicArea.php");

try {
    $rankArray = getMusicRanking($idMusica);
    echo json_encode(['rankArray' => $rankArray]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e]);
    exit();
}

?>