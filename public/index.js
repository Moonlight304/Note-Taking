const login = document.querySelector('.login');
const signup = document.querySelector('.signup');
const toLogin = document.querySelector('#toLogin');
const toSignup = document.querySelector('#toSignup');

document.addEventListener('DOMContentLoaded', () => {
    signup.style.display = "none";
})

toLogin.addEventListener('click', () => {
    login.style.display = "block";
    signup.style.display = "none";
})

toSignup.addEventListener('click', () => {
    signup.style.display = "block";
    login.style.display = "none";
})