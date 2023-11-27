<?php

session_start();

function verifyExpireDate() {
    if (!isset($_SESSION["accessGranted"])) {
        throw new Exception ("Uma sessão de usuário ativa não foi encontrada!");
    }
    if (!isset($_SESSION["expireAccess"])) {
        destroySession();
        throw new Exception ("Uma variável de sessão importante não foi encontrada!");
    }
    if (new DateTime() >= ($_SESSION['expireAccess'])) {
        destroySession();
        throw new Exception ("Sua sessão exprirou!");
    }
    $timeout = 60 * 30; // 30 minutos em segundos

    // Adiciona 30 minutos à hora de expiração
    $newExpireAccess = (new DateTime('now', new DateTimeZone('America/Sao_Paulo')))->add(new DateInterval("PT" . $timeout . "S"));

    // Verifica se a nova hora de expiração é válida
    if ($newExpireAccess <= new DateTime()) {
        throw new Exception("Erro ao calcular a nova hora de expiração.");
    }

    $_SESSION['expireAccess'] = $newExpireAccess;
}

function destroySession() {
    unset($_SESSION["accessGranted"]);
    unset($_SESSION["expireAccess"]);
    unset($_SESSION["lastAccessUpdate"]);
    session_destroy();
}

try {
    verifyExpireDate();
    echo json_encode(['user' => $_SESSION['accessGranted'], 'expire' => $_SESSION['expireAccess']]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>