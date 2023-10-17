<?php

// Lista as músicas na página inicial
function listAllMusics() {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("SELECT nome, artista, idNivel, musicCover 
        FROM musica ORDER BY idNivel ASC, nome ASC");
        $statement->execute();

        $retorno = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $retorno;

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

// Retorna a música em um array baseado no nome da música
function assembleMusic($nomeMusica) {
    include "../connection.php";
    try {
        $statement = $conexao->prepare("SELECT * FROM musica WHERE nome = :nomeMusica");

        $statement->bindParam(":nomeMusica", $nomeMusica);
        $statement->execute();

        $retorno = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $retorno[0];

    } catch (PDOException $err) {
        throw new Exception("Erro na execução da query: " . $err->getMessage());
    }
}

?>