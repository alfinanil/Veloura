const form = document.querySelector('#login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const showPassword = document.querySelector('#show-password');
const eyeButton = document.querySelector('#toggle-password');
const message = document.querySelector('#login-message');

// Tampilkan / sembunyikan password
function setPasswordVisible(visible) {
    passwordInput.type = visible ? 'text' : 'password';
    showPassword.checked = visible;
}

// Event: centang "Show password"
showPassword.addEventListener('change', () => {
    setPasswordVisible(showPassword.checked);
});

// Event: klik ikon mata
eyeButton.addEventListener('click', () => {
    setPasswordVisible(passwordInput.type === 'password');
});

// Event: submit form
form.addEventListener('submit', (event) => {
    event.preventDefault(); // cegah halaman reload

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    message.className = 'login-message error';

    if (email === '' || password === '') {
        message.textContent = 'Email dan password wajib diisi.';
        return;
    }

    if (!email.includes('@')) {
        message.textContent = 'Format email tidak valid.';
        return;
    }

    if (password.length < 6) {
        message.textContent = 'Password minimal 6 karakter.';
        return;
    }

    message.className = 'login-message success';
    message.textContent = 'Login berhasil! Mengalihkan ke beranda...';

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});