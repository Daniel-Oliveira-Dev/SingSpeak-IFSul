<?php

session_start();

$idMusica = $_POST['idMusica'];

unset($_POST);

$_SESSION['loadedMusic'] = $idMusica;

include_once "musicArea.php";

try {
    if (isset($_SESSION['loadedMusic'])) {
        accessMusicLog($_SESSION['accessGranted'], $_SESSION['loadedMusic']);
        echo json_encode(['sucesso' => "Sucesso!"]);
        exit();
    } else {
        echo json_encode(['erro' => "Erro ao enviar a música para a sessão!"]);
        exit();
    }
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>