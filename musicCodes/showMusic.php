<?php 

session_start();

$idMusica = $_POST['idMusica'];

unset($_POST);

include_once("musicArea.php");

try {
    $musicArray = assembleMusic($idMusica);
    $maiorPontuacao = getUserHighestScore($_SESSION['accessGranted'], $idMusica);
    echo json_encode(['musicArray' => $musicArray, 'maiorPontuacao' => $maiorPontuacao]);
    exit();
} catch (Exception $e) {
    echo json_encode(['erro' => $e]);
    exit();
}

?>