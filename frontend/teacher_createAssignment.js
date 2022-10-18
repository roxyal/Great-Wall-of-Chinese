// add question
function addQuestion(){
	let questionElement = document.getElementById("questions");
	questionElement.innerHTML = `<div class="row">
	<div class="col-md-3 mb-3">
	  <input type="text" name="question[]" class="form-control" 
	  placeholder="Question" required>
	</div>

	<div class="col-md-1 mb-3">
	  <input type="text" name="option_1[]" class="form-control" 
	  placeholder="option 1" required>
	</div>

	<div class="col-md-1 mb-3">
	  <input type="text" name="option_2[]" class="form-control" 
	  placeholder="option 2" required>
	</div>

	<div class="col-md-1 mb-3">
	  <input type="text" name="option_3[]" class="form-control" 
	  placeholder="option 3" required>
	</div>

	<div class="col-md-1 mb-3">
	  <input type="text" name="option_4[]" class="form-control" 
	  placeholder="option 4" required>
	</div>

	<div class="col-md-1 mb-3">
	  <select type="text" name="answer[]" class="form-control" required>
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
	  <button onclick=removeQuestion(event) class="btn btn-secondary remove_item_btn">Remove</button>
	</div>
	</div>` + questionElement.innerHTML;
}

// remove question from page
function removeQuestion(e){
	let rowElements = e.srcElement.parentElement.parentElement;
	rowElements.remove();
}

// save assignment to backend
function saveAssignment(){
	let emptyFields = false;

	let assignmentName = document.getElementById("assignmentName").value;
	let dateInput = document.getElementById("dueDate").value;

	if(!assignmentName||!dateInput){
		emptyFields = true;
	}

	let allQuestions = document.querySelectorAll("[name='question[]']");
	let allOption1 = document.querySelectorAll("[name='option_1[]']");
	let allOption2 = document.querySelectorAll("[name='option_2[]']");
	let allOption3 = document.querySelectorAll("[name='option_3[]']");
	let allOption4 = document.querySelectorAll("[name='option_4[]']");

	let allAnswer = document.querySelectorAll("[name='answer[]");
	let allExplanation = document.querySelectorAll("[name='explanation[]");
	for (let i = 0; i < allQuestions.length; i++){
		if(!allQuestions[i].value||!allOption1[i].value||!allOption2[i].value||!allOption3[i].value
			||!allOption4[i].value||!allAnswer[i].value||!allExplanation[i].value){
				emptyFields = true;
				break;
		}
	}

	if(emptyFields){
		document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">Please fill in all the fields!</div>`
	}else{
		//link backend here to save assignment
		document.getElementById('response').innerHTML = `<div class="alert alert-success" role="alert">Assignment created successfully!</div>`
	}
}