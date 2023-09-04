<?php

 class Usuario {
    private $idUsuario;
    private $username;
    private $email;
    private $senha;
    private $dataCriacao;
    private $pontos;
    private $idNivel;

    public function __construct($idUsuario, $username, $email, $senha, $dataCriacao, $pontos, $idNivel) {
        $this->idUsuario = $idUsuario;
        $this->username = $username;
        $this->email = $email;
        $this->senha = $senha;
        $this->dataCriacao = $dataCriacao;
        $this->pontos = $pontos;
        $this->idNivel = $idNivel;
    }

    // Realiza uma tentativa de login com username e senha informados
    public function logIn($username, $senha) {
        require_once("../connection.php");
        try {
            $statement = $conexao->prepare("SELECT * FROM usuario WHERE username = :username AND senha = :senha");
    
            $statement->bindParam(":username", $username);
            $statement->bindParam(":senha", $senha);
    
            $statement->execute();
    
            if ($statement->rowCount() == 0) {
                return null;
            }
    
            $resultado = $statement->fetchAll(PDO::FETCH_ASSOC);
    
            print_r($resultado);
    
        } catch (PDOException $err) {
            echo $err->getMessage();
        }
    }

}

?>