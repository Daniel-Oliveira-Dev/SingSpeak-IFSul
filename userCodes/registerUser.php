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
        $erro = "Erro de cadastro! Este nome de usuário já está sendo utilizado!";
    } elseif (!$emailAvailable) {
        $erro = "Erro de cadastro! Este endereço de e-mail já está sendo utilizado!";
    }

    if (!$usernameAvailable || !$emailAvailable) {
        echo json_encode(['erro' => $erro]);
        exit();
    }
}

// Insere um novo usuário no banco com os parâmetros informados
function insertUser ($username, $email, $password) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("INSERT INTO usuario (username, email, senha) 
        VALUES (:username, :email, :senha)");

        $statement->bindParam(":username", $username);
        $statement->bindParam(":email", $email);
        $statement->bindParam(":senha", $password);

        $statement->execute();
    } catch (PDOException $err) {
        echo $err->getMessage();
    }
}

validateUser($username, $email);
insertUser($username, $email, $senha);
$tentativa = logIn($username, $senha);
$_SESSION['acessGranted'] = $tentativa;
echo json_encode(['sucesso' => "Sucesso!"]);
exit();

?>