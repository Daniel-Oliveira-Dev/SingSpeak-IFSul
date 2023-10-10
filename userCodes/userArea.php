<?php

// Adiciona os pontos ao usuário
function givePoints($username, $addPontos) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("UPDATE usuario SET pontos = (pontos + :points) WHERE username = :username");

        $statement->bindParam(":username", $username);
        $statement->bindParam(":points", $addPontos);

        $statement->execute();
        
    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Verifica se o usuário terá o bônus diário
function checkFirstOfDay($username) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("SELECT dataRegistro FROM logControl 
        WHERE idUsuario = (SELECT idUsuario FROM usuario WHERE username LIKE :username) 
        AND DATE(dataRegistro) = DATE(CURRENT_DATE()) AND tipoRegistro = 'Login'");

        $statement->bindParam(":username", $username);

        $statement->execute();

        if ($statement->rowCount() == 0) {
            givePoints($username, 15);
        }
        
    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Gera o log de saída ou de entrada do usuário
function logGenerator($username, $action) {
    include "../connection.php";
    try {
        checkFirstOfDay($username);

        $statement = $conexao->prepare("INSERT INTO logControl (tipoRegistro, idUsuario) 
        VALUES (:tipoRegistro, (SELECT idUsuario FROM usuario WHERE username LIKE :username))");

        $statement->bindParam(":username", $username);
        $statement->bindParam(":tipoRegistro", $action);

        $statement->execute();
        
    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Realiza uma tentativa de login no sistema
function logIn($username, $senha) {
    include("../connection.php");
    try {
        $statement = $conexao->prepare("SELECT username, hash_senha, salt FROM usuario WHERE username = :username AND desativada = 'N'");

        $statement->bindParam(":username", $username);

        $statement->execute();

        if ($statement->rowCount() == 0) {
            throw new Exception("Erro de acesso! Esta conta não existe ou foi desativada!");
        }

        $resultado = $statement->fetchAll(PDO::FETCH_ASSOC);

        $salt = $resultado[0]['salt'];
        $senhaInformadaHash = hash('sha256', $senha . $salt);

        if ($senhaInformadaHash != $resultado[0]['hash_senha']) {
            throw new Exception("Erro de acesso! Seus dados estão incorretos!");
        }

        $user = $resultado[0]['username'];

        return $user;

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Verifica se um nome de usuário é válido no sistema
function validateUsername($username) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("SELECT username FROM usuario WHERE username = :username");
        $statement->bindParam(":username", $username);
        $statement->execute();

        if ($statement->rowCount() > 0) {
            throw new Exception("Erro de cadastro! Este nome de usuário não está disponível!");
        }

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Verifica se um endereço de email é válido no sistema
function validateEmail($email) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("SELECT email FROM usuario WHERE email = :email");
        $statement->bindParam(":email", $email);
        $statement->execute();

        if ($statement->rowCount() != 0) {
            throw new Exception("Erro de cadastro! Este endereço de email não está disponível!");
        }

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Insere um usuário no banco de dados
function insertUser($username, $email, $password) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("INSERT INTO usuario (username, email, hash_senha, salt) 
        VALUES (:username, :email, :hash_senha, :salt)");

        $salt = bin2hex(random_bytes(25));
        $hash_senha = hash('sha256', $password . $salt);

        $statement->bindParam(":username", $username);
        $statement->bindParam(":email", $email);
        $statement->bindParam(":hash_senha", $hash_senha);
        $statement->bindParam(":salt", $salt);

        $statement->execute();
    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Altera o nome de usuário de um usuário no banco de dados
function alterUsername($oldUsername, $newUsername) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("UPDATE usuario SET username = :newuser WHERE username = :olduser");

        $statement->bindParam(":olduser", $oldUsername);
        $statement->bindParam(":newuser", $newUsername);

        $statement->execute();
    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Altera o endereço de email de um usuário no banco de dados
function alterEmail($username, $newEmail) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("UPDATE usuario SET email = :newemail WHERE username = :user");

        $statement->bindParam(":user", $username);
        $statement->bindParam(":newemail", $newEmail);

        $statement->execute();
    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Altera a senha de um usuário no banco de dados
function alterPassword($username, $newPassword) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("UPDATE usuario SET hash_senha = :newpassword, salt = :salting WHERE username = :user");

        $salt = bin2hex(random_bytes(25));
        $hash_senha = hash('sha256', $newPassword . $salt);

        $statement->bindParam(":user", $username);
        $statement->bindParam(":salting", $salt);
        $statement->bindParam(":newpassword", $hash_senha);

        $statement->execute();
    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Muda a variável "Desativada" do usuário para "S" no banco de dados
function deactivateAccount($username) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("UPDATE usuario SET desativada = 'S' WHERE username = :username");

        $statement->bindParam(":username", $username);

        $statement->execute();

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Junta as informações públicas do usuário para montar seu perfil
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
            $resultado[0]['idNivel'],
            userRankPlacement($username)
        );

        return $user;

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Retorna a colocação do usuário no ranking geral de pontos do sistema
function userRankPlacement($username) {
    include("../connection.php");
    try {
        $statement = $conexao->prepare("SELECT COUNT(*) AS posicao FROM usuario WHERE pontos > (
            SELECT pontos FROM usuario WHERE username = :username
        ) ORDER BY idUsuario ASC");

        $statement->bindParam(":username", $username);

        $statement->execute();

        $resultado = $statement->fetchAll(PDO::FETCH_ASSOC);

        $position = $resultado[0]['posicao'] + 1;

        return $position;

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

?>