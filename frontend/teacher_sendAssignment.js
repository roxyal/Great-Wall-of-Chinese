// Initialise boostrap tooltips on this page
// https://getbootstrap.com/docs/5.2/components/tooltips/
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
return new bootstrap.Tooltip(tooltipTriggerEl)
})

var rowToDelete; //global variable to store the row to be deleted
var assignmentToSend; //global variable to store the assignment name to be sent

// adding assignment name to the Assignments column
function addAssignmentName(assignmentName, rowNum){
	const assignmentNameElement = document.createElement('h5');
	assignmentNameElement.id = rowNum;
	assignmentNameElement.innerHTML = assignmentName;
	
	const assignmentNameDiv = document.createElement('div');
	assignmentNameDiv.className = rowNum;
	assignmentNameDiv.appendChild(assignmentNameElement)

	document.getElementById('assignmentName').appendChild(assignmentNameDiv);
}

// adding delete and send buttons for each assignment
function addAssignmentButtons(rowNum){
	const assignmentButtonElement = document.createElement('div');
	var deleteButtonHTML = '<button onclick = deleteRowNotification("' + rowNum +  '") class="btn btn-secondary" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete"><i class="fa fa-trash"></i></button>';
	var sendAssignmentHTML = '	<button onclick = sendAssignmentNotification("' + rowNum +  '") class="btn btn-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Send"><span class="bi bi-send"></span></button>';
	assignmentButtonElement.className = rowNum;
	assignmentButtonElement.innerHTML = sendAssignmentHTML + deleteButtonHTML;

	document.getElementById('assignmentButtons').appendChild(assignmentButtonElement);
}

// test assignments
addAssignmentName("IDOIMS 101", "rownum1")
addAssignmentButtons("rownum1")
addAssignmentName("IDOIMS 102", "rownum2")
addAssignmentButtons("rownum2")
addAssignmentName("IDOIMS 103", "rownum3")
addAssignmentButtons("rownum3")

// shows a modal to confirm if user wants to send assignment
function sendAssignmentNotification(rowNum){
	assignmentToSend = document.getElementById(rowNum).innerHTML;
	let notification = "Send " + assignmentToSend + "?";

	let sendAssignment = document.getElementById('sendAssignment-Modal')
	sendAssignment.addEventListener('show.bs.modal', function (event){
		var modalNotification = sendAssignment.querySelector('.modal-body p');
		modalNotification.innerHTML = notification;
	})

	var assignmentModal = new bootstrap.Modal(document.getElementById('sendAssignment-Modal'), {});
	assignmentModal.show();
}

// link backend script here to send assignment, then display a modal if successful
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
function deleteRowNotification(rowNum){
	let assignmentToDelete = document.getElementById(rowNum).innerHTML;
	let notification = "Delete " + assignmentToDelete + "?";
	rowToDelete = rowNum;

	let deleteAssignment = document.getElementById('deleteAssignment-Modal')
	deleteAssignment.addEventListener('show.bs.modal', function (event){
		var modalNotification = deleteAssignment.querySelector('.modal-body p');
		modalNotification.innerHTML = notification;
	})

	let deleteModal = new bootstrap.Modal(document.getElementById('deleteAssignment-Modal'), {});
	deleteModal.show();
}

// link backend here to delete assignment, if successful -> delete row of elements on the page
function deleteRow(){
	const rowElements = document.querySelectorAll('.' + rowToDelete);
	rowElements.forEach(element =>{
		element.remove();
	});
}