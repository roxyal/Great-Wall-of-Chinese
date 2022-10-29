// createAssignment button
const createAssignmentButton = document.getElementById('createAssignment');
createAssignmentButton.addEventListener('click', saveAssignment);

// save assignment to backend
function saveAssignment(){
    let emptyFields = false;

    let assignmentName = document.getElementById("assignmentName").value;
    let dateInput = document.getElementById("assignmentDate").value;

    if(!assignmentName||!dateInput){
            emptyFields = true;
    }

    let allQuestions = document.querySelectorAll("[name='question[]']");
    let allOption1 = document.querySelectorAll("[name='option_1[]']");
    let allOption2 = document.querySelectorAll("[name='option_2[]']");
    let allOption3 = document.querySelectorAll("[name='option_3[]']");
    let allOption4 = document.querySelectorAll("[name='option_4[]']");
    let allAnswer = document.querySelectorAll("[name='answer[]']");
    let allExplanation = document.querySelectorAll("[name='explanation[]']");

    // get all the inputs
    //const inputs = document.querySelectorAll("[name='question[]'], [name='option_1[]'], [name='option_2[]'], [name='option_3[]'], [name='option_4[]'], [name='answer[]'], [name='explanation[]']");
    
    // A string variable use to concatenate all questions/choice/answer/explanation
    let qnSendToBackend = "";
    
    // A variable to know what functions is this
    let function_name = "createAssignment";
    
    for (let i = 0; i < allQuestions.length; i++){
            if(!allQuestions[i].value||!allOption1[i].value||!allOption2[i].value||!allOption3[i].value
                    ||!allOption4[i].value||!allAnswer[i].value||!allExplanation[i].value){
                            emptyFields = true;
                            break;
            }
            qnSendToBackend = qnSendToBackend + allQuestions[i].value + ',' + allOption1[i].value + ',' +
                              allOption2[i].value + ',' + allOption3[i].value + ',' + allOption4[i].value + ',' +
                              allAnswer[i].value + ',' + allExplanation[i].value;
            if (i+1 != allQuestions.length)
                qnSendToBackend = qnSendToBackend + '|';
    }
    if(emptyFields){
            document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">Please fill in all the fields!</div>`
    }else{
        //link backend here to save assignment
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                // Do something with the response
                console.log(this.responseText);
                
                // the createAssignment has three possible output 0,1,2
                // 0 represents success, 1 represents account_id gitcannot be fsound, 2 represents server error
                if(this.responseText.includes(0)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-success" role="alert">Assignment created successfully!</div>`;
                    // empty all inputs
                    allQuestions.forEach(input => {
                      input.value = '';
                    });
                    allOption1.forEach(input => {
                      input.value = '';
                    });
                    allOption2.forEach(input => {
                      input.value = '';
                    });
                    allOption3.forEach(input => {
                      input.value = '';
                    });
                    allOption4.forEach(input => {
                      input.value = '';
                    });
                    allAnswer.forEach(input => {
                      input.value = '';
                    });
                    allExplanation.forEach(input => {
                      input.value = '';
                    });

                    // empty due date
                    document.getElementById("assignmentDate").value = '';

                    // empty assignment name
                    document.getElementById("assignmentName").value = '';

                }
                if(this.responseText.includes(1)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">Account_id cannot be detected!</div>`;
                }
                if(this.responseText.includes(2)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">There is already an Assignment with this name, please use a different one!</div>`;
                }
                if(this.responseText.includes(3)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">Please enter the Assignment name with at least TWO letter</div>`;
                }
                if(this.responseText.includes(4)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">A server error occurred</div>`;
                }
            }
        };
        xmlhttp.open("POST", "../scripts/teacher", true);
        // Request headers required for a POST request
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(`assignmentName=${assignmentName}&dateInput=${dateInput}&qnSendToBackend=${qnSendToBackend}&function_name=${function_name}`);
    }
}
// add question
function addQuestion(){
	let questionElement = document.getElementById("questions");
	newRow = document.createElement("div");
	newRow.className = "row"
	newRow.innerHTML = `
	<div class="col-md-3 mb-3">
      <input type="text" name="question[]" class="form-control" 
      placeholder="Question">
    </div>

    <div class="col-md-1 mb-3">
      <input type="text" name="option_1[]" class="form-control" 
      placeholder="option 1">
    </div>

    <div class="col-md-1 mb-3">
      <input type="text" name="option_2[]" class="form-control" 
      placeholder="option 2">
    </div>

    <div class="col-md-1 mb-3">
      <input type="text" name="option_3[]" class="form-control" 
      placeholder="option 3">
    </div>

    <div class="col-md-1 mb-3">
      <input type="text" name="option_4[]" class="form-control" 
      placeholder="option 4">
    </div>

    <div class="col-md-1 mb-3">
      <select type="text" name="answer[]" class="form-control" >
        <option value="" selected disabled>Answer</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
    </div>

    <div class="col-md-2 mb-3">
      <input type="text" name="explanation[]" class="form-control" 
      placeholder="explanation" required>
    </div>

	<div class="col-md-2 mb-3 d-grid">
	  <button onclick=removeQuestion(event) class="btn btn-secondary remove-itm btn">Remove</button>
	</div>
	`;
	questionElement.insertBefore(newRow, questionElement.firstChild);
}

// remove question from page
function removeQuestion(e){
	let rowElements = e.srcElement.parentElement.parentElement;
	rowElements.remove();
}



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
				// 1,vinvin,22,55.0000|2,diedforoursyntax,21,30.0000|3,testa,20,22.2222*1,diedforoursyntax,Bling Bling,1000|2,testa,Bronze,50
				
				// We then split the string into an array
				// WE use (*) to spit the leaderboard to Adventure and PVP
				// leaderBoardArray[0] represents Adventure LeaderBoard
				// leaderBoardArray[1] represents PVP LeaderBoard
				leaderBoardArray = this.responseText.split("*");
				adventureLeaderBoard = leaderBoardArray[0];
				pvpLeaderBoard = leaderBoardArray[1];
				
				// Printing Adventure on the HTML
				// Example of adventureLeaderBoard string
				// 1,vinvin,22,55.0000|2,diedforoursyntax,21,30.0000|3,testa,20,22.2222
				
				// We use (|) to split the individual's information
				// Therefore, you can see that each element of the array is a player's info
				// Example of adventureLeaderBoardArray
				// ['1,vinvin,22,55.0000', '2,diedforoursyntax,21,30.0000', '3,testa,20,22.2222']
				// Check to see if the adventureLeaderBoard is an empty list
                                if (adventureLeaderBoard.length !== 0){
                                    adventureLeaderBoardArray = adventureLeaderBoard.split("|");
                                    for(i=0;i<adventureLeaderBoardArray.length;i++){
					// rowAdventure = '<tr>';
					
					// We use (,) to split again, to obtain respestive columns player's information
					// [Position, Username, Adventure Points, Accuracy]
					// ['1','vinvin','22','55.0000']
					student_info = adventureLeaderBoardArray[i].split(",");
					let position = student_info[0];
					let username = student_info[1];
                                        let adv_points = student_info[2];
					let accuracy = (Math.round(student_info[3] * 100) / 100).toFixed(2);

					rowAdventure += `<tr>
										<td>` + position + `</td>
										<td>` + username + `</td>
                                                                                <td>` + adv_points + `</td>
										<td>` + accuracy + `</td>
									</tr>`;
                                    }
                                    adventureMode.innerHTML  = rowAdventure; //set innerhtml code
                                }
				
				// Printing PVP on the HTML
				// Example of pvpLeaderBoard string
				// 1,diedforoursyntax,Bling Bling,1000|2,testa,Bronze,50
				
				// Similar to adventureMode's LeaderBoard we use 
				// We use (|) to split the individual's information
				// Therefore, you can see that each element of the array is a player's info
				// Example of pvpLeaderBoardArray
				// ['1,diedforoursyntax,Bling Bling,1000', '2,testa,Bronze,50']
				// Check to see if the pvpLeaderBoard is an empty list
                                if (pvpLeaderBoard.length !== 0){
                                    pvpLeaderBoardArray = pvpLeaderBoard.split("|");
                                    for(i=0;i<pvpLeaderBoardArray.length;i++){
					rowPvp = rowPvp + '<tr>';
					
					// We use (,) to split again, to obtain respestive columns player's information
					// [Position, Username, Rank, Rank Points]
					// ['1', 'diedforoursyntax', 'Bling Bling', '1000']
					student_info = pvpLeaderBoardArray[i].split(",");
					for(j=0;j<student_info.length;j++){
						rowPvp += '<td>' + student_info[j] + '</td>';
					}
					rowPvp += '</tr>';
                                    }
                                    pvpMode.innerHTML  = rowPvp; //set innerhtml code
                                }
                        }
			if(this.responseText.length === 1 && this.responseText === "1"){
				console.log("Account_id cannot be detected!");
			}
			if(this.responseText.length === 1 && this.responseText === "2"){
				console.log("A server error occurred</div>");
			}
		}   
	};
	xmlhttp.open("POST", "../scripts/function_viewLeaderBoard", true);
	// Request headers required for a POST request
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(`function_name=${"viewLeaderBoard"}`);
})