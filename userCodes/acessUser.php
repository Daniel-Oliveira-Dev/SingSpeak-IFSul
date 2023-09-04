<?php
session_start();

if (isset($_SESSION['acessGranted'])) {
    header('location: ../userPage.html');
    exit();
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_POST['loginUsername']) || empty($_POST['loginPassword'])) {
    header('location: ../index.html');
    exit();
}

$username = $_POST['loginUsername'];
$senha = $_POST['loginPassword'];

unset($_POST);

// Valida o acesso verificando o banco de dados
function logIn($username, $senha) {
    require_once("../connection.php");
    require_once("usuario.php");
    try {
        $statement = $conexao->prepare("SELECT * FROM usuario WHERE username = :username AND senha = :senha");

        $statement->bindParam(":username", $username);
        $statement->bindParam(":senha", $senha);

        $statement->execute();

        if ($statement->rowCount() == 0) {
            return "Acesso negado!";
        }

        $resultado = $statement->fetchAll(PDO::FETCH_ASSOC);

        $user = new Usuario(
            $resultado[0]['idUsuario'], 
            $resultado[0]['username'],
            $resultado[0]['email'],
            $resultado[0]['senha'],
            $resultado[0]['dataCriacao'],
            $resultado[0]['pontos'],
            $resultado[0]['idNivel']
        );

        return $user;

    } catch (PDOException $err) {
        echo $err->getMessage();
    }
}

// Verifica se o acesso foi possível de se realizar. Se não for, encerra o código #PRECISA COMPLEMENTAR
$tentativa = logIn($username, $senha);

if ($tentativa == "Acesso negado!") {
    echo "Erro! Seu nome de usuário ou senha estão incorretos!";
    exit();
}

// Se o acesso validar, ele salva o usuário na sessão
$_SESSION['acessGranted'] = $tentativa;

// Envia as informações do usuário para a página de usuário

?>