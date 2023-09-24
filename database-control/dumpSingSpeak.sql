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
hash_senha VARCHAR(255) NOT NULL,
salt VARCHAR(255) NOT NULL,
desativada ENUM("S", "N") NOT NULL DEFAULT("N"),
dataCriacao DATE NOT NULL DEFAULT(CURRENT_DATE()),
pontos BIGINT NOT NULL DEFAULT(0),
idNivel INTEGER NOT NULL DEFAULT(1),

PRIMARY KEY (idUsuario),
FOREIGN KEY (idNivel) REFERENCES nivel (idNivel)
);

INSERT INTO usuario (idUsuario, username, email, hash_senha, salt, pontos) VALUES
(1, "ApollyonDelta", "apollyondelta@gmail.com", "hash_senha", "salt", 842593),
(2, "BLKZim", "miguelmigue806@gmail.com", "BLK@0303", "hash_senha", "salt", 1673);

-- Tabela de Logs
CREATE TABLE logControl (
idLog INTEGER AUTO_INCREMENT NOT NULL UNIQUE,
dataRegistro TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP()),
tipoRegistro ENUM("Login", "Logout") NOT NULL,
idUsuario INTEGER NOT NULL,
PRIMARY KEY (idLog),
FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario)
);