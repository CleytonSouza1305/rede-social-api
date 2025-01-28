import { validateEmail, validateName, validatePassword } from "./regex.js"

async function createUser() {
  const globalErrorText = document.querySelector('.error-text');

  const nameInput = document.getElementById('userName');
  const nameError = document.getElementById('nameError');

  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');

  const passwordInput = document.getElementById('password');
  const passwordError = document.getElementById('passwordError');

  const nameRegex = validateName(nameInput.value, nameError);
  const emailRegex = validateEmail(emailInput.value, emailError);
  const passwordRegex = validatePassword(passwordInput.value, passwordError);

  try {
    if (nameRegex && emailRegex && passwordRegex) {
      const newUser = {
        userName: nameInput.value,
        password: passwordInput.value,
        email: emailInput.value,
      };

      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
      }

      globalErrorText.textContent = 'Usuário registrado com sucesso!';
      globalErrorText.style.color = 'green';
      globalErrorText.classList.remove('display');

      nameInput.value = '';
      emailInput.value = '';
      passwordInput.value = '';
    }
  } catch (error) {
    globalErrorText.textContent = error.message;
    globalErrorText.style.color = 'red';
    globalErrorText.classList.remove('display');
    console.error(`Erro ao registrar usuário, motivo: ${error.message}`);
  }
}

async function loginUser() {
  const globalErrorText = document.querySelector('.error-text');

  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');

  const passwordInput = document.getElementById('password');
  const passwordError = document.getElementById('passwordError');

  const emailRegex = validateEmail(emailInput.value, emailError);
  const passwordRegex = validatePassword(passwordInput.value, passwordError);

  try {
    if (emailRegex && passwordRegex) {
      const actualUser = {
        password: passwordInput.value,
        email: emailInput.value,
      };

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
      }

      const jwtToken = await response.json()
      localStorage.setItem('token', jwtToken.token)

      globalErrorText.textContent = 'Login feito com sucesso!';
      globalErrorText.style.color = 'green';
      globalErrorText.classList.remove('display');

      emailInput.value = '';
      passwordInput.value = '';

      window.location.href = '/frontend/assets/pages/feed.html'
    }
  } catch (error) {
    globalErrorText.textContent = error.message;
    globalErrorText.style.color = 'red';
    globalErrorText.classList.remove('display');
    console.error(`Erro ao fazer login, motivo: ${error.message}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const formTitle = document.getElementById('form-title');
  const authButton = document.getElementById('auth-button');
  const contentName = document.querySelector('.content-name');
  const haveAccount = document.getElementById('have-account');

  let formFormat = false; 

  const updateFormFormat = () => {
    if (formFormat) {
      formTitle.textContent = 'Entrar';
      authButton.textContent = 'Entrar';

      contentName.classList.add('display');
      haveAccount.innerHTML = 'Não possui uma conta? <a href="#" id="toggle-form">Registre-se</a>';

      const emailError = document.getElementById('emailError');
      const nameError = document.getElementById('nameError');
      const passwordError = document.getElementById('passwordError');

      nameError.textContent = ''
      emailError.textContent = ''
      passwordError.textContent = ''
    } else {
      formTitle.textContent = 'Registre-se';
      authButton.textContent = 'Registre-se';

      contentName.classList.remove('display');
      haveAccount.innerHTML = 'Já possui uma conta? <a href="#" id="toggle-form">Faça login</a>';

      const emailError = document.getElementById('emailError');
      const passwordError = document.getElementById('passwordError');

      emailError.textContent = ''
      passwordError.textContent = ''
    }

    document.getElementById('toggle-form').addEventListener('click', (event) => {
      event.preventDefault();
      formFormat = !formFormat; 
      updateFormFormat();
    });
  };

  updateFormFormat();

  authButton.addEventListener('click', (event) => {
    event.preventDefault(); 

    if (!formFormat) {
      createUser();
    } else {
      loginUser()
    }
  });
});
