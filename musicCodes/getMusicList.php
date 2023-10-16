<?php

include_once "musicArea.php";

try {
    // Puxa os dados públicos do usuário
    $musicArray = listAllMusics();
    echo json_encode(['musicArray' => $musicArray]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>