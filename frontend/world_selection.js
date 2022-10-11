const logOutElement = document.getElementById('logout')
logOutElement.addEventListener('click', logout);

function logout(){
	window.location.href = 'login.html';
}