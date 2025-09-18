DROP DATABASE IF EXISTS academia_da_palavra;
CREATE DATABASE IF NOT EXISTS academia_da_palavra;
USE academia_da_palavra;


-- =======================================
-- TABELA DE ALUNOS (antes contas+alunos)
-- =======================================
DROP TABLE IF EXISTS alunos;
CREATE TABLE IF NOT EXISTS alunos (
	id INT PRIMARY KEY AUTO_INCREMENT,

	email VARCHAR(128) NOT NULL UNIQUE,
	senha VARCHAR(64) NOT NULL,

	nome VARCHAR(128) NOT NULL,
	cpf VARCHAR(14),
	nascimento DATE,

	ativo BOOLEAN DEFAULT TRUE,
	data_criacao DATE DEFAULT (CURRENT_DATE)
);


-- =======================================
-- TABELA DE COMPRAS
-- =======================================
DROP TABLE IF EXISTS compras;
CREATE TABLE compras (
	id INT PRIMARY KEY AUTO_INCREMENT,

	id_aluno INT NOT NULL,

	metodo ENUM("pix", "credito", "debito", "boleto") NOT NULL,
	desconto INT DEFAULT 0,

	data_efetuacao DATE NOT NULL DEFAULT(CURRENT_DATE),

	FOREIGN KEY (id_aluno) REFERENCES alunos (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);


-- =======================================
-- TABELA DE ENDEREÇOS
-- =======================================
DROP TABLE IF EXISTS enderecos;
CREATE TABLE enderecos (
	id INT PRIMARY KEY AUTO_INCREMENT,

	id_aluno INT NOT NULL,  -- endereço pertence ao usuário, não à compra
	logradouro VARCHAR(128),
	numero VARCHAR(16),
	complemento VARCHAR(64),
	bairro VARCHAR(64),
	cidade VARCHAR(64),
	estado CHAR(2),
	cep CHAR(9),
	pais VARCHAR(64) DEFAULT "Brasil",

	FOREIGN KEY (id_aluno) REFERENCES alunos (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);


-- =======================================
-- TABELA DE AVALIAÇÕES
-- =======================================
DROP TABLE IF EXISTS avaliacoes;
CREATE TABLE avaliacoes (
	id INT PRIMARY KEY AUTO_INCREMENT,

	id_aluno INT NOT NULL,
	conteudo VARCHAR(512) NOT NULL,
	nota TINYINT NOT NULL,
	data_realizacao DATE NOT NULL,

	FOREIGN KEY (id_aluno) REFERENCES alunos (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);
