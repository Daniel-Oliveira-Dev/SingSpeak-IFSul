<?php

// Seleciona as informações do usuário e armazena na classe Usuário
function logIn($username, $senha) {
    include("../connection.php");
    require_once("usuario.php");
    try {
        $statement = $conexao->prepare("SELECT * FROM usuario WHERE username = :username AND senha = :senha");

        $statement->bindParam(":username", $username);
        $statement->bindParam(":senha", $senha);

        $statement->execute();

        if ($statement->rowCount() == 0) {
            return "Acesso negado!";
        }

        $resultado = $statement->fetchAll(PDO::FETCH_ASSOC);

        $user = new Usuario(
            $resultado[0]['idUsuario'], 
            $resultado[0]['username'],
            $resultado[0]['email'],
            $resultado[0]['senha'],
            $resultado[0]['dataCriacao'],
            $resultado[0]['pontos'],
            $resultado[0]['idNivel']
        );

        return $user;

    } catch (PDOException $err) {
        echo $err->getMessage();
    }
}

// Valida a disponibilidade de um nome de usuário - Retorn "true" se o username estiver liberado
function validateUsername($username) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("SELECT username FROM usuario WHERE username = :username");
        $statement->bindParam(":username", $username);
        $statement->execute();

        return ($statement->rowCount() == 0);

    } catch (PDOException $err) {
        echo $err->getMessage();
        return false;
    }
    
}

// Valida a disponibilidade de um endereço de email - Retorna "true" se o email estiver liberado
function validateEmail($email) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("SELECT email FROM usuario WHERE email = :email");
        $statement->bindParam(":email", $email);
        $statement->execute();

        return ($statement->rowCount() == 0);

    } catch (PDOException $err) {
        echo $err->getMessage();
        return false;
    }
}

?>