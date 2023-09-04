<?php

// Lista todas as informações de todos os usuários do banco
function listAllUsers() {
    include "../connection.php";
    $usuarios = [];
    try {
        $statement = $conexao->prepare("SELECT * FROM usuario");
        $statement->execute();
        $resultado = $statement->fetchAll(PDO::FETCH_ASSOC);

        foreach($resultado as $row) {
            $usuarios[] = $row;
        }
        
        return $usuarios;

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

?>