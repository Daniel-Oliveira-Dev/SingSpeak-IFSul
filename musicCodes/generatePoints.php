<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Salva os valores do POST
$arrayPoints = $_POST['arrayPontos'];
$idMusica = $_POST['idMusica'];
$user = $_POST['username'];

// Apaga o POST
unset($_POST);

// Converter cada valor em um número
$numerosComoStrings = explode(',', $arrayPoints);
$numerosComoNumeros = array_map('floatval', $numerosComoStrings);

// Busca o nível da música

include "musicArea.php";

$idNivel = getMusicLevel($idMusica);

function generatePoints($arrayPointsNumbers, $idNivel) {
    $level = $idNivel - 1;
    $totalPoints = 0;

    // Variável para armazenar soma dos pontos
    $arrayGivenPointsMilestones = [
        [10, 15, 30], // Nível 1
        [10, 20, 40], // Nível 2
        [10, 30, 60]  // Nível 3
    ];

    foreach ($arrayPointsNumbers as $paragraph => $valor) {
        if ($valor >= 0.6) {
            $totalPoints += $arrayGivenPointsMilestones[$level][2];
        } elseif ($valor >= 0.3) {
            $totalPoints += $arrayGivenPointsMilestones[$level][1];
        } elseif ($valor >= 0.01) {
            $totalPoints += $arrayGivenPointsMilestones[$level][0];
        } else {
            $totalPoints += 0;
        }
    }

    return $totalPoints;
}

include "../userCodes/userArea.php";

try {
    $points = generatePoints($numerosComoNumeros, $idNivel);
    givePoints($user, $points);
    $newLevel = verifyLevelUpCondition($user);
    if ($newLevel) {
        levelUp($user);
    }
    saveUserRecordingData($idMusica, $user, $points);
    echo json_encode(['points' => $points, "similarity" => $numerosComoNumeros, "levelUp" => $newLevel]);
} catch (Exception $e) {
    echo json_encode(['erro' => $e]);
    exit();
}

?>