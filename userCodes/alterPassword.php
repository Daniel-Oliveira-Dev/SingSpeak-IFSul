<?php

session_start();

$username = $_SESSION['accessGranted'];
$oldPassword = $_POST['oldPassword'];
$newPassword = $_POST['newPassword'];

unset($_POST);

include "userArea.php";

try {
    // Valida a senha
    logIn($username, $oldPassword)
    // Altera a senha do usuário no banco de dados
    alterPassword($username, $newPassword);
    // Desconecta o usuário da sessão
    unset($_SESSION['accessGranted']);
    echo json_encode(['sucesso' => "Sucesso!"]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>