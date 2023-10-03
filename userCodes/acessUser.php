<?php
session_start();

$username = $_POST['loginUsername'];
$senha = $_POST['loginPassword'];

unset($_POST);

// Valida o acesso verificando o banco de dados
require "userArea.php";

try {
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