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
	var resp = document.getElementById("response"); //response element to show messages

	var email = emailElement.value;
	console.log("email: " + email);

	if(!email){
		resp.innerHTML = "Email is empty!";
		return;
	}

	//backend stuff for forget password
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        // On success
        if (this.readyState == 4 && this.status == 200) {
            // Do something with the response
            console.log(this.responseText);

            if(this.responseText.includes(0)) resp.innerHTML = "Please check your email to reset your password";
            if(this.responseText.includes(1)) resp.innerHTML = "Email address not found!";
			if(this.responseText.includes(2)) resp.innerHTML = "Server Error";
			if(this.responseText.includes(3)) resp.innerHTML = "Reset Password failed";
        }
    };
    // The target filepath of the script you want to send the variables to is specified here. 
    xmlhttp.open("POST", "../scripts/function_forgetPassword", true);
    // Request headers required for a POST request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`email=${email}`);

}