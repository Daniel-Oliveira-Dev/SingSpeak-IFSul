<?php
session_start();

$username = $_POST['signupUsername'];
$email = $_POST['signupEmail'];
$senha = $_POST['signupPassword'];

unset($_POST);

include "userArea.php";

try {
    // Valida o nome de usuário
    validateUsername($username);
    // Valida o endereço de email
    validateEmail($email);
    // Insere o usuário no banco de dados
    insertUser($username, $email, $senha);
    // Tenta realizar o login no banco de dados
    $tentativa = logIn($username, $senha);
    // Gera o log de acesso do usuário
    logGenerator($username, "Login");
    // Inicia a sessão localmente
    $_SESSION['accessGranted'] = $tentativa;
    echo json_encode(['sucesso' => "Sucesso!"]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>