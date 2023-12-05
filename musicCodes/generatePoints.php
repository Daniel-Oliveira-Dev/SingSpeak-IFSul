<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

include "musicArea.php";

$arrayPoints = $_POST['arrayPontos'];

$numerosComoStrings = explode(',', $arrayPoints);

// Converter cada valor em um número
$numerosComoNumeros = array_map('intval', $numerosComoStrings);

// Exibir o array resultante
print_r($numerosComoNumeros);

?>