document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoader = document.getElementById('btn-loader');

    // --- Theme Management ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
        } else {
            themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
        }
    }

    // --- Form Submission ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        // 1. Esconde a mensagem de erro sempre que o usuário tentar de novo
        errorMessage.classList.add('d-none');

        // 2. Nossa Validação Customizada
        if (!username || !password) {
            errorMessage.textContent = 'Please enter both username and password.';
            errorMessage.classList.remove('d-none'); // Mostra a caixa vermelha de erro
            return; // Para a execução aqui, não tenta fazer o login no servidor
        }

        // --- Se passou pela validação, continua com o Loading State ---
        loginBtn.disabled = true;
        btnText.textContent = 'Authenticating... ';
        btnLoader.classList.remove('d-none');

        try {
            // Requisição para o Node.js
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Success:', data);
                alert('Authentication successful!');
            } else {
                // Se o Node.js disser que a senha tá errada, mostra na nossa caixinha de erro também!
                errorMessage.textContent = data.message || 'Invalid credentials.';
                errorMessage.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'Failed to connect to the authentication server.';
            errorMessage.classList.remove('d-none');
        } finally {
            // Reset State
            loginBtn.disabled = false;
            btnText.textContent = 'Sign In';
            btnLoader.classList.add('d-none');
        }
    });
}); // <--- Era essa linha aqui que estava faltando no seu!