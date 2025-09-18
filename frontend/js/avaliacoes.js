import { IP, PORTA, URL } from "./modules/ip.js";

import * as popup from "./modules/popup.js";
import * as tema from "./modules/tema.js";


window.enviar = enviar;

window.addEventListener("DOMContentLoaded", on_load);


const stars = document.querySelectorAll('.star');


function on_load() {
	configurar_estrelas()
}


async function enviar() {
	console.log(JSON.stringify(get_avaliacao()));
	try {
		const resposta = await fetch(`${URL}/avaliacao`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(get_avaliacao())
		});

		if (!resposta.ok) {
			throw new Error(resposta);
		}

		mostrar_sucesso();

	} catch(err) {
		mostrar_erro(err);
	}
}


function get_avaliacao() {
	const nota = parseInt(document.getElementById("satisfacao").value, 10);
	const conteudo = document.getElementById("comentario").value;

	return {
		"conteudo": conteudo,
		"nota": nota,
	}
}


function configurar_estrelas() {
	stars.forEach((star, index) => {
		star.addEventListener('click', () => {
			const nota = index + 1;
			atualizar_estrelas(nota);
		});

		star.className = 'star';
	});
}


function atualizar_estrelas(nota) {
	const cor = get_cor(nota);
	const satisfacaoInput = document.getElementById('satisfacao');

	stars.forEach((star, i) => {
		star.className = 'star';
		if (i < nota) {
			star.classList.add(cor);
		}
	});

	satisfacaoInput.value = nota;
}


function mostrar_erro(err) {
	const texto_erro = "Falha ao avaliar curso:";

	popup.definir_tipo_popup(0);
	popup.definir_texto_popup("Erro!", texto_erro + "\n\n" + err);

	popup.abrir_popup();
}


function mostrar_sucesso() {
	const texto_sucesso = "Sua avaliação foi enviada com sucesso!";

	popup.definir_tipo_popup(1);
	popup.definir_texto_popup("Sucesso!", texto_sucesso);

	popup.abrir_popup();
}


function get_cor(nota) {
	if (nota <= 1) return 'red';
	if (nota === 2) return 'orange';
	if (nota === 3) return 'yellow';
	if (nota === 4) return 'green';
	return 'blue';
}