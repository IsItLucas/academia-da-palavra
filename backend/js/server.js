import express from "express";
// import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";

import * as index from "./index.js";
import { conectar } from "./database.js";


// dotenv.config({
// 	path: "backend/.env",
// 	encoding: "utf8",
// 	debug: true
// });


const app = express();
app.use(cors());
app.use(express.json());
// app.use(session({
// 	secret: process.env.SESSION_SECRET,
// 	resave: false,
// 	saveUninitialized: false,
// 	cookie: {
// 		secure: false,
// 		maxAge: 1000 * 60 * 60 * 12 // 12 horas
// 	}
// }));


index.setup_database()


app.post("/avaliacao", async (req, res) => {
	try {
		const { id_aluno, conteudo, nota } = req.body;
		await index.enviar_avaliacao(id_aluno, conteudo, nota);

		res.status(200).send("Avaliação enviada com sucesso!");
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


const PORTA = process.env.SERVER_PORT;
const IP = process.env.SERVER_IP;
app.listen(PORTA, () => {
	console.log(`O servidor está rodando em ${URL}...`);
});