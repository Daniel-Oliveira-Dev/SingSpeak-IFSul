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

// Valida a disponibilidade de um nome de usuário
function validateUsername($username) {
    include "../connection.php";
    $usuarios = [];
    try {
        $statement = $conexao->prepare("SELECT * FROM usuario WHERE username LIKE :username");
        $statement->bindParam(":username", $username);
        $statement->execute();
        $resultado = $statement->fetchAll(PDO::FETCH_ASSOC);

        foreach($resultado as $row) {
            $usuarios[] = $row;
        }
        
        return ($usuarios[0]['username'] == null);

    } catch (PDOException $err) {
        echo $err->getMessage();
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