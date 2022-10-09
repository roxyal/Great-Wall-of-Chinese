// back button
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', goToMainMenuPage);

function goToMainMenuPage(){
	window.location.href = 'main_menu.html';
}

// get Username, Real Name, Teacher, password, re-enter password elements
let usernameElement = document.getElementById('username');
let realnameElement = document.getElementById('realname');
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
	var password = passwordElement.value
	var reenterpassword = reenterpasswordElement.value

	var teacher = teacherElement.value
	var teacherInput = 0;

	var character = selectedCharacter.value
	var characterInput = 0;

	if(!userName || !realName || !password || !reenterpassword || !character){
		alert("Please fill in all the fields");
		return;
	}

	if(password != reenterpassword){
		alert("Passwords do not match!")
		return;
	}

	// change teacher input to integer
	if(teacher == "Mrs. Tan"){
		teacherInput = 1;
	}else if(teacher == "Mr. Lim"){
		teacherInput = 2;
	}else{
		teacherInput = 3;
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

	// Include backend stuff here
}