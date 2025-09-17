document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastro');
    const senha = document.getElementById('senha');
    const confirmarSenha = document.getElementById('confirmar-senha');
    const toggleDarkBtn = document.getElementById('toggle-dark-mode');
    const body = document.body;
    const selectCurso = document.getElementById('curso');

    // --- Carregar cursos dinamicamente ---
    async function carregarCursos() {
        try {
            const resposta = await fetch("http://localhost:3000/cursos");
            const cursos = await resposta.json();

            cursos.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.id;
                option.textContent = curso.nome;
                selectCurso.appendChild(option);
            });
        } catch (erro) {
            console.error("Erro ao carregar cursos:", erro);
        }
    }

    carregarCursos();

    // --- Função de cadastro de usuário ---
    async function cadastrarUsuario(event) {
        event.preventDefault();

        // Limpar mensagens antigas
        const mensagensExistentes = form.querySelectorAll('.mensagem');
        mensagensExistentes.forEach(msg => msg.remove());

        if (senha.value !== confirmarSenha.value) {
            alert("As senhas não coincidem!");
            confirmarSenha.focus();
            return;
        }

        if (selectCurso.value === "") {
            alert("Por favor, selecione um curso!");
            selectCurso.focus();
            return;
        }

        const usuario = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            data_nascimento: document.getElementById('data-nascimento').value,
            senha: senha.value,
            id_curso: selectCurso.value
        };

        try {
            const resposta = await fetch("http://localhost:3000/aluno", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });

            if (!resposta.ok) throw new Error("Erro ao cadastrar usuário");

            // Mensagem de verificação
            let mensagem = document.createElement('p');
            mensagem.textContent = "Usuário cadastrado e será matriculado no curso...";
            mensagem.classList.add('mensagem');
            mensagem.style.marginTop = "20px";
            mensagem.style.fontWeight = "bold";
            mensagem.style.color = "#00796b";
            form.appendChild(mensagem);

            // Desabilitar botão
            form.querySelector('button[type="submit"]').disabled = true;

            // Redirecionar após 3 segundos
            setTimeout(() => {
                window.location.href = "login.html";
            }, 3000);

            // Limpar formulário
            form.reset();

        } catch (erro) {
            console.error(erro);
            alert("Falha ao cadastrar usuário.");
        }
    }

    // --- Submeter formulário ---
    form.addEventListener('submit', cadastrarUsuario);

    // --- Modo Escuro ---
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }

    toggleDarkBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
    });
});
