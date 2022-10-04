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
const emailInput = document.getElementById('emailInput');

// forgot password function
function forgotPassword(){
	//var test = emailInput.value;
	//console.log(test)
}