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
        throw new Exception("Erro ao tentar listar todas as músicas do sistema!");
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
        throw new Exception("Erro ao tentar montar as informações da música!");
    }
}

// Retorna um array com as 10 maiores pontuações em uma música
function getMusicRanking($idMusica) {
    include "../database-control/connection.php";
    try {
        $statement = $conexao->prepare("SELECT g.pontuacaoAdquirida, u.username FROM usuariogravamusica g
        JOIN usuario u ON u.idUsuario = g.idUsuario WHERE g.idMusica = :idMusica AND g.pontuacaoAdquirida > 0
        ORDER BY pontuacaoAdquirida DESC, g.dataGravacao ASC LIMIT 10");

        $statement->bindParam(":idMusica", $idMusica);
        $statement->execute();

        $retorno = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $retorno;

    } catch (PDOException $err) {
        throw new Exception("Erro ao tentar gerar o ranking da música!");
    }
}

// Retorna a maior pontuação do usuário na música informada
function getUserHighestScore($username, $idMusica) {
    include "../database-control/connection.php";
    try {
        $statement = $conexao->prepare("SELECT g.pontuacaoAdquirida FROM usuariogravamusica g
        JOIN usuario u ON u.idUsuario = g.idUsuario
        WHERE g.idMusica = :idMusica AND u.username = :username AND g.pontuacaoAdquirida > 0
        ORDER BY pontuacaoAdquirida DESC LIMIT 1;");

        $statement->bindParam(":idMusica", $idMusica);
        $statement->bindParam(":username", $username);
        $statement->execute();

        $retorno = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $retorno;

    } catch (PDOException $err) {
        throw new Exception("Erro ao tentar recuperar a maior pontuação do usuário na música!");
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
        throw new Exception("Erro ao tentar gerar um log de acesso à música!");
    }
}

// Retorna o nível da música
function getMusicLevel($idMusica) {
    include "../database-control/connection.php";
    try {
        $statement = $conexao->prepare("SELECT idNivel FROM musica WHERE idMusica = :idMusica");

        $statement->bindParam(":idMusica", $idMusica);
        $statement->execute();

        $retorno = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $retorno[0]['idNivel'];

    } catch (PDOException $err) {
        throw new Exception("Erro ao tentar recuperar o nível da música!");
    }
}

// Salva o log de uma gravação de música e os pontos equivalentes
function saveUserRecordingData($idMusica, $username, $points) {
    include "../database-control/connection.php";
    try {
        $statement = $conexao->prepare("INSERT INTO usuarioGravaMusica (pontuacaoAdquirida, idUsuario, idMusica) 
        VALUES (:points, (SELECT idUsuario FROM usuario WHERE username LIKE :username), :idMusica)");

        $statement->bindParam(":idMusica", $idMusica);
        $statement->bindParam(":username", $username);
        $statement->bindParam(":points", $points);
        $statement->execute();

    } catch (PDOException $err) {
        throw new Exception("Erro ao tentar gerar o log de gravação da música!");
    }
}

?>