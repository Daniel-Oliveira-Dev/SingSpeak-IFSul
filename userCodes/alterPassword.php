<?php

session_start();

$username = $_SESSION['accessGranted'];
$oldPassword = $_POST['oldPassword'];
$newPassword = $_POST['newPassword'];

unset($_POST);

include "userArea.php";

if (logIn($username, $oldPassword) === "Acesso negado!") {
    $erro = "Sua senha atual está incorreta!";
    echo json_encode(['erro' => $erro]);
    exit();
}

if ($newPassword === $oldPassword) {
    $erro = "Sua nova senha precisa ser diferente da atual!";
    echo json_encode(['erro' => $erro]);
    exit();
}

alterPassword($username, $newPassword);
unset($_SESSION['accessGranted']);
echo json_encode(['sucesso' => "Deu certo!"]);
exit();

?>