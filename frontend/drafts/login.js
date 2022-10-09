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

	if(!userName || !passWord){
		alert("username or password is empty!")
		return;
	}

	//backend stuff for login
}

// forget password
const forgetPassword = document.getElementById('forgetPassword');
forgetPassword.addEventListener('click', forgetPasswordPage);

function forgetPasswordPage(){
	window.location.href = 'forgot_password.html';
}