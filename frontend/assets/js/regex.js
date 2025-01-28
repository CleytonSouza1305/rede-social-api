export function validateName(txt, errorElement) {
    if (!txt.match(/^[a-zA-ZÀ-ÿ\s]{3,}$/)) {
        errorElement.textContent = 'O nome precisa ser maior que 3 letras.'
        return false
    } else {
        errorElement.textContent = ''
        return true
    }
}

export function validateEmail(txt, errorElement) {
    if (!txt.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errorElement.textContent = 'Por favor, insira um e-mail válido.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

export function validatePassword(txt, errorElement) {
    if (!txt.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
        errorElement.textContent = 'A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}
