export function definir_velocidade_do_elemento(element, multiplicador = 1) {
	element = document.getElementById(element);

	if (!element) {
		console.error("Erro: Elemento não encontrado.");
		return;
	}

	window.addEventListener("scroll", () => {
		const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
		const headerScrollOffset = currentScrollTop * multiplicador;
		const translateYValue = currentScrollTop - headerScrollOffset;

		element.style.transform = `translateY(${translateYValue}px)`;
	});
}