// back button
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', goToMainMenuPage);

function goToMainMenuPage(){
	window.location.href = 'main_menu.html';
}


// login button
const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', login);

// username
const username = document.getElementById('username');
// password
const password = document.getElementById('password');

// function for login
function login(){
	var userName = username.value;
	var passWord = password.value;

	//console.log(userName)
	//console.log(passWord)
}

// forget password link
const forgetPassword = document.getElementById('forgetPassword');
forgetPassword.addEventListener('click', forgetPasswordPage);

function forgetPasswordPage(){
	window.location.href = 'forgot_password.html';
}