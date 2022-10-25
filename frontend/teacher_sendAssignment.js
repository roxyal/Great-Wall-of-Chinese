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
                    assignmentNameArray = this.responseText.split(",");
                    
                    for(i=0;i<assignmentNameArray.length;i++){
                        var row = '<tr>';
                        row += '<td>' + assignmentNameArray[i] + '</td>' + 
                                '<td><button onclick = sendAssignmentNotification(event) class="btn btn-primary mx-1 text-nowrap" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Send">Send</button><button onclick = deleteRowNotification(event) class="btn btn-secondary mx-1" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">Delete</button></td>';
                        row += '</tr>';
                        rowsHTML += row; // add in html code
                    }
                    viewAssignmentTable.innerHTML = rowsHTML;
                }
                if(this.responseText === 1 && this.responseText === "1"){
                    console.log("Account_id cannot be detected!");
                }
                if(this.responseText === 1 && this.responseText === "2"){
                    console.log("A server error occurred");
                }
            }   
        };
        xmlhttp.open("POST", "../scripts/teacher", true);
        // Request headers required for a POST request
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(`function_name=${"viewAllAssignment"}`);