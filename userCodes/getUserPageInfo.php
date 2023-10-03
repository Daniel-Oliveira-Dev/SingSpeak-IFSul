<?php

session_start();

include_once "userArea.php";

try {
    // Puxa os dados públicos do usuário
    $userArray = assembleUser($_SESSION['accessGranted']);
    echo json_encode(['userArray' => $userArray]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>