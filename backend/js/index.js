import * as db from "./database.js";
import * as crypt from "./crypt.js";


export async function enviar_avaliacao(id_aluno, conteudo, nota) {
	const conexao = await db.conectar();

	const query = "INSERT INTO avaliacoes(id_aluno, conteudo, nota, data_realizacao) VALUES (?, ?, ?, ?)";
	const parametros = [
		// id_aluno,
		1,
		conteudo,
		nota,
		new Date().toISOString().split("T")[0]
	];

	await conexao.execute(query, parametros);

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


async function obter_tabela(tabela) {
	const conexao = await db.conectar();

	const query = "SELECT * FROM " + tabela;
	const [resultado] = await conexao.execute(query);

	await db.desconectar(conexao);

	return resultado;
}