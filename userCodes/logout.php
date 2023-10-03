<?php

session_start();

include_once "userArea.php";

try {
    // Gera o log de desconexão do usuário
    logGenerator($_SESSION["accessGranted"], "Logout");
    // Encerra a sessão do usuário
    unset($_SESSION['accessGranted']);
    echo json_encode(['sucesso' => "Sucesso!"]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>