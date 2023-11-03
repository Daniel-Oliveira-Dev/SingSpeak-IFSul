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

-- Inserindo os Níveis da Plataforma
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

-- Inserindo os Primeiros Usuários
INSERT INTO usuario (idUsuario, username, email, hash_senha, salt, pontos, dataCriacao) VALUES
(1, "ApollyonDelta", "apollyondelta@gmail.com", "6a8549ffa9e5f3d33212d4f6a6489efac54c044fee7b5e50f17bd758bfc7c3d2", "28366fe35c44e1fb7f5b4dd70e41129fd4b339f3451c514566", 842593, "2003-11-20 00:00:00"),
(2, "BLKZim", "miguelmigue806@gmail.com", "4499777917cff991370c40bcbab8ca2e511781acdeb29f4b2197e8114cb77723", "54d66750191b072fec7c6b70572775cc80a15b7620a89c68ee", 167310, "2004-03-03 00:00:00");

-- Tabela de Logs
CREATE TABLE logControl (
idLog INTEGER AUTO_INCREMENT NOT NULL UNIQUE,
dataRegistro TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP()),
tipoRegistro ENUM("Login", "Logout") NOT NULL,
idUsuario INTEGER NOT NULL,
PRIMARY KEY (idLog),
FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario)
);

-- Inserindo os Logins e Logouts dos Primeiros Usuários
INSERT INTO logControl (tipoRegistro, dataRegistro, idUsuario) VALUES
("Login", "2003-11-20 00:00:00", 1), ("Logout", "2003-11-20 23:59:00", 1), ("Login", "2004-03-03 00:00:00", 2), ("Logout", "2004-03-03 23:59:00", 2);


-- Tabela de Músicas
CREATE TABLE musica (
idMusica INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
nome VARCHAR(100) NOT NULL UNIQUE,
artista VARCHAR(50) NOT NULL,
letra TEXT NOT NULL,
ano SMALLINT NOT NULL,
codYouTube VARCHAR(255) NOT NULL,
musicCover VARCHAR(100) NOT NULL,
idNivel INTEGER NOT NULL,

PRIMARY KEY (idMusica),
FOREIGN KEY (idNivel) REFERENCES nivel (idNivel)
);

-- Inserindo Músicas no Sistema (Letra temporariamente indisponível)
INSERT INTO musica (idMusica, nome, artista, letra, ano, codYouTube, idNivel, musicCover) VALUES 
(1, "Twinkle Twinkle Little Star", "Jane Taylor", "letraTwinkle.txt", 1806, "-JRJibhgwUQ?si=TGPurYofchkmiglt", 1, "twinkle_twinkle.jpg"),
(2, "Payphone", "Maroon 5", "letraPayphone.txt", 2012, "fuP4Lkt1vAo?si=5NCefVvnCLQA3j76", 2, "payphone.jpg"),
(3, "Believer", "Imagine Dragons", "letraBeliever.txt", 2017, "W0DM5lcj6mw?si=gsuA9fkmNu4zBzV7", 3, "believer.jpg"),
(4, "Hello, Goodbye", "The Beatles", "letraHello.txt", "1967", "TL6XovDlBnw?si=SIn13cFidzA4zzhn", 1, "hello_goodbye.jpg"),
(5, "Photograph", "Ed Sheeran", "letraPhotograph.txt", "2014", "HpphFd_mzXE?si=hXFjpc29N2zTdsZK", 2, "photograph.jpg");

-- Tabela de Acesso do Usuário para a Música
CREATE TABLE usuarioAcessaMusica (
idUsuarioAcessaMusica INTEGER AUTO_INCREMENT UNIQUE,
dataAcesso TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP()),
idUsuario INTEGER NOT NULL,
idMusica INTEGER NOT NULL,
PRIMARY KEY (idUsuarioAcessaMusica),
FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario),
FOREIGN KEY (idMusica) REFERENCES musica (idMusica)
);

-- Tabela de Gravação do Usuário para a Música
CREATE TABLE usuarioGravaMusica (
idUsuarioGravaMusica INTEGER AUTO_INCREMENT UNIQUE,
dataGravacao TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP()),
pontuacaoAdquirida INT NOT NULL,
idUsuario INTEGER NOT NULL,
idMusica INTEGER NOT NULL,
PRIMARY KEY (idUsuarioGravaMusica),
FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario),
FOREIGN KEY (idMusica) REFERENCES musica (idMusica)
);

-- Inserindo Gravações
INSERT INTO usuarioGravaMusica (pontuacaoAdquirida, idUsuario, idMusica) VALUES
(123, 1, 1), (231, 1, 1), (213, 1, 1), (132, 1, 1), (312, 1, 1),
(412, 2, 1), (312, 2, 1), (412, 2, 1), (541, 2, 1), (123, 2, 1);

-- Tabela de Questões
CREATE TABLE questao (
idQuestao INTEGER AUTO_INCREMENT NOT NULL UNIQUE,
enunciado VARCHAR(255) NOT NULL UNIQUE,
alternativaA VARCHAR(255) NOT NULL,
alternativaB VARCHAR(255) NOT NULL,
alternativaC VARCHAR(255) NOT NULL,
alternativaD VARCHAR(255) NOT NULL,
resposta ENUM("A","B","C","D") NOT NULL,
pontosFornecidos INT NOT NULL,
idMusica INTEGER NOT NULL,
PRIMARY KEY (idQuestao),
FOREIGN KEY (idMusica) REFERENCES musica (idMusica)
);

-- Inserindo Questões sobre as Músicas (Exemplos iniciais)
INSERT INTO questao (enunciado, alternativaA, alternativaB, alternativaC, alternativaD, resposta, pontosFornecidos, idMusica) VALUES 
("O que significa 'Believer' no contexto da música?", 
"Alguém que acredita que consegue", 
"Alguém religioso demais para pensar claramente", 
"Alguém que gosta muito de lutar", 
"Alguém que não desiste dos desafios por conta de sua família",
"A", 20, 3),

("A letra desta música parece indicar que tipo de evento?", 
"Dois amantes foram separados por uma família conservadora", 
"Um amante perdeu sua amada para um trágico acidente", 
"O cantor está relembrando de sua infância no campo", 
"Dois amantes encerraram seu relacionamento e um deles está tentado reconciliar",
"D", 15, 2),

("Qual o propósito da melodia?", 
"Fazer o ouvinte refletir sobre o capitalismo e suas práticas predatórias", 
"Servir como uma cantiga de ninar para crianças", 
"Criar uma atmosfera tensa para um momento de confronto", 
"Fazer o ouvinte refletir sobre momentos com a família",
"B", 10, 1);

-- Tabela de Interação do Usuário com uma Questão
CREATE TABLE usuarioRespondeQuestao (
idUsuarioRespondeQuestao INTEGER AUTO_INCREMENT NOT NULL UNIQUE,
dataResposta TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP()),
estaCorreta BOOLEAN NOT NULL,
idUsuario INTEGER NOT NULL,
idQuestao INTEGER NOT NULL,
PRIMARY KEY (idUsuarioRespondeQuestao),
FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario),
FOREIGN KEY (idQuestao) REFERENCES questao (idQuestao)
);