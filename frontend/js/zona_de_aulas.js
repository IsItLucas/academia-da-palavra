// Alternar tema claro/escuro
function alternar_tema() {
    document.body.classList.toggle('dark-theme');
}

// Abrir lightbox (iframe ou imagem)
function abrirLightbox(link) {
    const lightbox = document.getElementById("lightbox");
    lightbox.innerHTML = '<span class="fechar" onclick="fecharLightbox()">&times;</span>';

    if (link.endsWith('.html')) {
        const iframe = document.createElement('iframe');
        iframe.src = link;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        lightbox.appendChild(iframe);
    } else {
        const img = document.createElement('img');
        img.src = link;
        lightbox.appendChild(img);
    }

    lightbox.style.display = "flex";
}

function fecharLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.display = "none";
    lightbox.innerHTML = '<span class="fechar" onclick="fecharLightbox()">&times;</span><img id="lightbox-img" src="">';
}

// Buscar e exibir aulas
async function exibir_aulas() {
    const container = document.getElementById("aulas-container");
    container.innerHTML = "<p>Carregando aulas...</p>";

    try {
        const resposta = await fetch("http://localhost:3000/aulas");
        if (!resposta.ok) throw new Error("Erro ao buscar aulas no servidor.");
        const aulas = await resposta.json();

        container.innerHTML = ""; // limpa antes de adicionar

        aulas.forEach(aula => {
            const section = document.createElement('section');
            section.classList.add('lesson');

            const titulo = document.createElement('h2');
            titulo.textContent = aula.titulo;

            const descricao = document.createElement('p');
            descricao.textContent = aula.descricao;

            const button = document.createElement('button');
            button.textContent = "Assistir Aula";
            button.addEventListener("click", () => abrirLightbox(aula.link));

            section.appendChild(titulo);
            section.appendChild(descricao);
            section.appendChild(button);

            container.appendChild(section);
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Erro ao carregar aulas. Tente novamente mais tarde.</p>";
    }
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', exibir_aulas);
