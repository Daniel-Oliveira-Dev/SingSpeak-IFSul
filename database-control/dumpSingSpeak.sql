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
(1, "ApollyonDelta", "apollyondelta@gmail.com", "6a8549ffa9e5f3d33212d4f6a6489efac54c044fee7b5e50f17bd758bfc7c3d2", "28366fe35c44e1fb7f5b4dd70e41129fd4b339f3451c514566", 842593),
(2, "BLKZim", "miguelmigue806@gmail.com", "4499777917cff991370c40bcbab8ca2e511781acdeb29f4b2197e8114cb77723", "54d66750191b072fec7c6b70572775cc80a15b7620a89c68ee", 167310);

-- Tabela de Logs
CREATE TABLE logControl (
idLog INTEGER AUTO_INCREMENT NOT NULL UNIQUE,
dataRegistro TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP()),
tipoRegistro ENUM("Login", "Logout") NOT NULL,
idUsuario INTEGER NOT NULL,
PRIMARY KEY (idLog),
FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario)
);