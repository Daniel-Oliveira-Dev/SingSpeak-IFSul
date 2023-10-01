<?php
session_start();

$username = $_POST['signupUsername'];
$email = $_POST['signupEmail'];
$senha = $_POST['signupPassword'];

unset($_POST);

include "userArea.php";

function validateUser($username, $email) {
    $usernameAvailable = validateUsername($username);
    $emailAvailable = validateEmail($email);

    if (!$usernameAvailable) {
        $erro = "Erro de cadastro! Este nome de usuário não está disponível!";
    } elseif (!$emailAvailable) {
        $erro = "Erro de cadastro! Este endereço de e-mail não está disponível!";
    }

    if (!$usernameAvailable || !$emailAvailable) {
        echo json_encode(['erro' => $erro]);
        exit();
    }
}

validateUser($username, $email);
insertUser($username, $email, $senha);
$tentativa = logIn($username, $senha);
logGenerator($username, "Login");
$_SESSION['accessGranted'] = $tentativa;
echo json_encode(['sucesso' => "Sucesso!"]);
exit();

?>