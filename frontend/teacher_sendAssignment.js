// Initialise boostrap tooltips on this page
// https://getbootstrap.com/docs/5.2/components/tooltips/
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
return new bootstrap.Tooltip(tooltipTriggerEl)
})

var elementToDelete; //global variable to store the row to be deleted
var assignmentToSend; //global variable to store the assignment name to be sent

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
	let assignmentToDelete = e.srcElement.parentElement.parentElement.children[0].innerHTML;
	let notification = "Delete " + assignmentToDelete + "?";
	elementToDelete = e.srcElement.parentElement.parentElement; //contains table row to delete
	console.log(elementToDelete);

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
	elementToDelete.remove();
}

let viewAssignmentTable = document.getElementById('viewAssignmentTable');
var rowsHTML = ""; // initialise empty var to hold html of all the rows

//link backend here to get list of assignment names, then loop through to display in the table

var row = `<tr>
				<td>TESTING ROW</td>
				<td>
					<button onclick = sendAssignmentNotification(event) class="btn btn-primary mx-1 text-nowrap" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Send">Send</button>
					<button onclick = deleteRowNotification(event) class="btn btn-secondary mx-1" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">Delete</button>
				</td>
		   </tr>
		`; // for testing
viewAssignmentTable.innerHTML = row;