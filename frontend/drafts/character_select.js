// back button
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', goToRegistrationPage);

function goToRegistrationPage(){
	window.location.href = 'registration.html';
}



// register button
const registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', register);

function register(){
	// get character selection
	// need to get all the info in the previous page
}