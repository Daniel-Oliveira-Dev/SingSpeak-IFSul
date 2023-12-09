<?php

session_start();

if (!isset($_SESSION['accessOfDay'])) {
    $_SESSION['accessOfDay'] = 0;
}

include_once "userArea.php";

$user = $_SESSION['accessGranted'];

try {
    $userArray = getUserLevel($user);
    $newLevel = verifyLevelUpCondition($user);
    if ($newLevel) {
        levelUp($user);
    }
    echo json_encode(['userArray' => $userArray, 'accessOfDay' => $_SESSION['amountLogins'], 'levelUp' => $newLevel]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>