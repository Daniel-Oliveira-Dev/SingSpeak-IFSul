<?php

session_start();

$username = $_SESSION['accessGranted'];
$confirmPassword = $_POST['confirmPassword'];

unset($_POST);

include "userArea.php";

try {
    // Valida a senha
    logIn($username, $confirmPassword);
    // Desativa o usuário no banco de dados
    deactivateAccount($username);
    // Desconecta o usuário da sessão
    unset($_SESSION['accessGranted']);
    echo json_encode(['sucesso' => "Deu certo!"]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>