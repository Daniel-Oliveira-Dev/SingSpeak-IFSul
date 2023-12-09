<?php

session_start();

unset($_SESSION['loadedMusic']);

function clearSessionTXT() {
    $caminhoArquivo = '../recording/session.txt';

    if (file_exists($caminhoArquivo)) {
        unlink($caminhoArquivo);
    }
}

include_once "musicArea.php";

try {
    // Puxa os dados públicos do usuário
    $musicArray = listAllMusics();
    // Aproveita um arquivo PHP da lista de músicas para limpar os dados da sessão para o servidor de gravação
    clearSessionTXT();
    echo json_encode(['musicArray' => $musicArray]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e->getMessage()]);
    exit();
}

?>