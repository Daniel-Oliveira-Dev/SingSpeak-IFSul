<?php
session_start();

if (isset($_SESSION['accessGranted'])) {
    $usuario = $_SESSION['accessGranted'];
    echo json_encode(['user' => $usuario]);
    echo 'Sessão ativa';
    exit();
} else {
    echo 'Sessão não encontrada';
    exit();
}
?>