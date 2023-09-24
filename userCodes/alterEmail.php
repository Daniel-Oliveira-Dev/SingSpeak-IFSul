<?php

session_start();

$username = $_SESSION['accessGranted'];
$oldPassword = $_POST['oldPassword'];
$newEmail = $_POST['newEmail'];
$newEmailConfirm = $_POST['newEmailConfirm'];

unset($_POST);

include "userArea.php";

if (logIn($username, $oldPassword) === "Acesso negado!") {
    $erro = "Sua senha está incorreta!";
    echo json_encode(['erro' => $erro]);
    exit();
}

if (!validateEmail($newEmail)) {
    $erro = "Este endereço de email não está disponível!";
    echo json_encode(['erro' => $erro]);
    exit();
}

if ($newEmail != $newEmailConfirm) {
    $erro = "Os endereços de email não são iguais!";
    echo json_encode(['erro' => $erro]);
    exit();
}

alterEmail($username, $newEmail);
echo json_encode(['sucesso' => "Deu certo!"]);
exit();

?>