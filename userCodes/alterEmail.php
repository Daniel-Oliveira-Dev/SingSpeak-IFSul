<?php

session_start();

$username = $_SESSION['accessGranted'];
$oldPassword = $_POST['oldPassword'];
$newEmail = $_POST['newEmail'];

unset($_POST);

include "userArea.php";

try {
    // Valida a senha
    logIn($username, $oldPassword);
    // Valida o endereço de email
    validateEmail($newEmail);
    // Altera o email do usuário no banco de dados
    alterEmail($username, $newEmail);
    echo json_encode(['sucesso' => "Sucesso!"]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>