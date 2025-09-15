window.addEventListener("DOMContentLoaded", on_load);


const dark_theme_item = "dark-theme";


function on_load() {
	const dark_theme_status = localStorage.getItem(dark_theme_item);
	if (dark_theme_status === "true") {
		alternar_tema();
	}
}


export function alternar_tema() {
	const body = document.body;
	body.classList.toggle(dark_theme_item);

	localStorage.setItem(dark_theme_item, body.classList.contains(dark_theme_item));
}