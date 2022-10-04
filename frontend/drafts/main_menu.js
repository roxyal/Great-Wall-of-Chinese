const playButton = document.getElementById('playButton');
playButton.addEventListener('click', goToLoginPage);

function goToLoginPage(){
	//console.log("test")
	window.location.href = 'login.html';
}


const registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', goToRegisterPage);

function goToRegisterPage(){
	window.location.href = 'registration.html';
}