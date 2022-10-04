// back button
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', goToMainMenuPage);

function goToMainMenuPage(){
	window.location.href = 'main_menu.html';
}

// get Username, Real Name, Teacher, password, re-enter password elements
// Do some checks before going to character_select.html

// next button
const nextButton = document.getElementById('nextButton');
nextButton.addEventListener('click', goToCharacterSelect);

function goToCharacterSelect(){
	// do some checks here...


	window.location.href = 'character_select.html';
}