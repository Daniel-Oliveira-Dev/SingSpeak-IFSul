<?php
session_start();

$username = $_POST['loginUsername'];
$senha = $_POST['loginPassword'];

unset($_POST);

// Valida o acesso verificando o banco de dados
require "userArea.php";

// Verifica se o acesso foi possível de se realizar. Se não for, encerra o código #PRECISA COMPLEMENTAR
$tentativa = logIn($username, $senha);

if ($tentativa == "Acesso negado!") {
    $erro = "Erro de acesso! Seu nome de usuário ou senha estão incorretos!";
    echo json_encode(['erro' => $erro]);
    exit();
}

// Se o acesso validar, ele salva o usuário na sessão
logGenerator($username, "Login");
$_SESSION['accessGranted'] = $tentativa;
echo json_encode(['sucesso' => "Sucesso!"]);
exit();
?>