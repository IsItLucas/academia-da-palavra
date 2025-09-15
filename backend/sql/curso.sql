-- SQLBook: Code
-- Active: 1753396469543@@127.0.0.1@3306@academia_da_palavra

DROP DATABASE IF EXISTS academia_da_palavra;
CREATE DATABASE IF NOT EXISTS academia_da_palavra;
USE academia_da_palavra;


-- Tabela de CONTAS
DROP TABLE IF EXISTS contas;
CREATE TABLE contas (
	id INT PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(128) NOT NULL,
	senha VARCHAR(64) NOT NULL,
	data_criacao DATE,
	ativo BOOL DEFAULT TRUE
)

DELETE FROM contas;
INSERT INTO contas(email, senha, data_criacao) VALUES
(
    "ana@email.com",
    "senha123",
    "2025-07-01"
),
(
    "bruno@email.com",
    "senha123",
    "2025-07-02"
),
(
    "carla@email.com",
    "senha123",
    "2025-07-03"
),
(
    "daniel@email.com",
    "senha123",
    "2025-07-04"
),
(
    "elisa@email.com",
    "senha123",
    "2025-07-05"
);



-- Tabela de ALUNOS
DROP TABLE IF EXISTS alunos;
CREATE TABLE alunos (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(128) NOT NULL,
	nascimento DATE,
	cpf VARCHAR(14),
	pfp VARCHAR(32),
    id_conta INT NOT NULL,
    
    FOREIGN KEY (id_conta) REFERENCES contas (id)
);

DELETE FROM alunos;
INSERT INTO alunos(nome, nascimento, cpf, pfp, id_conta) VALUES
(
    "Ana Paula Silva",
    "1995-04-20",
    "123.456.789-00",
    "ana.jpg",
    1
),
(
    "Bruno Martins Costa",
    "1988-07-11",
    "234.567.890-11",
    "bruno.jpg",
    2
),
(
    "Carla Ferreira Souza",
    "1992-12-05",
    "345.678.901-22",
    "carla.jpg",
    3
),
(
    "Daniel Lima Rocha",
    "2000-02-28",
    "456.789.012-33",
    "daniel.jpg",
    4
),
(
    "Elisa Mendes Rocha",
    "1999-10-16",
    "567.890.123-44",
    "elisa.jpg",
    5
);


-- Tabela de COMPRAS
DROP TABLE IF EXISTS compras;
CREATE TABLE compras (
	id INT PRIMARY KEY AUTO_INCREMENT,
	id_conta INT NOT NULL,
	id_endereco INT NOT NULL,
	data_efetuacao DATE NOT NULL,
	metodo ENUM("pix", "credito", "debito", "boleto") NOT NULL,
	desconto INT DEFAULT 0,

	FOREIGN KEY (id_conta) REFERENCES contas (id)
);

DELETE FROM compras;
INSERT INTO compras(id_conta, id_endereco, data_efetuacao, metodo, desconto) VALUES
(
    1,
	1,
    "2025-07-01",
    "pix",
    10
),
(
    2,
	2,
    "2025-07-02",
    "credito",
    5
),
(
    3,
	3,
    "2025-07-03",
    "boleto",
    0
),
(
    4,
	4,
    "2025-07-04",
    "debito",
    15
),
(
    5,
	5,
    "2025-07-05",
    "pix",
    20
);


-- Tabela de ENDEREÇOS
DROP TABLE IF EXISTS enderecos;
CREATE TABLE enderecos (
	id INT PRIMARY KEY AUTO_INCREMENT,
	id_compra INT NOT NULL,
	logradouro VARCHAR(128),
	numero VARCHAR(16),
	complemento VARCHAR(64),
	bairro VARCHAR(64),
	cidade VARCHAR(64),
	estado CHAR(2),
	cep CHAR(9),
	pais VARCHAR(64) DEFAULT "Brasil",

	FOREIGN KEY (id_compra) REFERENCES compras (id)
)

DELETE FROM enderecos;
INSERT INTO enderecos (id_compra, logradouro, numero, complemento, bairro, cidade, estado, cep, pais) VALUES
(
    1,
    "Rua das Flores",
    "123",
    "Apto 101",
    "Centro",
    "Belo Horizonte",
    "MG",
    "30123-456",
    "Brasil"
),
(
    2,
    "Av. Brasil",
    "456",
    "Bloco B",
    "Savassi",
    "Belo Horizonte",
    "MG",
    "30140-789",
    "Brasil"
),
(
    3,
    "Rua A",
    "789",
    "Loja",
    "Lourdes",
    "Belo Horizonte",
    "MG",
    "30150-321",
    "Brasil"
),
(
    4,
    "Rua B",
    "321",
    "Casa",
    "Anchieta",
    "Belo Horizonte",
    "MG",
    "30160-987",
    "Brasil"
),
(
    5,
    "Av. Amazonas",
    "654",
    "Sala 12",
    "Centro",
    "Belo Horizonte",
    "MG",
    "30170-654",
    "Brasil"
);


-- Tabela de AVALIAÇÕES
DROP TABLE IF EXISTS avaliacoes;
CREATE TABLE avaliacoes (
	id INT PRIMARY KEY AUTO_INCREMENT,
	id_aluno INT NOT NULL,
	conteudo VARCHAR(512) NOT NULL,
	nota TINYINT NOT NULL,
	data_realizacao DATE NOT NULL,

	FOREIGN KEY (id_aluno) REFERENCES alunos (id)
);

DELETE FROM avaliacoes;
INSERT INTO avaliacoes(id_aluno, conteudo, nota, data_realizacao) VALUES
(
    1,
    "Gostei muito da interatividade com a IA.",
    5,
    "2025-07-10"
),
(
    2,
    "Didática excelente e interface amigável.",
    4,
    "2025-07-11"
),
(
    3,
    "Aulas muito bem explicadas.",
    5,
    "2025-07-12"
),
(
    4,
    "O professor é muito claro nas explicações.",
    4,
    "2025-07-13"
),
(
    5,
    "Melhor curso online que já fiz.",
    5,
    "2025-07-14"
);