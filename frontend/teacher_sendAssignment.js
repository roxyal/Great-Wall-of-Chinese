// Initialise boostrap tooltips on this page
// https://getbootstrap.com/docs/5.2/components/tooltips/
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
return new bootstrap.Tooltip(tooltipTriggerEl)
})

var elementToDelete; //global variable to store the row to be deleted
var assignmentToSend; //global variable to store the assignment name to be sent
var assignmentToDelete; // global variable to store the assignmentName to be deleted

// shows a modal to confirm if user wants to send assignment
function sendAssignmentNotification(e){
	assignmentToSend = e.srcElement.parentElement.parentElement.children[0].innerHTML;
	console.log(assignmentToSend);
	let notification = "Send " + assignmentToSend + "?";

	let sendAssignment = document.getElementById('sendAssignment-Modal')
	sendAssignment.addEventListener('show.bs.modal', function (event){
		var modalNotification = sendAssignment.querySelector('.modal-body p');
		modalNotification.innerHTML = notification;
	})

	var assignmentModal = new bootstrap.Modal(document.getElementById('sendAssignment-Modal'), {});
	assignmentModal.show();
}

// link backend script here to send assignment using assignmentToSend, then display modal if successful
function sendAssignment(){

	var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                
				// Outputs: int 0 on successfully sent to students
    			//          int 1 when teacher does not exist
    			//          int 2 on assignment does not exist
    			//          int 3 on database error

                if (this.responseText.includes(0)){
					let successMessage = assignmentToSend + " has been sent successfully"
					let assignmentSent = document.getElementById('assignmentSentSuccess-Modal')
					assignmentSent.addEventListener('show.bs.modal', function (event){
						var modalMessage = assignmentSent.querySelector('.modal-body p');
						modalMessage.innerHTML = successMessage;
					})

					// adding the script for the tweet button
					document.getElementById('assignmentSentSuccess-Modal')
					.addEventListener("show.bs.modal", async function () {
						!(function (d, s, id) {
							var js,
							fjs = d.getElementsByTagName(s)[0];
							if (!d.getElementById(id)) {
							js = d.createElement(s);
							js.id = id;
							js.src = "https://platform.twitter.com/widgets.js";
							fjs.parentNode.insertBefore(js, fjs);
							}
						})(document, "script", "twitter-wjs");
					});

					// adding the script for the facebook button
					document.getElementById('assignmentSentSuccess-Modal')
					.addEventListener("show.bs.modal", async function () {
						!(function (d, s, id) {
							var js, fjs = d.getElementsByTagName(s)[0];
							if (d.getElementById(id)) return;
							js = d.createElement(s); 
							js.id = id;
							js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
							fjs.parentNode.insertBefore(js, fjs);
						}(document, 'script', 'facebook-jssdk'));
					});

					var assignmentSentSuccessModal = new bootstrap.Modal(document.getElementById('assignmentSentSuccess-Modal'), {});
					assignmentSentSuccessModal.show();
                }
                if(this.responseText.includes(1)){
                    console.log("Account_id cannot be detected!");
                }
                if(this.responseText.includes(2)){
                    console.log("Assignment name does not exist!");
                }
                if(this.responseText.includes(3)){
                    console.log("A server error occurred");
                }
            }   
        };
        xmlhttp.open("POST", "../scripts/teacher", true);
        // Request headers required for a POST request
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(`assignmentName=${assignmentToSend}&function_name=${"sendToStudents"}`);
}


// shows a modal to confirm if user wants to delete assignment
function deleteRowNotification(e){
	assignmentToDelete = e.srcElement.parentElement.parentElement.children[0].innerHTML;
	let notification = "Delete " + assignmentToDelete + "?";
	elementToDelete = e.srcElement.parentElement.parentElement; //contains table row to delete

	let deleteAssignment = document.getElementById('deleteAssignment-Modal')
	deleteAssignment.addEventListener('show.bs.modal', function (event){
		var modalNotification = deleteAssignment.querySelector('.modal-body p');
		modalNotification.innerHTML = notification;
	})

	let deleteModal = new bootstrap.Modal(document.getElementById('deleteAssignment-Modal'), {});
	deleteModal.show();
}

// link backend here to delete assignment, if successful, delete row of elements on the page
function deleteRow(){
    var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                
                // the deleteAssignment has three possible output 0,1,2
                // 0 represents assignment delete success
                // 1 Account_id cannot be found, 2 represents server error
                
                if (this.responseText.includes(0)){
                    elementToDelete.remove();
                }
                if(this.responseText.includes(1)){
                    console.log("Account_id cannot be detected!");
                }
                if(this.responseText.includes(2)){
                    console.log("A server error occurred");
                }
            }   
        };
        xmlhttp.open("POST", "../scripts/teacher", true);
        // Request headers required for a POST request
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(`assignmentToDelete=${assignmentToDelete}&function_name=${"deleteAssignment"}`);
}

let viewAssignmentTable = document.getElementById('viewAssignmentTable');
var rowsHTML = ""; // initialise empty var to hold html of all the rows

//link backend here to get list of assignment names, then loop through to display in the table
var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                
                // the viewAssignment has three possible output 1,2 and string (all created AssignmentName)
                //1 represents account_id cannot be found, 2 represents server error
                
                if (this.responseText.length > 1){
                    // Split the string into an array
					var assignmentNamesArray = this.responseText.split("|");
                    console.log(assignmentNamesArray);
                    for(i=0;i<assignmentNamesArray.length;i++){
						var assignmentNameArray = assignmentNamesArray[i].split(",");

                        var row = '<tr>';
                        row += '<td>' + assignmentNameArray[0] + '</td>' + 
								'<td>' + assignmentNameArray[1] + '</td>' +
								'<td>' + assignmentNameArray[2] + '</td>' + 
                                '<td><button onclick = sendAssignmentNotification(event) class="btn btn-primary mx-1 text-nowrap" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Send">Send</button><button onclick = deleteRowNotification(event) class="btn btn-secondary mx-1" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">Delete</button></td>';
                        row += '</tr>';
                        rowsHTML += row; // add in html code
                    }
                    viewAssignmentTable.innerHTML = rowsHTML;
                }
                if(this.responseText.length === 1 && this.responseText === "1"){
                    console.log("Account_id cannot be detected!");
                }
                if(this.responseText.length === 1 && this.responseText === "2"){
                    console.log("A server error occurred");
                }
            }   
        };
        xmlhttp.open("POST", "../scripts/teacher", true);
        // Request headers required for a POST request
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(`function_name=${"viewAllAssignment"}`);



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