// Initialise boostrap tooltips on this page
// https://getbootstrap.com/docs/5.2/components/tooltips/
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
return new bootstrap.Tooltip(tooltipTriggerEl)
})


// back button
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', goToMainMenuPage);

function goToMainMenuPage(){
	window.location.href = 'main_menu.html';
}

// get Username, Real Name, Teacher, password, re-enter password elements
let usernameElement = document.getElementById('username');
let realnameElement = document.getElementById('realname');
let emailElement = document.getElementById('email');
let teacherElement = document.getElementById('teacher');
let passwordElement = document.getElementById('password');
let reenterpasswordElement = document.getElementById('reenterpassword');
var selectedCharacter = document.getElementById('selectedCharacter');
var displayCharacter = document.getElementById('displayCharacter')

let characterOne = document.getElementById('character-1');
let characterTwo = document.getElementById('character-2');
let characterThree = document.getElementById('character-3');
let characterFour = document.getElementById('character-4');
var characterDescription = document.getElementById('description');

selectedCharacter.addEventListener('change', function(){changePic(selectedCharacter.value)});

function changePic(characterValue){
	if(!characterValue){
		displayCharacter.width = "0";
		displayCharacter.height = "0";
		characterDescription.innerHTML = ""
		characterDescription.style.border = "0px"
		return;
	}

	displayCharacter.width = "95";
	displayCharacter.height = "135";
	characterDescription.style.border = "1px solid black";

	if(characterValue == 1){
		displayCharacter.src = "images/guan_yu.PNG";
		guanyuDescribe();
	}else if(characterValue == 2){
		displayCharacter.src = "images/huang_zhong.PNG";
		huangzhongDescribe();
	}else if(characterValue == 3){
		displayCharacter.src = "images/wei_yan.PNG"
		weiyanDescribe();
	}else if(characterValue == 4){
		displayCharacter.src = "images/zhao_yun.PNG"
		zhaoyunDescribe();
	}
}

function guanyuDescribe(){
	characterDescription.innerHTML = "This is a description about Guan Yu"
}

function huangzhongDescribe(){
	characterDescription.innerHTML = "This is a description about Huang Zhong"
}

function weiyanDescribe(){
	characterDescription.innerHTML = "This is a description about Wei Yan"
}

function zhaoyunDescribe(){
	characterDescription.innerHTML = "This is a description about Zhao Yun"
}

// register button
const registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', register);

function register(){
	var userName = usernameElement.value
	var realName = realnameElement.value
	var email = emailElement.value
	var password = passwordElement.value
	var reenterpassword = reenterpasswordElement.value
	var teacher = teacherElement.value
	var character = selectedCharacter.value

	var resp = document.getElementById("response"); //response element to show messages

	// check empty fields
	if(!userName || !realName || !email || !password || !reenterpassword || !character || !teacher){
		alert("Please fill in all the fields");
		return;
	}

	// check if password == reenterpassword
	if(password != reenterpassword){
		alert("Passwords do not match!")
		return;
	}

	// Include backend stuff here
	// AJAX allows you to send variables from JS (frontend) to PHP (backend) without having to load a new page on the user end. 
    // The below structure is standard for AJAX requests
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        // On success
        if (this.readyState == 4 && this.status == 200) {
            // Do something with the response
            console.log(this.responseText);

            // The login script has the following possible outputs: ints 0, 1 or 2, so we'll translate that over to the frontend once the response code is received.
            // var resp = document.getElementById("response");
            if(this.responseText.includes(0)){
				alert("Registration successful!");
				//resp.innerHTML = "Registration successful!";
			}
            if(this.responseText.includes(1)) resp.innerHTML = "Email is taken";
            if(this.responseText.includes(2)) resp.innerHTML = "Username is taken";
			if(this.responseText.includes(3)) resp.innerHTML = "invalid teacher";
            if(this.responseText.includes(4)) resp.innerHTML = "invalid characters";
			if(this.responseText.includes(5)) resp.innerHTML = "A server error occurred.";
            if(this.responseText.includes(6)) resp.innerHTML = "invalid email format";
			if(this.responseText.includes(7)) resp.innerHTML = "Invalid username format!";
            if(this.responseText.includes(8)) resp.innerHTML = "Invalid password format!";
        }
    };
    // We can send GET or POST requests but it's better to send sensitive details like password with POST, so it won't be revealed on user's browsing history. 
    // Example GET URI: https://example.com/target_script?username=test&password=abc123
    // Example POST URI: https://example.com/target_script
    // The target filepath of the script you want to send the variables to is specified here. 
    xmlhttp.open("POST", "../scripts/function_createAccount", true);
    // Request headers required for a POST request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // Send the variables here. We'll omit the teacher id since it's not needed on the login script
    xmlhttp.send(`username=${userName}&name=${realName}&email=${email}&password=${password}&teacher_id=${teacher}&character=${character}`);
}