import * as db from "./database.js";
import * as crypt from "./crypt.js";


export async function enviar_avaliacao(id_aluno, conteudo, nota, data_realizacao) {
	const conexao = await db.conectar();

	const query = "INSERT INTO avaliacoes(id_aluno, conteudo, nota, data_realizacao) VALUES (?, ?, ?, ?)";
	const parametros = [
		id_aluno,

		conteudo,
		nota,
		data_realizacao
	];

	console.log("Executando:", query, parametros);
 	await conexao.query(query, parametros);
	await db.desconectar(conexao);
}


export async function cadastrar_aluno(nome, cpf, email, senha, nascimento) {
	const conexao = await db.conectar();

	const query = "INSERT INTO alunos(nome, cpf, email, senha, nascimento) VALUES (?, ?, ?, ?, ?)";
	const parametros = [
		nome,
		cpf,
		email,
		crypt.criptografar(senha),
		nascimento
	];

	console.log("Executando:", query, parametros);
	await conexao.query(query, parametros);
	await db.desconectar(conexao);
}


export async function registrar_compra(id_aluno, metodo, desconto, data_efetuacao) {
	const conexao = await db.conectar();

	const query = "INSERT INTO compras(id_aluno, metodo, desconto, data_efetuacao) VALUES (?, ?, ?, ?)";
	const parametros = [
		id_aluno,
		metodo,
		desconto,
		data_efetuacao,
	];

	console.log("Executando:", query, parametros);
	await conexao.query(query, parametros);
	await db.desconectar(conexao);
}


export async function cadastrar_endereco(id_aluno, logradouro, numero, complemento, bairro, cidade, estado, cep, pais) {
	const conexao = await db.conectar();

	const query = "INSERT INTO compras(id_aluno, logradouro, numero, complemento, bairro, cidade, estado, cep, pais) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
	const parametros = [
		id_aluno,
		logradouro,
		numero,
		complemento,
		bairro,
		cidade,
		estado,
		cep,
		pais
	];

	console.log("Executando:", query, parametros);
	await conexao.query(query, parametros);
	await db.desconectar(conexao);
}


export async function obter_avaliacoes() {
	return await obter_tabela("avaliacoes");
}


export async function obter_contas() {
	return await obter_tabela("contas");

}


export async function obter_alunos() {
	return await obter_tabela("alunos");

}


export async function obter_compras() {
	return await obter_tabela("compras");

}


export async function obter_enderecos() {
	return await obter_tabela("enderecos");
}


export async function obter_tabela(tabela) {
	const conexao = await db.conectar();

	const query = "SELECT * FROM " + tabela;
	const [resultado] = await conexao.execute(query);

	await db.desconectar(conexao);

	return resultado;
}


export async function setup_database() {
	const conexao = await db.conectar();

	let query = `
		CREATE TABLE IF NOT EXISTS contas(
			id INT PRIMARY KEY AUTO_INCREMENT,
			email VARCHAR(128) NOT NULL,
			senha VARCHAR(64) NOT NULL,
			data_criacao DATE,
			ativo BOOL DEFAULT TRUE
		)
	`;
	await conexao.execute(query);

	query = `
		CREATE TABLE IF NOT EXISTS alunos (
			id INT PRIMARY KEY AUTO_INCREMENT,
			nome VARCHAR(128) NOT NULL,
			nascimento DATE,
			cpf VARCHAR(14),
			pfp VARCHAR(32),
			id_conta INT NOT NULL,
			
			FOREIGN KEY (id_conta) REFERENCES contas (id)
		)
	`;
	await conexao.execute(query);

	query = `
		CREATE TABLE IF NOT EXISTS compras (
			id INT PRIMARY KEY AUTO_INCREMENT,
			id_conta INT NOT NULL,
			id_endereco INT NOT NULL,
			data_efetuacao DATE NOT NULL,
			metodo ENUM("pix", "credito", "debito", "boleto") NOT NULL,
			desconto INT DEFAULT 0,

			FOREIGN KEY (id_conta) REFERENCES contas (id)
		)
	`;
	await conexao.execute(query);

	query = `
		CREATE TABLE IF NOT EXISTS enderecos (
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
	`;
	await conexao.execute(query);

	query = `
		CREATE TABLE IF NOT EXISTS avaliacoes (
			id INT PRIMARY KEY AUTO_INCREMENT,
			id_aluno INT NOT NULL,
			conteudo VARCHAR(512) NOT NULL,
			nota TINYINT NOT NULL,
			data_realizacao DATE NOT NULL,

			FOREIGN KEY (id_aluno) REFERENCES alunos (id)
		)
	`;
	await conexao.execute(query);

	await db.desconectar(conexao);
}