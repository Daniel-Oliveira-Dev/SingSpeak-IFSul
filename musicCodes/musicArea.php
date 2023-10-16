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

?>