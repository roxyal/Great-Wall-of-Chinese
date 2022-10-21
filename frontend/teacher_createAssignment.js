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

    let allAnswer = document.querySelectorAll("[name='answer[]");
    let allExplanation = document.querySelectorAll("[name='explanation[]");
    
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
                // 0 represents success, 1 represents account_id cannot be found, 2 represents server error
                if(this.responseText.includes(0)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-success" role="alert">Assignment created successfully!</div>`;
                }
                if(this.responseText.includes(1)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">Account_id cannot be detected!</div>`;
                }
                if(this.responseText.includes(2)){
                    document.getElementById('response').innerHTML = `<div class="alert alert-danger" role="alert">A server error occurred</div>`;
                }
            }
        };
        xmlhttp.open("POST", "../scripts/teacher", true);
        // Request headers required for a POST request
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(`assignmentName=${assignmentName}&dateInput=${dateInput}&qnSendToBackend=${qnSendToBackend}&function_name=${createAssignment}`);
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
