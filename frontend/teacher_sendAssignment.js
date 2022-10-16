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
	;

	document.getElementById('assignmentButtons').appendChild(assignmentButtonElement);
}

addAssignmentName("IDOIMS 101", "rownum1")
addAssignmentButtons("rownum1")

addAssignmentName("IDOIMS 102", "rownum2")
addAssignmentButtons("rownum2")

addAssignmentName("IDOIMS 103", "rownum3")
addAssignmentButtons("rownum3")

addAssignmentName("IDOIMS 104", "rownum4")
addAssignmentButtons("rownum4")

addAssignmentName("IDOIMS 105", "rownum5")
addAssignmentButtons("rownum5")

addAssignmentName("IDOIMS 106", "rownum6")
addAssignmentButtons("rownum6")

addAssignmentName("IDOIMS 107", "rownum7")
addAssignmentButtons("rownum7")

addAssignmentName("IDOIMS 108", "rownum8")
addAssignmentButtons("rownum8")

addAssignmentName("IDOIMS 109", "rownum9")
addAssignmentButtons("rownum9")

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

function sendAssignment(){
	console.log("ASSIGNMENT " + assignmentToSend + " SENT");
	// link backend here to send Assignment
	// once backend successful, open modal to notify success of sending assignment, with options to share on social media
}


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

function deleteRow(){
	const rowElements = document.querySelectorAll('.' + rowToDelete);
	rowElements.forEach(element =>{
		element.remove();
	});

	// link backend here to delete assignment
}