import { IP, PORTA, URL } from "./modules/ip.js";


import * as tema from "./modules/tema.js";
import * as popup from "./modules/popup.js";


window.alternar_tema = tema.alternar_tema;
window.cancel_purchase = cancel_purchase;
window.confirmar_compra = confirmar_compra;

window.addEventListener("DOMContentLoaded", on_load);


async function on_load() {
	console.log("JS funcionando");

	configurar_estados();
	configurar_cidades();
}


function cancel_purchase() {
	window.location.href = "../html/home.html";
}


async function confirmar_compra() {
	try {
		const resposta_endereco = await fetch(`${URL}/endereco`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(await get_endereco())
		});
		if (!resposta_endereco.ok) {
			throw new Error("Erro ao comprar curso:\n" + resposta_endereco);
		}

		const resposta_compra = await fetch(`${URL}/compra`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(await get_compra())
		});
		if (!resposta_compra.ok) {
			throw new Error("Erro ao comprar curso:\n" + resposta_compra);
		}

		mostrar_sucesso();

	} catch (err) {
		if (err instanceof Response) {
			const texto = await err.text();
			mostrar_erro(texto);
		} else {
			mostrar_erro(err);
		}
	}
}


async function get_compra() {
	const usuario = await get_usuario();

	return {
		"id_aluno": usuario.id,
		"metodo": document.getElementById("metodo").value,
		"desconto": 0,
	}
}


async function get_endereco() {
	let endereco = {};
	let ids = [
		"pais",
		"estado",
		"cidade",
		"bairro",
		"logradouro",
		"numero",
		"complemento",
		"cep"
	];

	for (const id of ids) {
		let elemento = document.getElementById(id);
		let valor = elemento.value;
		endereco[id] = valor;
	}

	const usuario = await get_usuario();
	endereco["id_aluno"] = usuario.id;

	return endereco;
}


async function get_usuario() {
	const email = document.getElementById("email").value;
	const res = await fetch(`${URL}/me`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email })
	});

	if (res.ok) {
		const data = await res.json();
		console.log(data);
		console.log("Usuário logado:", data.user);
	} else {
		console.log("Não autenticado");
	}
}


async function configurar_estados() {
	const select_estado = document.getElementById("estado");
	select_estado.innerHTML = `<option value="">Carregando estados</option>`;
	select_estado.disabled = true;

	select_estado.addEventListener("change", (event) => {
		on_estado_changed(select_estado.value);
	});

	try {
		const estados = await get_estados();
		select_estado.innerHTML = `<option value="">Selecione um estado</option>`;

		select_estado.disabled = false;

		estados.sort((a, b) => a.nome.localeCompare(b.nome));
		for (const estado of estados) {
			const option = document.createElement("option");

			option.value = estado.sigla;
			option.textContent = estado.nome;

			select_estado.appendChild(option);
		};
	} catch(err) {
		select_estado.innerHTML = `<option value="">Erro ao carregar estados</option>`;
	}
}


async function configurar_cidades() {
	const select_cidade = document.getElementById("cidade");
	
	select_cidade.innerHTML = `<option value="">Selecione um estado primeiro</option>`;
	select_cidade.disabled = true;

	select_cidade.addEventListener("change", (event) => {
		on_cidade_changed(select_cidade.value);
	});
}


async function on_estado_changed(estado) {
	console.log("Estado: " + estado);

	const select_cidade = document.getElementById("cidade");
	select_cidade.disabled = true;

	if (estado == "") {
		console.log("Estado inválido");

		select_cidade.innerHTML = `<option value="">Selecione um estado primeiro</option>`;

		return;
	}

	try {
		const cidades = await get_cidades(estado);
		select_cidade.innerHTML = `<option value="">Selecione uma cidade</option>`;

		select_cidade.disabled = false;

		cidades.sort((a, b) => a.nome.localeCompare(b.nome));
		for (const cidade of cidades) {
			const option = document.createElement("option");

			option.value = cidade.id;
			option.textContent = cidade.nome;

			select_cidade.appendChild(option);
		};
	} catch (err) {
		select_cidade.innerHTML = `<option value="">Erro ao carregar cidades</option>`;
	}
}


async function on_cidade_changed() {
	const select_cidade = document.getElementById("cidade");
	const id_cidade = select_cidade.value;

	console.log("ID Cidade: " + id_cidade);

	const select_bairro = document.getElementById("bairro");

	const cidade_valida = id_cidade == "";
	if (cidade_valida) {
		select_bairro.innerHTML = `<option value="">Selecione um </option>`;
	}
}


async function get_estados() {
	const resposta = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
	const resultado = await resposta.json();

	return resultado;
}


async function get_cidades(estado) {
	const resposta = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`);
	const resultado = await resposta.json();

	return resultado;
}


function mostrar_erro(err) {
	const texto_erro = "Falha ao comprar curso!";

	popup.definir_tipo_popup(0);
	popup.definir_texto_popup("Erro!", texto_erro + "\n\n" + err);

	popup.abrir_popup();
}


function mostrar_sucesso() {
	const texto_sucesso = "Curso adquirido com sucesso!\n\nA compra foi realizada com sucesso e você já pode acessar as aulas utilizando a sua conta Academia da Palavra.";

	popup.definir_tipo_popup(1);
	popup.definir_texto_popup("Sucesso!", texto_sucesso);

	popup.abrir_popup();
}