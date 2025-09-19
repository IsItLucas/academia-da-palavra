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

// Exibir atividades de uma aula
async function exibir_atividades(aulaId = 1) {
    const container = document.getElementById("atividades-container");
    container.innerHTML = "<p>Carregando atividades...</p>";

    try {
        const resposta = await fetch(`http://localhost:3000/atividades?aula=${aulaId}`);
        if (!resposta.ok) throw new Error("Erro ao buscar atividades no servidor.");
        const atividades = await resposta.json();

        container.innerHTML = "";

        if (atividades.length === 0) {
            container.innerHTML = "<p>Não há atividades cadastradas para esta aula.</p>";
            return;
        }

        const form = document.createElement('form');
        form.id = 'form-atividades';

        atividades.forEach((atividade, index) => {
            const div = document.createElement('div');
            div.classList.add('atividade');

            div.innerHTML = `
                <label for="atividade_${atividade.id}"><strong>Exercício ${index + 1}:</strong> ${atividade.pergunta}</label><br>
                <input type="text" id="atividade_${atividade.id}" name="atividade_${atividade.id}" data-resposta="${atividade.resposta}">
            `;

            form.appendChild(div);
        });

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = "Enviar Respostas";
        btn.addEventListener('click', checarRespostas);
        form.appendChild(btn);

        container.appendChild(form);

    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Erro ao carregar atividades. Tente novamente mais tarde.</p>";
    }
}

function checarRespostas() {
    const inputs = document.querySelectorAll('#form-atividades input');
    let resultadoHTML = '';

    inputs.forEach(input => {
        const respostaCorreta = input.dataset.resposta.trim().toLowerCase();
        const valorUsuario = input.value.trim().toLowerCase();

        if (valorUsuario.localeCompare(respostaCorreta, 'pt', { sensitivity: 'base' }) === 0) {
            resultadoHTML += `<p class="correto">${input.previousElementSibling.textContent} ✅ Correto!</p>`;
        } else {
            resultadoHTML += `<p class="incorreto">${input.previousElementSibling.textContent} ❌ Incorreto! Resposta correta: "${input.dataset.resposta}"</p>`;
        }
    });

    document.getElementById('resultado').innerHTML = resultadoHTML;
}


// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById("atividades-container");
    const aulaId = container.dataset.aula || 1;
    // exibir_atividades(aulaId);
});

