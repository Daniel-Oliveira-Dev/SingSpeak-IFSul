<?php

session_start();

$oldUsername = $_SESSION['accessGranted'];
$oldPassword = $_POST['oldPassword'];
$newUsername = $_POST['newUsername'];
$newUsernameConfirm = $_POST['newUsernameConfirm'];

unset($_POST);

include "userArea.php";

if (logIn($oldUsername, $oldPassword) === "Acesso negado!") {
    $erro = "Sua senha está incorreta!";
    echo json_encode(['erro' => $erro]);
    exit();
}

if (!validateUsername($newUsername)) {
    $erro = "Este nome de usuário não está disponível!";
    echo json_encode(['erro' => $erro]);
    exit();
}

if ($newUsername != $newUsernameConfirm) {
    $erro = "Os nomes de usuário não são iguais!";
    echo json_encode(['erro' => $erro]);
    exit();
}

$_SESSION['accessGranted'] = $newUsername;
alterUsername($oldUsername, $newUsername);
echo json_encode(['sucesso' => "Deu certo!"]);
exit();

?>