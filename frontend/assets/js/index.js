const userName = document.getElementById('userName')
const password = document.getElementById('password')
const email = document.getElementById('email')

const registerUser = async (ev) => {
  ev.preventDefault()

  const newUser = {
    userName: userName.value,
    password: password.value,
    email: email.value
  }

  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    console.clear()
    const errorTxt = document.querySelector('.error-text')
    errorTxt.classList.add('display')
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro desconhecido')
    }
  } catch (error) {
    const errorTxt = document.querySelector('.error-text')
    errorTxt.textContent = error.message
    errorTxt.classList.remove('display')
    console.error(`Erro ao registrar usuário, motivo: ${error.message}`)
  }
}

const formRegister = document.getElementById('form-register')
formRegister.addEventListener('submit', registerUser)


