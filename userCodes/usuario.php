<?php

 class Usuario {
    private $idUsuario;
    private $username;
    private $emails;
    private $senha;
    private $dataCriacao;
    private $pontos;
    private $idNivel;

// Construtor da Classe Usuário
    public function __construct($idUsuario, $username, $email, $senha, $dataCriacao, $pontos, $idNivel) {
        $this->idUsuario = $idUsuario;
        $this->username = $username;
        $this->email = $email;
        $this->senha = $senha;
        $this->dataCriacao = $dataCriacao;
        $this->pontos = $pontos;
        $this->idNivel = $idNivel;
    }

// Getters e Setters da Classe Usuário
    public function getIdUsuario() {
        return $this->idUsuario ;
    }

    public function setIdUsuario($idUsuario) {
        $this->idUsuario = $idUsuario;
    }

    public function getUsername() {
        return $this->username;
    }

    public function setUsername($username) {
        $this->username = $username;
    }

    public function getEmail() {
        return $this->email;
    }

    public function setEmail($email) {
        $this->email = $email;;
    }

    public function getSenha() {
        return $this->senha;
    }

    public function setSenha($senha) {
        $this->senha = $senha;;
    }

    public function getDataCriacao() {
        return $this->dataCriacao;
    }

    public function setDataCriacao($dataCriacao) {
        $this->dataCriacao = $dataCriacao;
    }

    public function getPontos() {
        return $this->pontos;
    }

    public function setPontos($pontos) {
        $this->pontos = $pontos;
    }

    public function getIdNivel() {
        return $this->idNivel;
    }

    public function setIdNivel($idNivel) {
        $this->idNivel = $idNivel;
    }

}

?>