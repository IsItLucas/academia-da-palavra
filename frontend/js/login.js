import { IP, PORTA, URL } from "./modules/ip.js";

import * as popup from "./modules/popup.js";
import * as lightbox from "./modules/lightbox.js";
import * as tema from "./modules/tema.js";


window.logar = logar;

window.abrir_lightbox = lightbox.abrir_lightbox;
window.fechar_lightbox = lightbox.fechar_lightbox;
window.alternar_tema = tema.alternar_tema;


window.addEventListener('DOMContentLoaded', on_load);


const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');


async function on_load() {
	console.log("JS funcionando");
}


async function logar() {
	const email = emailInput.value.trim();
	const senha = senhaInput.value.trim();

	try {
		const resposta = await fetch(`${URL}/login`, {
			credentials: "include",
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, senha })
		});

		if (!resposta.ok) {
			throw new Error(resposta);
		}

		window.location.href = "./zona_de_aulas.html";
		mostrar_sucesso();

	} catch (erro) {
		if (erro instanceof Response) {
			const texto = await erro.text();
			mostrar_erro(texto);
		} else {
			mostrar_erro(erro);
		}
	}
}


function mostrar_erro(err) {
	const texto_erro = "Falha ao logar em conta Academia da Palavra:";

	popup.definir_tipo_popup(0);
	popup.definir_texto_popup("Erro!", texto_erro + "\n\n" + err);

	popup.abrir_popup();
}


function mostrar_sucesso() {
	const texto_sucesso = "Você conectou-se à sua conta Academia da palavra com sucesso!\nPara começar o curso, adquira-o se ainda não tiver feito.";

	popup.definir_tipo_popup(1);
	popup.definir_texto_popup("Sucesso!", texto_sucesso);

	popup.abrir_popup();
}