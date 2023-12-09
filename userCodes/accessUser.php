<?php

session_start();

$username = $_POST['loginUsername'];
$senha = $_POST['loginPassword'];

unset($_POST);

function createSession($username) {
    if (isset($_SESSION['accessGranted'])) {
        throw new Exception("Não foi possível criar sua sessão pois já havia uma criada no servidor!");
    }
    $timeout = 60 * 30; // 60 segundos vezes a quantidade de minutos que quer durar a sessão
    $dateTime = new DateTime('now', new DateTimeZone('America/Sao_Paulo'));
    $dateTime->add(new DateInterval("PT" . $timeout . "S"));
    $_SESSION['expireAccess'] = $dateTime;
    $_SESSION['accessGranted'] = $username;
}

// Valida o acesso verificando o banco de dados
require "userArea.php";

try {
    // Tenta realizar o login no banco de dados
    $tentativa = logIn($username, $senha);
    // Gera o log de acesso do usuário
    logGenerator($username, "Login");
    // Inicia a sessão localmente
    createSession($tentativa);
    $_SESSION['amountLogins'] = countAccessInDay($username);
    if (countAccessInDay($username) == 1) {
        givePoints($username, 15);
    }
    echo json_encode(['sucesso' => "Sucesso!"]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>