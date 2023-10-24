<?php

session_start();

$idMusica = $_POST['idMusica'];

unset($_POST);

$_SESSION['loadedMusic'] = $idMusica;
if (isset($_SESSION['loadedMusic'])) {
    echo json_encode(['sucesso' => "Sucesso!"]);
    exit();
} else {
    echo json_encode(['erro' => "Erro ao enviar a música para a sessão!"]);
    exit();
}

?>