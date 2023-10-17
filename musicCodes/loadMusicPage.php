<?php

session_start();

$nomeMusic = $_POST['nomeMusic'];

unset($_POST);

$_SESSION['loadedMusic'] = $nomeMusic;
if (isset($_SESSION['loadedMusic'])) {
    echo json_encode(['sucesso' => "Sucesso!"]);
    exit();
} else {
    echo json_encode(['erro' => "Erro ao enviar a música para a sessão!"]);
    exit();
}

?>