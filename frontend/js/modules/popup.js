window.addEventListener("DOMContentLoaded", on_load);


window.fechar_popup = fechar_popup;


const POPUP_ERRO = 0;
const POPUP_SUCESSO = 1;


function on_load() {
	criar_popup_overlay();
}


export function criar_popup_overlay() {
	document.getElementById("body").insertAdjacentHTML("beforeend", `
		<span class="popup-overlay" id="popup-overlay"></span>

		<div class="popup" id="popup">
			<img src="../img/ui/check.png" alt="Check Mark" id="imagem-popup">

			<div class="popup-conteudo">
				<h1 id="titulo-popup">Sucesso!</h1>
				<p id="mensagem-popup">Notícia adicionada com sucesso ao banco de dados!</p>
			</div>

			<button onclick="fechar_popup()">OK</button>
		</div>
	`);
}


export function abrir_popup() {
	const popup = document.getElementById("popup");
	popup.classList.add("open");

	const overlay = document.getElementById("popup-overlay");
	overlay.classList.add("open");
}


export function fechar_popup() {
	const popup = document.getElementById("popup");
	popup.classList.remove("open");

	const overlay = document.getElementById("popup-overlay");
	overlay.classList.remove("open");
}


export function definir_texto_popup(titulo, mensagem) {
	const elemento_titulo = document.getElementById("titulo-popup");
	elemento_titulo.innerText = titulo;

	const elemento_mensagem = document.getElementById("mensagem-popup");
	elemento_mensagem.innerText = mensagem;
}


export function definir_tipo_popup(tipo) {
	const img_sucesso = "../img/ui/check.png";
	const img_erro = "../img/ui/erro.png";

	const elemento_img = document.getElementById("imagem-popup");

	const popup = document.getElementById("popup");
	console.log(popup);
	popup.classList.remove("sucesso");
	popup.classList.remove("erro");

	if (tipo == POPUP_ERRO) {
		elemento_img.src = img_erro;
		popup.classList.add("erro");
	}
	if (tipo == POPUP_SUCESSO) {
		elemento_img.src = img_sucesso;
		popup.classList.add("sucesso");
	}
}