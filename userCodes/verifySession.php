<?php
session_start();

if (isset($_SESSION['acessGranted'])) {
    $usuarioArray = $_SESSION['acessGranted'];
    echo json_encode(['user' => $usuarioArray]);
    exit();
} else {
    echo 'Sessão não encontrada';
    exit();
}
?>