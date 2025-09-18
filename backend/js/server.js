import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";

import * as index from "./index.js";
import * as crypt from "./crypt.js";

import { conectar } from "./database.js";


dotenv.config({
	path: "backend/.env",
	encoding: "utf8",
	debug: true
});


const app = express();
app.use(cors());
app.use(express.json());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: true,
		maxAge: 1000 * 60 * 60 * 24 // 24 horas
	}
}));


index.setup_database()


app.post('/login', async (req, res) => {
	const { email, senha } = req.body;

	try {
		const alunos = await index.obter_alunos();

		const aluno = alunos.find(a => a.email === email);
		if (!aluno) {
			res.status(401).send({ erro: "Credenciais inválidas" });
			return;
		}

		console.log("Senha Inserida: " + senha);
		console.log("Senha DB: " + aluno.senha);
		console.log("Correto? " + await crypt.descriptografar(senha, aluno.senha))
		if (!await crypt.descriptografar(senha, aluno.senha)) {
			res.status(401).send({ erro: "Credenciais inválidas" });
			return;
		}

		req.session.user = { nome: aluno.nome };
		res.status(200).send({ mensagem: "Login realizado com sucesso!" });
	} catch (err) {
		res.status(500).send(err)
	}
});


app.get('/dashboard', index.autenticar, (req, res) => {
	res.status(200).send(`Bem-vindo, ${req.session.user.nome}!`);
});


app.get('/logout', (req, res) => {
	req.session.destroy();
	res.status(200).send({ mensagem: "Sessão encerrada com sucesso!" });
});


app.post("/avaliacao", async (req, res) => {
	try {
		const { id_aluno, conteudo, nota, data_realizacao } = req.body;
		await index.enviar_avaliacao(id_aluno, conteudo, nota, data_realizacao);

		res.status(201).send("Avaliação enviada com sucesso!");
	} catch (err) {
		res.status(500).send(err)
	}
});


app.post("/aluno", async (req, res) => {
	try {
		const { nome, cpf, email, senha, nascimento } = req.body;
		await index.cadastrar_aluno(nome, cpf, email, senha, nascimento);

		res.status(201).send("Aluno cadastrado com sucesso!");
	} catch (err) {
		res.status(500).send(err)
	}
});


app.post("/compra", async (req, res) => {
	try {
		const { id_aluno, metodo, desconto, data_efetuacao } = req.body;
		await index.registrar_compra(id_aluno, metodo, desconto, data_efetuacao);

		res.status(201).send("Compra registrada com sucesso!");
	} catch (err) {
		res.status(500).send(err)
	}
});


app.post("/endereco", async (req, res) => {
	try {
		const { id_aluno, logradouro, numero, complemento, bairro, cidade, estado, cep, pais } = req.body;
		await index.cadastrar_endereco(id_aluno, logradouro, numero, complemento, bairro, cidade, estado, cep, pais);

		res.status(201).send("Endereço cadastrado com sucesso!");
	} catch (err) {
		res.status(500).send(err)
	}
});


app.get("/avaliacoes", async (req, res) => {
	try {
		const avaliacoes = await index.obter_avaliacoes();
		res.status(200).send(avaliacoes);
	} catch (err) {
		res.status(500).send(err)
	}
});


app.get("/contas", async (req, res) => {
	try {
		const contas = await index.obter_contas();
		res.status(200).send(contas);
	} catch (err) {
		res.status(500).send(err)
	}
});


app.get("/alunos", async (req, res) => {
	try {
		const alunos = await index.obter_alunos();
		res.status(200).send(alunos);
	} catch(err) {
		res.status(500).send(err)
	}
});


app.get("/compras", async (req, res) => {
	try {
		const compras = await index.obter_compras();
		res.status(200).send(compras);
	} catch (err) {
		res.status(500).send(err)
	}
});


app.get("/enderecos", async (req, res) => {
	try {
		const enderecos = await index.obter_enderecos();
		res.status(200).send(enderecos);
	} catch (err) {
		res.status(500).send(err)
	}
});


app.listen(process.env.SERVER_PORT, () => {
	console.log(`O servidor está rodando em http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}...`);
});