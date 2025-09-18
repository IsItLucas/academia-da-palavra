import { IP, PORTA, URL } from "./modules/ip.js";

import * as lightbox from "./modules/lightbox.js";
import * as tema from "./modules/tema.js";


window.abrir_lightbox = lightbox.abrir_lightbox;
window.fechar_lightbox = lightbox.fechar_lightbox;
window.alternar_tema = tema.alternar_tema;


window.addEventListener("DOMContentLoaded", on_load);


const body = document.body;

const form = document.getElementById('form-cadastro');
const senha = document.getElementById('senha');
const confirmarSenha = document.getElementById('confirmar-senha');


async function on_load() {
	console.log("JS funcionando");
}


async function cadastrar_aluno(event) {
	event.preventDefault();

	const mensagensExistentes = form.querySelectorAll('.mensagem');
	mensagensExistentes.forEach(msg => msg.remove());

	if (senha.value !== confirmarSenha.value) {
		alert("As senhas não coincidem!");
		confirmarSenha.focus();

		return;
	}

	const usuario = {
		nome: document.getElementById('nome').value,
		cpf: document.getElementById('cpf').value,
		email: document.getElementById('email').value,
		nascimento: document.getElementById('data-nascimento').value,
		senha: senha.value,
	};

	try {
		const resposta = await fetch(`${URL}/aluno`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(usuario)
		});

		if (!resposta.ok) throw new Error("Erro ao cadastrar usuário: " + resposta);

		let mensagem = document.createElement('p');
		mensagem.textContent = "Usuário cadastrado e será matriculado no curso...";
		mensagem.classList.add('mensagem');
		mensagem.style.marginTop = "20px";
		mensagem.style.fontWeight = "bold";
		mensagem.style.color = "#00796b";
		form.appendChild(mensagem);

		form.querySelector('button[type="submit"]').disabled = true;

		setTimeout(() => {
			window.location.href = "login.html";
		}, 3000);

		form.reset();

	} catch (erro) {
		console.error(erro);
		alert("Falha ao cadastrar usuário: " + erro);
	}
}