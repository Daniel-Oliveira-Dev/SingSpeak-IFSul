# Database SingSpeak - Daniel de Oliveira e Miguel Valentim Silva dos Santos
# Orientadores - Dr. Lourenço de Oliveira Basso e Ma. Verônica Pasqualim Machado
# Trabalho de Conclusão de Curso - Curso Técnico em Informática - IFSul - Campus Sapucaia do Sul - 2023

-- Create Database
CREATE DATABASE SingSpeak;
USE SingSpeak;

-- Tabela de Níveis
CREATE TABLE nivel (
idNivel INTEGER AUTO_INCREMENT NOT NULL UNIQUE,
nomenclatura VARCHAR(15) NOT NULL,
pontuacaoMin INT NOT NULL UNIQUE,
pontuacaoMax INT NOT NULL UNIQUE,
PRIMARY KEY (idNivel)
);

INSERT INTO nivel (idNivel, nomenclatura, pontuacaoMin, pontuacaoMax) VALUES 
(1, "Básico", 0, 2999),
(2, "Intermediário", 3000, 5499),
(3, "Avançado", 5000, 999999);

-- Tabela de Usuários
CREATE TABLE usuario (
idUsuario INTEGER AUTO_INCREMENT NOT NULL UNIQUE,
username VARCHAR(25) NOT NULL UNIQUE,
email VARCHAR(100) NOT NULL UNIQUE,
senha VARCHAR(25) NOT NULL,
dataCriacao DATE NOT NULL DEFAULT(CURRENT_DATE()),
pontos BIGINT NOT NULL DEFAULT(0),
idNivel INTEGER NOT NULL DEFAULT(1),
PRIMARY KEY (idUsuario),
FOREIGN KEY (idNivel) REFERENCES nivel (idNivel)
);

INSERT INTO usuario (idUsuario, username, email, senha) VALUES
(1, "ApollyonDelta", "apollyondelta@gmail.com", "395248"),
(2, "BLKZim", "miguelmigue806@gmail.com", "131431");

-- Tabela de Logs
CREATE TABLE log (
idLog INTEGER AUTO_INCREMENT NOT NULL UNIQUE,
dataAcesso TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP()),
idUsuario INTEGER NOT NULL,
PRIMARY KEY (idLog),
FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario)
);