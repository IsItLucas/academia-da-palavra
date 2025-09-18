import { IP, PORTA, URL } from "./modules/ip.js";

import * as popup from "./modules/popup.js";
import * as lightbox from "./modules/lightbox.js";
import * as tema from "./modules/tema.js";


window.cadastrar_aluno = cadastrar_aluno;

window.abrir_lightbox = lightbox.abrir_lightbox;
window.fechar_lightbox = lightbox.fechar_lightbox;
window.alternar_tema = tema.alternar_tema;


window.addEventListener("DOMContentLoaded", on_load);


const senha = document.getElementById('senha');
const confirmarSenha = document.getElementById('confirmar-senha');


async function on_load() {
	console.log("JS funcionando");
}


async function cadastrar_aluno() {
	if (senha.value !== confirmarSenha.value) {
		mostrar_erro("As senhas não coincidem!")
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

		if (!resposta.ok) {
			throw new Error(resposta);
		}

		mostrar_sucesso();
	} catch (erro) {
		mostrar_erro(erro);
	}
}


function mostrar_erro(err) {
	const texto_erro = "Falha ao criar conta Academia da Palavra:";

	popup.definir_tipo_popup(0);
	popup.definir_texto_popup("Erro!", texto_erro + "\n\n" + err);

	popup.abrir_popup();
}


function mostrar_sucesso() {
	const texto_sucesso = "Sua conta Academia da Palavra foi criada com sucesso.\nPara começar o curso, faça login primeiro.";

	popup.definir_tipo_popup(1);
	popup.definir_texto_popup("Sucesso!", texto_sucesso);

	popup.abrir_popup();
}