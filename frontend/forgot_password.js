// back button
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', goToLoginPage);

function goToLoginPage(){
	window.location.href = 'login.html';
}


// submit button
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', forgotPassword);

// email input
var emailElement = document.getElementById('emailInput');

// forgot password function
function forgotPassword(){
	var email = emailElement.value;
	console.log(email);

	if(!email){
		alert("Email is empty!")
		return;
	}

	//backend stuff for forget password
}