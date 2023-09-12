<?php

// Gera o Log do usuário ao acessar ou deixar o sistema
function logGenerator($username, $action) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("INSERT INTO logControl (tipoRegistro, idUsuario) 
        VALUES (:tipoRegistro, (SELECT idUsuario FROM usuario WHERE username LIKE :username))");

        $statement->bindParam(":username", $username);
        $statement->bindParam(":tipoRegistro", $action);

        $statement->execute();
    } catch (PDOException $err) {
        echo $err->getMessage();
    }
}

// Verifica se o usuário existe no sistema e retorna o username se for verdadeiro
function logIn($username, $senha) {
    include("../connection.php");
    try {
        $statement = $conexao->prepare("SELECT username FROM usuario WHERE username = :username AND senha = :senha");

        $statement->bindParam(":username", $username);
        $statement->bindParam(":senha", $senha);

        $statement->execute();

        if ($statement->rowCount() == 0) {
            return "Acesso negado!";
        }

        $resultado = $statement->fetchAll(PDO::FETCH_ASSOC);

        $user = $resultado[0]['username'];

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

// Cria um array com as informações públicas do usuário
function assembleUser($username) {
    include("../connection.php");
    try {
        $statement = $conexao->prepare("SELECT username, email, dataCriacao, pontos, idNivel 
        FROM usuario WHERE username = :username");

        $statement->bindParam(":username", $username);

        $statement->execute();

        $resultado = $statement->fetchAll(PDO::FETCH_ASSOC);

        $user = array(
            $resultado[0]['username'],
            $resultado[0]['email'],
            $resultado[0]['dataCriacao'],
            $resultado[0]['pontos'],
            $resultado[0]['idNivel']
        );

        return $user;

    } catch (PDOException $err) {
        echo $err->getMessage();
    }
}

?>