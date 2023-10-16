<?php

session_start();

include_once "userArea.php";

try {
    $userArray = getUserLevel($_SESSION['accessGranted']);
    echo json_encode(['userArray' => $userArray]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>