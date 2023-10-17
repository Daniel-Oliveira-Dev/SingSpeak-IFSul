<?php

session_start();

if (isset($_SESSION['loadedMusic'])) {
    include_once "musicArea.php";
    include_once "../userCodes/userArea.php";
    try {
        $musica = assembleMusic($_SESSION['loadedMusic']);
        if ($musica['idNivel'] > getUserLevel($_SESSION['accessGranted'])['idNivel']) {
            throw new Exception ("Seu nível não é alto o suficiente para acessar esta música!");
        }
        echo json_encode(['musicArray' => $musica]);
        exit();
    } catch (Exception $e) {
        echo json_encode(['erro' => $e->getMessage()]);
        exit();
    }
} else {
    echo json_encode(['erro' => "Erro ao encontrar uma música selecionada!"]);
    exit();
}

?>