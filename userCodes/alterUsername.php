<?php

session_start();

$oldUsername = $_SESSION['accessGranted'];
$oldPassword = $_POST['oldPassword'];
$newUsername = $_POST['newUsername'];

unset($_POST);

include "userArea.php";

try {
    // Valida a senha
    logIn($oldUsername, $oldPassword);
    // Valida o nome de usuário
    validateUsername($newUsername);
    // Altera o nome do usuário no banco de dados
    alterUsername($oldUsername, $newUsername);
    // Reconecta o usuário na sessão com o novo nome de usuário
    $_SESSION['accessGranted'] = $newUsername;
    echo json_encode(['sucesso' => "Sucesso!"]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>