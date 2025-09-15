import { IP, PORTA } from "./modules/ip.js";

import * as lightbox from "./modules/lightbox.js";
import * as paralaxe from "./modules/paralaxe.js";
import * as tema from "./modules/tema.js";


window.purchase_request = purchase_request;
window.abrir_lightbox = lightbox.abrir_lightbox;
window.fechar_lightbox = lightbox.fechar_lightbox;
window.alternar_tema = tema.alternar_tema;

window.addEventListener("DOMContentLoaded", on_load);


async function on_load() {
	console.log("JS funcionando");

	paralaxe.definir_velocidade_do_elemento("header", 0.5);
	await criar_avaliacoes();
}


function purchase_request() {
	window.location.href = "../html/comprar.html";
}


async function get_aluno_por_id(id) {
	let alunos = await get_alunos();
	return alunos.find(aluno => aluno.id == id);
}


async function get_conta_por_id(id) {
	let contas = await get_contas();
	return contas.find(conta => conta.id == id);
}


async function get_alunos() {
	const resposta = await fetch(`http://${IP}:${PORTA}/alunos`);
	const resultado = await resposta.json();

	return resultado;
}


async function get_contas() {
	const resposta = await fetch(`http://${IP}:${PORTA}/contas`);
	const resultado = await resposta.json();

	return resultado;
}


async function get_avaliacoes() {
	const resposta = await fetch(`http://${IP}:${PORTA}/avaliacoes`);
	const resultado = await resposta.json();

	return resultado;
}


async function criar_avaliacoes() {
	const container = document.getElementById("avaliacoes");

	let avaliacoes = await get_avaliacoes();
	let html = "";

	for (const aval of avaliacoes) {
		let estrelas = "";
		for (let i = 0; i < 5; i++) {
			if (i >= aval.nota) {
				estrelas += "&star;"
			} else {
				estrelas += "&starf;"
			}
		}

		let data = new Date(aval.data_realizacao).toLocaleDateString();

		let aluno = await get_aluno_por_id(aval.id_aluno);
		let conta = await get_conta_por_id(aluno.id_conta);
		console.log(conta);
		console.log(aluno);

		html += `
			<div class="avaliacao">
				<p id="estrelas">${estrelas}</p>
				<p class="avaliacao-texto">${aval.conteudo}</p>
				<div class="div_autor">
					<img src="../img/autores/${aluno.pfp}" alt="Foto do Autor" class="autor_pfp" onclick="abrir_lightbox(this)">
					<small>${aluno.nome} &blacksquare; ${data}</small>
				</div>
			</div>
		`
	}

	container.innerHTML = html;
}