document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const body = document.body;

    // --- Carregar preferência do modo escuro ---
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }

    // Botão modo escuro
    const darkModeBtn = document.createElement('button');
    darkModeBtn.type = 'button';
    darkModeBtn.textContent = body.classList.contains('dark-mode') ? '☀️ Modo Claro' : '🌙 Modo Escuro';
    darkModeBtn.classList.add('dark-mode-btn');
    form.parentNode.insertBefore(darkModeBtn, form);

    darkModeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        darkModeBtn.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro';
    });

    // --- Submissão do formulário ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        if (!email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const resposta = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });

            if (!resposta.ok) {
                if (resposta.status === 401) {
                    alert("Email ou senha inválidos.");
                    return;
                }
                throw new Error("Falha ao conectar com o servidor.");
            }

            const dados = await resposta.json();

            alert(`Bem-vindo(a), ${dados.aluno.nome}!\nRedirecionando para o dashboard...`);

            setTimeout(() => {
                window.location.href = "zona_de_aulas.html";
            }, 2000);

        } catch (erro) {
            console.error(erro);
            alert("Erro ao conectar com o servidor.");
        }
    });
});
