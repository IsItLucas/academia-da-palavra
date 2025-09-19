import * as db from "./database.js";
import * as crypt from "./crypt.js";


export function autenticar_login(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.status(403).send({ erro: "Acesso negado! Faça login primeiro." });
	}
}


export async function autenticar_compra(req, res, next) {
	if (!req.session.user) {
		res.status(403).send({ erro: "Acesso negado! Faça login primeiro." });
		return;
	}

	const conexao = await db.conectar();

	const [compras] = await conexao.query(
		"SELECT * FROM compras WHERE id_aluno = ?",
		[req.session.user.id]
	);

	await db.desconectar(conexao);

	if (compras.length > 0) {
		next();
	} else {
		res.status(403).send({ erro: "Acesso negado! Adquira o curso primeiro." });
	}
}


export async function enviar_avaliacao(conteudo, nota) {
	const conexao = await db.conectar();

	const query = "INSERT INTO avaliacoes(id_aluno, conteudo, nota) VALUES (?, ?, ?)";
	const parametros = [
		req.session.user.id,

		conteudo,
		nota
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
		await crypt.criptografar(senha),
		nascimento
	];

	console.log("Executando:", query, parametros);
	await conexao.query(query, parametros);
	await db.desconectar(conexao);
}


export async function registrar_compra(id_aluno, metodo, desconto) {
	const conexao = await db.conectar();

	const query = "INSERT INTO compras(id_aluno, metodo, desconto) VALUES (?, ?, ?)";
	const parametros = [
		id_aluno,
		metodo,
		desconto
	];

	console.log("Executando:", query, parametros);
	await conexao.query(query, parametros);
	await db.desconectar(conexao);
}


export async function cadastrar_endereco(id_aluno, logradouro, numero, complemento, bairro, cidade, estado, cep, pais) {
	const conexao = await db.conectar();

	const query = "INSERT INTO enderecos(id_aluno, logradouro, numero, complemento, bairro, cidade, estado, cep, pais) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
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


export async function get_usuario_por_email(email) {
	console.log(email);
	const conexao = await db.conectar();

	const query = "SELECT * FROM alunos WHERE email = ?";
	const [resultado] = await conexao.execute(query, [email]);

	await db.desconectar(conexao);
	console.log(resultado);

	return resultado[0];
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

	await conexao.execute(`SET FOREIGN_KEY_CHECKS = 0;`);
	await conexao.execute(`DROP TABLE IF EXISTS enderecos`);
	await conexao.execute(`DROP TABLE IF EXISTS compras`);
	await conexao.execute(`DROP TABLE IF EXISTS avaliacoes`);
	await conexao.execute(`DROP TABLE IF EXISTS alunos`);
	await conexao.execute(`SET FOREIGN_KEY_CHECKS = 1;`);

	// Tabela alunos
	await conexao.execute(`
        CREATE TABLE IF NOT EXISTS alunos (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(128) NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            nome VARCHAR(128) NOT NULL,
            cpf VARCHAR(14),
            nascimento DATE,
            ativo BOOLEAN DEFAULT TRUE,
            data_criacao DATE DEFAULT (CURRENT_DATE)
        )
    `);

	// Tabela compras
	await conexao.execute(`
        CREATE TABLE IF NOT EXISTS compras (
            id INT PRIMARY KEY AUTO_INCREMENT,
            id_aluno INT NOT NULL,
            metodo ENUM("pix", "credito", "debito", "boleto") NOT NULL,
            desconto INT DEFAULT 0,
            data_efetuacao DATE DEFAULT (CURRENT_DATE),
            FOREIGN KEY (id_aluno) REFERENCES alunos(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )
    `);

	// Tabela endereços
	await conexao.execute(`
        CREATE TABLE IF NOT EXISTS enderecos (
            id INT PRIMARY KEY AUTO_INCREMENT,
            id_aluno INT NOT NULL,
            logradouro VARCHAR(128),
            numero VARCHAR(16),
            complemento VARCHAR(64),
            bairro VARCHAR(64),
            cidade VARCHAR(64),
            estado CHAR(2),
            cep CHAR(9),
            pais VARCHAR(64) DEFAULT "Brasil",
            FOREIGN KEY (id_aluno) REFERENCES alunos(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )
    `);

	// Tabela avaliações
	await conexao.execute(`
        CREATE TABLE IF NOT EXISTS avaliacoes (
            id INT PRIMARY KEY AUTO_INCREMENT,
            id_aluno INT NOT NULL,
            conteudo VARCHAR(512) NOT NULL,
            nota TINYINT NOT NULL,
            data_realizacao DATE DEFAULT (CURRENT_DATE),
            FOREIGN KEY (id_aluno) REFERENCES alunos(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )
    `);

	await db.desconectar(conexao);
}