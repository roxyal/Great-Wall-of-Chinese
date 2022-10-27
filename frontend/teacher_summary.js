// link backend here to get individual stats
let individualStatHTML = '';

// idioms avg stats
var idiomsAttempted = document.getElementById('idiomsAttempted');
var idiomsCorrect = document.getElementById('idiomsCorrect');
var idiomsAccuracy = document.getElementById('idiomsAccuracy');

// hanyu pinyin avg stats
var hanyuPinyinAttempted = document.getElementById('hanyuPinyinAttempted');
var hanyuPinyinCorrect = document.getElementById('hanyuPinyinCorrect');
var hanyuPinyinAccuracy = document.getElementById('hanyuPinyinAccuracy');

// fill in the blanks avg stats
var fillInTheBlanksAttempted = document.getElementById('fillInTheBlanksAttempted');
var fillInTheBlanksCorrect = document.getElementById('fillInTheBlanksCorrect');
var fillInTheBlanksAccuracy = document.getElementById('fillInTheBlanksAccuracy');


// Variable to calculate the total number of correct/attmpted
let idioms_correct = 0;
let fill_correct = 0;
let pinyin_correct = 0;

let idioms_attempted = 0;
let fill_attempted = 0;
let pinyin_attempted = 0;

var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            // the Teacher viewSummaryReport has three possible output 1,2, strings which contain all his/her student information
            // success equals obtaing a string with all the student information,
            // 1 represents account_id cannot be found, 2 represents server error
            if (this.responseText.length > 1){
                
                // If there is more than 1 student tied under the teacher
                // We will use '|'
                //  Kelvin,5,10,0,0,0,0,0,0,15,20,0,0 | Kelly,10,10,0,0,0,0,0,0,20,20,0,0
                summaryReportArray = this.responseText.split("|");
                num_students = summaryReportArray.length;
                for(i=0;i<summaryReportArray.length;i++){
                    
                    individualStatHTML = individualStatHTML + '<tr>';
                    // student_info [0] - Student Name
                    // student_info[1] and [2] - idiom_lower_correct and idiom_lower_attempted
                    // student_info[3] and [4] - idiom_upper_correct and idiom_upper_attempted
                    // student_info[5] and [6] - fill_upper_correct and fill_lower_attempted
                    // student_info[7] and [8] - fill_upper_correct and fill_upper_attempted
                    // student_info[9] and [10] - pinyin_lower_correct and pinyin_lower_attempted
                    // student_info[11] and [12] - pinyin_lower_correct and pinyin_upper_attempted
                    
                    student_info = summaryReportArray[i].split(",");
                    
                    // Add Student Name first 
                    individualStatHTML += '<td>' + student_info[0] + '</td>';
                    // j=1, to start the iteration of the loop on the second element
                    for (j=1;j<student_info.length;j+=2){
                        // calaculating the accuracy of the question_type with respesct to lower/upper pri
                        if (parseInt(student_info[j]) !== 0){
                            compute_acc = (100*student_info[j]/student_info[j+1]);
                            //question_type_acc = (100*student_info[j]/student_info[j+1]).toFixed(2) + "%";
                            // Make it to only display 2 decimal place only
                            question_type_acc = (Math.round(compute_acc * 100) / 100).toFixed(2);
                            individualStatHTML += '<td>' + question_type_acc + '%' +'</td>';
                        }
                        else
                        {
                            individualStatHTML += '<td>' + '0%' + '</td>';
                        }
                    }
                    // Calculcating the total number of question_type correct
                    idioms_correct += parseInt(student_info[1]) + parseInt(student_info[3]);
                    fill_correct += parseInt(student_info[5]) + parseInt(student_info[7]);
                    pinyin_correct += parseInt(student_info[9]) + parseInt(student_info[11]);
      
                    // Calculcating the total number of question_type attempted
                    idioms_attempted += parseInt(student_info[2]) + parseInt(student_info[4]);
                    fill_attempted += parseInt(student_info[6]) + parseInt(student_info[8]);
                    pinyin_attempted += parseInt(student_info[10]) + parseInt(student_info[12]);
                    
                    individualStatHTML += '</tr>';
                    document.getElementById('individualStats').innerHTML = individualStatHTML;
                }
                // Display Average Statistic
                document.getElementById('idiomsAttempted').innerHTML = (idioms_attempted/num_students).toFixed(2);
                document.getElementById('idiomsCorrect').innerHTML = (idioms_correct/num_students).toFixed(2);
                compute_idioms_acc = 100*idioms_correct/idioms_attempted;
                (idioms_attempted > 0 ) ? document.getElementById('idiomsAccuracy').innerHTML = (Math.round(compute_idioms_acc * 100) / 100).toFixed(2) + "%":document.getElementById('idiomsAccuracy').innerHTML = "0%";
                
                document.getElementById('hanyuPinyinAttempted').innerHTML = (pinyin_attempted/num_students).toFixed(2);
                document.getElementById('hanyuPinyinCorrect').innerHTML = (pinyin_correct/num_students).toFixed(2);
                compute_pinyin_acc = 100*pinyin_correct/pinyin_attempted;
                (pinyin_attempted > 0 ) ? document.getElementById('hanyuPinyinAccuracy').innerHTML = (Math.round(compute_pinyin_acc * 100) / 100).toFixed(2) + "%":document.getElementById('hanyuPinyinAccuracy').innerHTML = "0%";
                
                document.getElementById('fillInTheBlanksAttempted').innerHTML = (fill_attempted/num_students).toFixed(2);
                document.getElementById('fillInTheBlanksCorrect').innerHTML = (fill_correct/num_students).toFixed(2);
                compute_fill_acc = 100*fill_correct/fill_attempted;
                (fill_attempted > 0 ) ? document.getElementById('fillInTheBlanksAccuracy').innerHTML = (Math.round(compute_fill_acc * 100) / 100).toFixed(2) + "%":document.getElementById('fillInTheBlanksAccuracy').innerHTML = "0%";
            }
            
            if(this.responseText.length === 1 && this.responseText === "1"){
                console.log("Account_id does not exists");
            }
            if(this.responseText.length === 1 && this.responseText === "2"){
                console.log("No students data at the moment");
            }
            if(this.responseText.length === 1 && this.responseText === "3"){
                console.log("A server error occurred");
            }
        }   
    };
    xmlhttp.open("POST", "../scripts/teacher", true);
    // Request headers required for a POST request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`function_name=${"viewSummaryReport"}`);




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