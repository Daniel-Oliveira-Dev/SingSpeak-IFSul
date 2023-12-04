<?php

session_start();

include "musicArea.php";

$music = assembleMusic($_SESSION['loadedMusic']);

$linhas = lerArquivo($music['letra']);

$informacoes = extrairInformacoes($linhas);

function lerArquivo($nomeArquivo) {
    $caminhoArquivo = "musicLyrics/" . $nomeArquivo;
    $linhas = file($caminhoArquivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    return $linhas;
}

function extrairInformacoes($linhas) {
    $trechos = [];
    $trechoAtual = null;

    foreach ($linhas as $linha) {
        if (strpos($linha, "&&") === 0) {
            // adiciona o trecho anterior à lista
            if ($trechoAtual !== null) {
                $trechos[] = $trechoAtual;
            }

            //novo trecho
            $trechoAtual = [
                'inicio' => floatval(substr($linha, 2)),
                'fim' => null,
                'conteudo' => "",
                'frasesTranscritas' => []
            ];
        } elseif (strpos($linha, "@@") === 0) {
            // fim do trecho
            $trechoAtual['fim'] = floatval(substr($linha, 2));
        } else {
            // linha no trecho
            $trechoAtual['conteudo'] .= $linha . " ";
        }
    }

    // último trecho
    if ($trechoAtual !== null) {
        $trechos[] = $trechoAtual;
    }

    return $trechos;
}

// cabeçalho como JSON
header('Content-Type: application/json');

// Retorna o JSON
echo json_encode(["paragrafosOriginais" => $informacoes]);

?>