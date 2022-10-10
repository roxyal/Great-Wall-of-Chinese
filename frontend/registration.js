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

let characterOne = document.getElementById('character-1');
let characterTwo = document.getElementById('character-2');
let characterThree = document.getElementById('character-3');
let characterFour = document.getElementById('character-4');
var selectedCharacter = document.getElementById('selectedCharacter');
var characterDescription = document.getElementById('description');

characterOne.addEventListener('click', function(){selectCharacter(characterOne.value)});
characterOne.addEventListener('click', function(){guanyuDescribe()});


characterTwo.addEventListener('click', function(){selectCharacter(characterTwo.value)});
characterTwo.addEventListener('click', function(){huangzhongDescribe()});

characterThree.addEventListener('click', function(){selectCharacter(characterThree.value)});
characterThree.addEventListener('click', function(){weiyanDescribe()});

characterFour.addEventListener('click', function(){selectCharacter(characterFour.value)});
characterFour.addEventListener('click', function(){zhaoyunDescribe()});


function selectCharacter(characterName){
	selectedCharacter.value = characterName;
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
	var characterInput;

	// check empty fields
	if(!userName || !realName || !email || !password || !reenterpassword || !character){
		alert("Please fill in all the fields");
		return;
	}

	// check if password == reenterpassword
	if(password != reenterpassword){
		alert("Passwords do not match!")
		return;
	}

	// change character input to integer
	if(character == "Guan Yu"){
		characterInput = 1;
	}else if(character == "Huang Zhong"){
		characterInput = 2;
	}else if(character == "Wei Yan"){
		characterInput = 3;
	}else{
		characterInput = 4;
	}

	console.log(userName);
	console.log(realName);
	console.log(email);
	console.log(teacher)
	console.log(password);
	console.log(reenterpassword);
	console.log(characterInput);

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
				alert("Account has been created!");
				//resp.innerHTML = "Registration successful!";
			}
            if(this.responseText.includes(1)) alert("Email is taken");
            if(this.responseText.includes(2)) alert("Username is taken");
			if(this.responseText.includes(3)) alert("invalid teacher");
            if(this.responseText.includes(4)) alert("invalid characters");
			if(this.responseText.includes(5)) alert("A server error occurred.");
            if(this.responseText.includes(6)) alert("invalid email format");
			if(this.responseText.includes(7)) alert("Invalid username format");
            if(this.responseText.includes(8)) alert("Invalid password format!");
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
    xmlhttp.send(`username=${userName}&name=${realName}&email=${email}&password=${password}&teacher_id=${teacher}&character=${characterInput}`);
}