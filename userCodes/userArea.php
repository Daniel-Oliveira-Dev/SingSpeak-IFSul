<?php 

require "connection.php";

$db = new Database("localhost", "root", "alunoinfo", "SingSpeak");

if ($db->connect()) {
    echo "Conexão realizada com sucesso";
} else {
    echo "A Conexão falhou!"
}

?>