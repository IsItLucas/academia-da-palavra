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

// Buscar e exibir atividades
async function exibir_atividades() {
    const container = document.getElementById("atividades-container");
    container.innerHTML = "<p>Carregando atividades...</p>";

    try {
        const resposta = await fetch("http://localhost:3000/atividades");
        if (!resposta.ok) throw new Error("Erro ao buscar atividades no servidor.");
        const atividades = await resposta.json();

        container.innerHTML = ""; // limpa antes de adicionar

        atividades.forEach(atividade => {
            const section = document.createElement('section');
            section.classList.add('atividade');

            const titulo = document.createElement('h2');
            titulo.textContent = atividade.titulo;

            const descricao = document.createElement('p');
            descricao.textContent = atividade.descricao;

            const button = document.createElement('button');
            button.textContent = "Fazer Atividade";
            button.addEventListener("click", () => abrirLightbox(atividade.link));

            section.appendChild(titulo);
            section.appendChild(descricao);
            section.appendChild(button);

            container.appendChild(section);
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Erro ao carregar atividades. Tente novamente mais tarde.</p>";
    }
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', exibir_atividades);
