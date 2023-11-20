<?php

// Lista as músicas na página inicial
function listAllMusics() {
    include "../database-control/connection.php";
    try {
        $statement = $conexao->prepare("SELECT m.idMusica, m.nome, m.artista, m.idNivel, n.nomenclatura 
        FROM musica m JOIN nivel n ON m.idNivel = n.idNivel ORDER BY m.idNivel ASC, m.nome ASC");
        $statement->execute();

        $retorno = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $retorno;

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Retorna a música em um array baseado no nome da música
function assembleMusic($idMusica) {
    include "../database-control/connection.php";
    try {
        $statement = $conexao->prepare("SELECT * FROM musica WHERE idMusica = :idMusica");

        $statement->bindParam(":idMusica", $idMusica);
        $statement->execute();

        $retorno = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $retorno[0];

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Retorna um array com as 10 maiores pontuações em uma música
function getMusicRanking($idMusica) {
    include "../database-control/connection.php";
    try {
        $statement = $conexao->prepare("SELECT g.pontuacaoAdquirida, u.username FROM usuariogravamusica g
        JOIN usuario u ON u.idUsuario = g.idUsuario WHERE g.idMusica = :idMusica
        ORDER BY pontuacaoAdquirida DESC, g.dataGravacao ASC LIMIT 10");

        $statement->bindParam(":idMusica", $idMusica);
        $statement->execute();

        $retorno = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $retorno;

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Retorna a maior pontuação do usuário na música informada
function getUserHighestScore($username, $idMusica) {
    include "../database-control/connection.php";
    try {
        $statement = $conexao->prepare("SELECT g.pontuacaoAdquirida FROM usuariogravamusica g
        JOIN usuario u ON u.idUsuario = g.idUsuario
        WHERE g.idMusica = :idMusica AND u.username = :username
        ORDER BY pontuacaoAdquirida DESC LIMIT 1;");

        $statement->bindParam(":idMusica", $idMusica);
        $statement->bindParam(":username", $username);
        $statement->execute();

        $retorno = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $retorno;

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Cria um log para o acesso de um usuário em uma música
function accessMusicLog($username, $idMusica) {
    include "../database-control/connection.php";
    try {
        $statement = $conexao->prepare("INSERT INTO usuarioAcessaMusica (idUsuario, idMusica) VALUES
        ((SELECT idUsuario FROM usuario WHERE username LIKE :username), :idMusica)");
        $statement->bindParam(":username", $username);
        $statement->bindParam(":idMusica", $idMusica);
        $statement->execute();

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

?>