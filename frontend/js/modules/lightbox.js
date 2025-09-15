export function abrir_lightbox(img_element) {
	let lightbox = document.getElementById("lightbox");
	let lightboxImg = document.getElementById("lightbox-img");

	lightboxImg.src = img_element.src;
	lightbox.style.display = "flex";
}


export function fechar_lightbox() {
	document.getElementById("lightbox").style.display = "none";
}