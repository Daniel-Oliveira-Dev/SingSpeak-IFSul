<?php

session_start();

$username = $_SESSION['accessGranted'];
$confirmPassword = $_POST['confirmPassword'];

unset($_POST);

include "userArea.php";

if (logIn($username, $confirmPassword) === "Acesso negado!") {
    $erro = "Sua senha está incorreta!";
    echo json_encode(['erro' => $erro]);
    exit();
}

deactivateAccount($username);
unset($_SESSION['accessGranted']);
echo json_encode(['sucesso' => "Deu certo!"]);
exit();

?>