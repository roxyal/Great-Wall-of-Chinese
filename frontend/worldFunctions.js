// script to be used by all 3 worlds: idiomsWorld.html, hanyuPinyinWorld.html, blanksWorld.html

// to be commented
var pvpModal = new bootstrap.Modal(document.getElementById('pvpMode-modal'), {});
pvpModal.show();
// var adventureModal = new bootstrap.Modal(document.getElementById('adventureMode-modal'), {});
// adventureModal.show();

// global variables
var characterID; // character ID
var characterUserName; // character username

var selectedAdventureSection; 	// the section selected by user to attempt adventure mode in: lower pri/upper pri
var adventureModeProgress; 		// progress in terms of percentage, starts at 0%
var adventureModeQnCorrect; 	// num of questions correct, starts at 0
var adventureModeQnAttempted; 	// num of questions attempted, starts at 0
var adventureModeCurrentQn; 	// current question number, starts at 1

var assignmentModeProgress; 	// progress in terms of percentage, starts at 0%
var assignmentModeQnCorrect; 	// num of questions correct, starts at 0
var assignmentModeQnAttempted; 	// num of questions attempted, starts at 0
var assignmentModeCurrentQn; 	// current question number, starts at 1

var assignmentToAttempt; // details of assignment to display on the modal

var questionQueue;

function acceptInvitation(sender){
    socket.send('/accept ' + sender);
}
function rejectInvitation(sender){
    socket.send('/reject ' + sender);
}

function getLoggedInCharacter() {
  return new Promise(function(resolve) {
	  var xmlhttp = new XMLHttpRequest();
	  xmlhttp.onreadystatechange = function() {
		  if (this.readyState == 4 && this.status == 200) {
			  console.log("response" + this.responseText);
			  resolve(this.responseText);
		  }
	  };
	  xmlhttp.open("GET", "../scripts/functions_utility?func=Character");
	  xmlhttp.send();
  })
}

async function getCharacterID(){
  console.log('calling backend script')
  const getcharacterID = await getLoggedInCharacter();
  characterID = getcharacterID;
  console.log(characterID);

}

function getLoggedInUsername() {
  return new Promise(function(resolve) {
	  var xmlhttp = new XMLHttpRequest();
	  xmlhttp.onreadystatechange = function() {
		  if (this.readyState == 4 && this.status == 200) {
			  resolve(this.responseText);
		  }
	  };
	  xmlhttp.open("GET", "../scripts/functions_utility?func=Username");
	  xmlhttp.send();
  })
}

async function getCharacterName(){
  console.log('calling backend script')
  const getcharacterUsername = await getLoggedInUsername();
  characterUserName = getcharacterUsername;
  console.log(characterUserName);

}

getCharacterID(); // call function to get characterID
getCharacterName(); // call function to get character username





// LEADER BOARD

let leaderBoardModal = document.getElementById('leaderboard-modal');
leaderBoardModal.addEventListener('show.bs.modal', function (event){
	var adventureMode = document.getElementById('adventureModeLeaderBoard'); // Table body for adventure mode leaderboard
	var pvpMode = document.getElementById('pvpModeLeaderBoard');  // Table body for pvp mode leaderboard
	var rowAdventure = "";
	var rowPvp = "";

	//link backend here to get leaderboard details
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200){
			// the viewLeaderBoard has three possible output 1,2 and string (Adventure&PVP)
			//1 represents account_id cannot be found, 2 represents server error
			
			if (this.responseText.length > 2){
				
				// This is an example of the string of information for Adventure/PVP leaderboard
				// 1,Kelvin,85.0000|2,Kelly,67.5000|3,kyrin,55.7143*1,kyrin,Bling Bling,1000|2,Kelvin,Bronze,50|3,Kelly,Bronze,50
				
				// We then split the string into an array
				// WE use (*) to spit the leaderboard to Adventure and PVP
				// leaderBoardArray[0] represents Adventure LeaderBoard
				// leaderBoardArray[1] represents PVP LeaderBoard
				leaderBoardArray = this.responseText.split("*");
				adventureLeaderBoard = leaderBoardArray[0];
				pvpLeaderBoard = leaderBoardArray[1];
				
				// Printing Adventure on the HTML
				// Example of adventureLeaderBoard string
				// 1,Kelvin,85.0000|2,Kelly,67.5000|3,kyrin,55.7143
				
				// We use (|) to split the individual's information
				// Therefore, you can see that each element of the array is a player's info
				// Example of adventureLeaderBoardArray
				// ['1,Kelvin,85.0000', '2,Kelly,67.5000', '3,kyrin,55.7143']
				// Check to see if the adventureLeaderBoard is an empty list
                                if (adventureLeaderBoard.length !== 0){
                                    adventureLeaderBoardArray = adventureLeaderBoard.split("|");
                                    for(i=0;i<adventureLeaderBoardArray.length;i++){
					// rowAdventure = '<tr>';
					
					// We use (,) to split again, to obtain respestive columns player's information
					// [Position, Name, Accuracy]
					// ['1', 'Kelvin', '85.0000']
					student_info = adventureLeaderBoardArray[i].split(",");
					let rank = student_info[0];
					let name = student_info[1];
					let accuracy = (Math.round(student_info[2] * 100) / 100).toFixed(2)

					rowAdventure += `<tr>
										<td>` + rank + `</td>
										<td>` + name + `</td>
										<td>` + accuracy + `</td>
									</tr>`
					
					// for(j=0;j<student_info.length;j++){
					// 	if (j===student_info.length-1){
					// 		rowAdventure += '<td>' + (Math.round(student_info[j] * 100) / 100).toFixed(2) + '%' + '</td>';
					// 	}
					// 	else {
					// 		rowAdventure += '<td>' + student_info[j] + '</td>';
					// 	}
					// }
					// rowAdventure += '</tr>';
                                    }
                                    adventureMode.innerHTML  = rowAdventure; //set innerhtml code
                                }
				
				// Printing PVP on the HTML
				// Example of pvpLeaderBoard string
				// 1,kyrin,Bling Bling,1000|2,Kelvin,Bronze,50|3,Kelly,Bronze,50
				
				// Similar to adventureMode's LeaderBoard we use 
				// We use (|) to split the individual's information
				// Therefore, you can see that each element of the array is a player's info
				// Example of pvpLeaderBoardArray
				// ['1,kyrin,Bling Bling,1000', '2,Kelvin,Bronze,50', '3,Kelly,Bronze,50\n']
				// Check to see if the pvpLeaderBoard is an empty list
                                if (pvpLeaderBoard.length !== 0){
                                    pvpLeaderBoardArray = pvpLeaderBoard.split("|");
                                    for(i=0;i<pvpLeaderBoardArray.length;i++){
					rowPvp = rowPvp + '<tr>';
					
					// We use (,) to split again, to obtain respestive columns player's information
					// [Position, Name, Rank, Rank Points]
					// ['1', 'kyrin', 'Bling Bling', '1000']
					student_info = pvpLeaderBoardArray[i].split(",");
					for(j=0;j<student_info.length;j++){
						rowPvp += '<td>' + student_info[j] + '</td>';
					}
					rowPvp += '</tr>';
                                    }
                                    pvpMode.innerHTML  = rowPvp; //set innerhtml code
                                }
                        }
			if(this.responseText === 1 && this.responseText === "1"){
				console.log("Account_id cannot be detected!");
			}
			if(this.responseText === 1 && this.responseText === "2"){
				console.log("A server error occurred</div>");
			}
		}   
	};
	xmlhttp.open("POST", "../scripts/function_viewLeaderBoard", true);
	// Request headers required for a POST request
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(`function_name=${"viewLeaderBoard"}`);
})




// CUSTOM LEVEL

// Saving custom level
function saveCustomLevel(){
    let emptyFields = false;
    let customLevelName = document.getElementById("customLevelName").value;
    
    // A string variable use to concatenate each question type and difficulty
    let question_type_difficulty = "";
    
    if(!customLevelName){
      emptyFields = true;
    }
    let allQuestions = document.querySelectorAll("[name='questionType']");
    let allDifficulty = document.querySelectorAll("[name='difficulty']");
    for(let i=0; i<allQuestions.length; i++){
      if(!allQuestions[i].value||!allDifficulty[i].value){
        emptyFields=true;
        break;
      }
      question_type_difficulty = question_type_difficulty + allQuestions[i].value + ',' + allDifficulty[i].value
      if (i+1 != allQuestions.length)
            question_type_difficulty = question_type_difficulty + '|';
    }
    if(emptyFields){
  		document.getElementById('response').innerHTML = `<div class="alert alert-danger my-2" role="alert">Please fill in all the fields!</div>`
    }else{
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                // Do something with the response
                console.log(this.responseText);
                // the saveCustomLevel has four possible output 0,1,2,3,4
                // 0 represents success, 1 represents account_id cannot be found, 2 represents server error
                // 3 represents the length of customGameName is less than 2 letters.
                // 4 represente server error
                if(this.responseText.includes(0)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-success" role="alert">CustomLevel Game created successfully!</div>`;
                    // empty all inputs
                    allQuestions.forEach(input => {
                      input.value = '';
                    });
                    allDifficulty.forEach(input => {
                      input.value = '';
                    });
                    // empty customName
                    document.getElementById("customLevelName").value = '';
                }
                if(this.responseText.includes(1)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">Account_id cannot be detected!</div>`;
                }
                if(this.responseText.includes(2)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">There is already an CustomGame with this name, please use a different one!</div>`;
                }
                if(this.responseText.includes(3)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">Please enter the CustomGame name with at least TWO letter</div>`;
                }
                if(this.responseText.includes(4)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">A server error occurred</div>`;
                }
            }   
        };
        xmlhttp.open("POST", "../scripts/student", true);
        // Request headers required for a POST request
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(`customLevelName=${customLevelName}&question_type_difficulty=${question_type_difficulty}&function_name=${"createCustomGame"}`);
    }
}

// viewing custom level
let viewCustomLevelModal = document.getElementById('viewCustomLevel-modal');
viewCustomLevelModal.addEventListener('show.bs.modal', function (event){
    var table = document.getElementById("viewCustomLevel");
    var rowsHTML = ""; // initialise empty var to hold html of all the rows

    //link backend here to get a list of custom level names
    var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                // Do something with the response
                //console.log(this.responseText);
                
                // the viewAllCustomGame has three possible output 1,2 and string (allCustomName)
                //1 represents account_id cannot be found, 2 represents server error
                if (this.responseText.length > 1){
                    // Split the string into an array
                    customNameArray = this.responseText.split(",");
                    for(i=0;i<customNameArray.length;i++){
                        var row = '<tr><td>' + customNameArray[i] + '</td><td><button onclick="deleteCustomLevel(event)"class="btn btn-primary" data-bs-dismiss="modal">delete</button></td></tr>';
                        rowsHTML += row; // add in html code
                    }
                    table.innerHTML = rowsHTML; //set innerhtml code
                }
                if(this.responseText === 1 && this.responseText === "1"){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">Account_id cannot be detected!</div>`;
                }
                if(this.responseText === 1 && this.responseText === "2"){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">A server error occurred</div>`;
                }
            }   
        };
    xmlhttp.open("POST", "../scripts/student", true);
    // Request headers required for a POST request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`function_name=${"viewAllCustomGame"}`);
})

// deleting custom levels
function deleteCustomLevel(e){
    let rowElements = e.srcElement.parentElement.parentElement; // row elements refer to both level name and actions
    let customLevelName = rowElements.firstChild.innerHTML;

    //console.log(customLevelName)
    // link delete custom level script here, send customLevelName
    // if successful, remove elements
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                // Do something with the response
                console.log(this.responseText);
                
                // the deleteCustomGame has three possible output 0,1,2
                // 0 represents customGame delete success
                // 1 Account_id cannot be found, 2 represents server error
                if(this.responseText.includes(0)){
                    rowElements.remove();
    				document.getElementById('response').innerHTML = `<div class="alert alert-success" role="alert">Custom level deleted!</div>`;
                }
                if(this.responseText.includes(1)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">Account_id cannot be detected!</div>`;
                }
                if(this.responseText.includes(2)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">A server error occurred</div>`;
                }
            }   
        };
    xmlhttp.open("POST", "../scripts/student", true);
    // Request headers required for a POST request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`customLevelName=${customLevelName}&function_name=${"deleteCustomGame"}`);
}



// ASSIGNMENT MODE

// viewing assignments
let viewAssignmentModal = document.getElementById('viewAssignment-modal');
viewAssignmentModal.addEventListener('show.bs.modal', function (event){
var table = document.getElementById("viewAssignments");
var rowsHTML = ""; // initialise empty var to hold html of all the rows
//var row = '<tr><td>TEST ASSIGNMENT NAME</td><td>15/11/2022</td><td><button onclick="openAssignment(event)" class="btn btn-primary" data-bs-dismiss="modal">Attempt</button></td></tr>';
//table.innerHTML = row;

//link backend here to get a list of custom level names
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
        // Do something with the response
        // the viewAssignedAssignment has three possible output 1,2 and string (viewAssignedAssignment)
        //1 represents account_id cannot be found, 2 represents server error
          
        if (this.responseText.length > 1){
            // Split the string into an array
            var assignmentsArray = this.responseText.split("|");
            
            for(i=0;i<assignmentsArray.length;i++){
                var assignmentArray = assignmentsArray[i].split(",");
                console.log(assignmentArray[0]);
                var row = '<tr><td>' + assignmentArray[0] + '</td><td>' + assignmentArray[2] + '</td><td><button onclick="openAssignment(event)"class="btn btn-primary" data-bs-dismiss="modal" value='+assignmentArray[1]+'>Attempt</button></td></tr>';
                rowsHTML += row; // add in html code
            }
            table.innerHTML = rowsHTML; //set innerhtml code
        }
        if(this.responseText.length === 1 && this.responseText === "1"){
            document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">Account_id cannot be detected!</div>`;
        }
        if(this.responseText.length === 1 && this.responseText === "2"){
            document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">A server error occurred</div>`;
        }
    }   
  };
  xmlhttp.open("POST", "../scripts/student", true);
  // Request headers required for a POST request
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send(`function_name=${"viewAssignedAssignment"}`);
})

// opening assignment modal
function openAssignment(e){
	let assignmentName = e.srcElement.parentElement.parentElement.firstChild.innerHTML;
    let assignmentID = e.srcElement.value;
	console.log(assignmentName);
    // console.log(assignmentID);

	var assignmentModal = new bootstrap.Modal(document.getElementById('assignmentMode-modal'), {});
    assignmentModal.show();

	// get assignment based on assignmentName, then assign it to assignmentToAttempt global variable

    socket.send("/assignment "+assignmentName);
}

// get all the components in the assignment mode modal
var assignmentModeProgressBar = document.getElementById('assignmentModeProgressBar');
var assignmentModeScore = document.getElementById('assignmentModeScore');
var assignmentModeQuestionNo = document.getElementById('assignmentModeQuestionNo');
var assignmentModeQuestion = document.getElementById('assignmentModeQuestion');
var assignmentModeOption1 = document.getElementById('assignmentModeOption1');
var assignmentModeOption2 = document.getElementById('assignmentModeOption2');
var assignmentModeOption3 = document.getElementById('assignmentModeOption3');
var assignmentModeOption4 = document.getElementById('assignmentModeOption4');
var assignmentModeExplanation = document.getElementById('assignmentModeExplanation');
var assignmentModeNextQuestionBtn = document.getElementById('assignmentModeNextQuestion');

// submit answer for assignment mode
function assignmentModeSubmit(e){
	var selectedAnswer = e.srcElement.value; //selected answer
	console.log(selectedAnswer);

	socket.send("/answer "+selectedAnswer);

	//disabling all option buttons
	assignmentModeOption1.disabled = true;
	assignmentModeOption2.disabled = true;
	assignmentModeOption3.disabled = true;
	assignmentModeOption4.disabled = true;

    let max_qns = assignmentModeProgressBar.value; 
	assignmentModeProgress += (1/max_qns)*100;
	assignmentModeProgressBar.innerHTML = assignmentModeProgress + "%"; // update label of progress bar
	assignmentModeProgressBar.style.width = assignmentModeProgress + "%"; // update width of progress bar

	if(assignmentModeProgress < 100){
		assignmentModeNextQuestionBtn.className = "btn btn-success"; // make next question btn visible if progress is not 100
	} else {
        adventureModeComplete.innerHTML = `<div class="alert alert-info text-center" role="alert">
                                        Assignment completed!
                                      </div>`;
    }
}

function assignmentModeLoadNextQuestion(){
    return new Promise(function(resolve) {
        assignmentModeCurrentQn += 1;
        assignmentModeQuestionNo.innerHTML = "Question " + assignmentModeCurrentQn;

        assignmentModeNextQuestionBtn.classList.add("invisible");

        assignmentModeOption1.disabled = false;
        assignmentModeOption2.disabled = false;
        assignmentModeOption3.disabled = false;
        assignmentModeOption4.disabled = false;

        assignmentModeExplanation.innerHTML = "";
        
        if(questionQueue) {
            assignmentModeQuestion.innerHTML = questionQueue[0];
            for(let i=1; i<=4; i++) {
                document.getElementById('assignmentModeOption'+i).innerHTML = questionQueue[i];
            }
          }
    });
}
let assignmentModeModal = document.getElementById('assignmentMode-modal')
// when modal opens, load the first question
assignmentModeModal.addEventListener('show.bs.modal', async function (event){
	// set starting values
	assignmentModeProgress = 0; // progress in terms of percentage, starts at 0
	assignmentModeQnCorrect = 0; // num of questions correct, starts at 0
	assignmentModeQnAttempted = 0; // num of questions attempted, starts at 0
	assignmentModeCurrentQn = 0; // current question number, starts at 1

	assignmentModeNextQuestionBtn.className = "btn btn-success invisible"; // make next question btn invisible
	assignmentModeExplanation.innerHTML = ""; // make explanation blank
	assignmentModeProgressBar.innerHTML = "0%"; // set label of progress bar to 0%
	assignmentModeProgressBar.style.width = "0%"; // set width of progress bar to 0%
	assignmentModeScore.innerHTML = "0/0" // set score to 0
	assignmentModeQuestionNo.innerHTML = "Question 1" // set question number to 1


	var character = assignmentModeModal.querySelector('#characterAvatarAssignment'); 
	// Add player character based on characterID
	switch (characterID) {
	case "1":
	    character.innerHTML = '<img class = "img-responsive" width = "100%"  src="images/martialHero.png"/>';
	    break;
	case "2":
	    character.innerHTML = '<img class = "img-responsive" width = "100%"  src="images/huntress.png"/>';
	    break;
	case "3":
	    character.innerHTML = '<img class = "img-responsive" width = "100%"  src="images/heroKnight.png"/>';
	    break;
	case "4":
	    character.innerHTML = '<img class = "img-responsive" width = "100%"  src="images/wizard.png"/>';
	    break;
	default:
	    console.log("Something went wrong in player creation in create()");
	}

	// load first question here
    await assignmentModeLoadNextQuestion();
})









// ADVENTURE MODE

// function to assign section to attempt adventure in, then open adventure mode modal
function selectAdventureSection(e){
    selectedAdventureSection = e.srcElement.innerHTML.split(" ")[0];
    console.log(selectedAdventureSection);

    // show adventure mode modal
    var adventureModal = new bootstrap.Modal(document.getElementById('adventureMode-modal'), {});
	  adventureModal.show();
    socket.send("/adventure "+selectedAdventureSection);
  }

// get all the components in the adventure mode modal
var adventureModeProgressBar = document.getElementById('adventureModeProgressBar');
var adventureModeScore = document.getElementById('adventureModeScore');
var adventureModeQuestionNo = document.getElementById('adventureModeQuestionNo');
var adventureModeQuestion = document.getElementById('adventureModeQuestion');
var adventureModeOption1 = document.getElementById('adventureModeOption1');
var adventureModeOption2 = document.getElementById('adventureModeOption2');
var adventureModeOption3 = document.getElementById('adventureModeOption3');
var adventureModeOption4 = document.getElementById('adventureModeOption4');
var adventureModeExplanation = document.getElementById('adventureModeExplanation');
var adventureModeNextQuestionBtn = document.getElementById('adventureModeNextQuestion');
var adventureModeComplete = document.getElementById('adventureModeComplete');

// function for option buttons to submit answer
function adventureModeSubmit(e){
  // check if submitted answer is correct/wrong
  // then update progressBar, score, explanation accordingly
  // if the current question is not the last question, make nextQuestionBtn visible
  // disable all option buttons after submitting

  var selectedAnswer = e.srcElement.value; //selected answer
  console.log(selectedAnswer);

  socket.send("/answer "+selectedAnswer);

  //disabling all option buttons
  adventureModeOption1.disabled = true;
  adventureModeOption2.disabled = true;
  adventureModeOption3.disabled = true;
  adventureModeOption4.disabled = true;

  adventureModeProgress += 10;
  adventureModeProgressBar.innerHTML = adventureModeProgress + "%"; // update label of progress bar
  adventureModeProgressBar.style.width = adventureModeProgress + "%"; // update width of progress bar

  if(adventureModeProgress < 100){
    adventureModeNextQuestionBtn.className = "btn btn-success"; // make next question btn visible if progress is not 100
  }else{
    adventureModeComplete.innerHTML = `<div class="alert alert-info text-center" role="alert">
                                        Adventure mode completed!
                                      </div>`;
  }

  // adventureModeQnAttempted += 1
  // adventureModeQnCorrect += 1
  // adventureModeScore.innerHTML = adventureModeQnCorrect + "/" + adventureModeQnAttempted;

  // template for explanation
  // <div class="alert alert-success" role="alert">
  //   <h4 class="alert-heading">Correct!</h4>
  //   <p>The answer is 1</p>
  //   <hr>
  //   <p class="mb-0">This is the explanation for the question</p>
  // </div>
//   <div class="alert alert-danger" role="alert">
//     <h4 class="alert-heading">Wrong!</h4>
//     <p>The answer is 3</p>
//     <hr>
//     <p class="mb-0">This is the explanation for the question</p>
//   </div>

  // adventureModeExplanation.innerHTML = `<div class="alert alert-success" role="alert">
  //                                       <h4 class="alert-heading">Correct!</h4>
  //                                       <p>The answer is 1</p>
  //                                       <hr>
  //                                       <p class="mb-0">This is the explanation for the question</p>
  //                                     </div>
  //                                    `;      
}
// function to update modal upon clicking on next button
function adventureModeLoadNextQuestion(){
return new Promise(function(resolve) {
    // update questionNo, question, option1, option2, option3, option4
    // make explanation empty
    // make nextQuestionBtn invisible
    // reenable all option buttons so they can answer new question

    // update current question label
    adventureModeCurrentQn += 1;
    adventureModeQuestionNo.innerHTML = "Question " + adventureModeCurrentQn;

    // make next question btn invisible
    adventureModeNextQuestionBtn.className = "btn btn-success invisible";

    // reenabling all option buttons
    adventureModeOption1.disabled = false;
    adventureModeOption2.disabled = false;
    adventureModeOption3.disabled = false;
    adventureModeOption4.disabled = false;

    adventureModeExplanation.innerHTML = ""; // empty the explanation

    console.log("loading next question")

    if(questionQueue) {
      adventureModeQuestion.innerHTML = questionQueue[0];
      for(let i=1; i<=4; i++) {
          document.getElementById('adventureModeOption'+i).innerHTML = questionQueue[i];
      }
    }
});
}
let adventureModeModal = document.getElementById('adventureMode-modal');
adventureModeModal.addEventListener('show.bs.modal', async function (event){
	// set starting values
	adventureModeProgress = 0; // progress in terms of percentage, starts at 0
	adventureModeQnCorrect = 0; // num of questions correct, starts at 0
	adventureModeQnAttempted = 0; // num of questions attempted, starts at 0
	adventureModeCurrentQn = 0; // current question number, starts at 1

	adventureModeNextQuestionBtn.className = "btn btn-success invisible"; // make next question btn invisible
	adventureModeExplanation.innerHTML = ""; // make explanation blank
	adventureModeProgressBar.innerHTML = "0%"; // set label of progress bar to 0%
	adventureModeProgressBar.style.width = "0%"; // set width of progress bar to 0%
	adventureModeScore.innerHTML = "0/0" // set score to 0
	adventureModeQuestionNo.innerHTML = "Question 1" // set question number to 1

	// when modal opens, get adventure based on selectedAdventureSection: lower pri/upper pri
	// console.log(selectedAdventureSection);

	// Add player character based on characterID
	var character = adventureModeModal.querySelector('#characterAvatarAdventure'); 
	switch (characterID) {
	case "1":
	    character.innerHTML = '<img class = "img-responsive" width = "100%"  src="images/martialHero.png"/>';
	    break;
	case "2":
	    character.innerHTML = '<img class = "img-responsive" width = "100%"  src="images/huntress.png"/>';
	    break;
	case "3":
	    character.innerHTML = '<img class = "img-responsive" width = "100%"  src="images/heroKnight.png"/>';
	    break;
	case "4":
	    character.innerHTML = '<img class = "img-responsive" width = "100%"  src="images/wizard.png"/>';
	    break;
	default:
	    console.log("Something went wrong in player creation in create()");
	}
	  // load first question here
	  await adventureModeLoadNextQuestion();
})