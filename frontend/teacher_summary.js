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
                        question_type_acc = (100*student_info[j]/student_info[j+1]).toFixed(2) + "%";
                        individualStatHTML += '<td>' + question_type_acc + '</td>';
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
                document.getElementById('idiomsAccuracy').innerHTML = (100*idioms_correct/idioms_attempted).toFixed(2) + "%";
                
                document.getElementById('hanyuPinyinAttempted').innerHTML = (pinyin_attempted/num_students).toFixed(2);
                document.getElementById('hanyuPinyinCorrect').innerHTML = (pinyin_correct/num_students).toFixed(2);
                document.getElementById('hanyuPinyinAccuracy').innerHTML = (100*pinyin_correct/pinyin_attempted).toFixed(2) + "%";
                
                document.getElementById('fillInTheBlanksAttempted').innerHTML = (fill_attempted/num_students).toFixed(2);
                document.getElementById('fillInTheBlanksCorrect').innerHTML = (fill_correct/num_students).toFixed(2);
                document.getElementById('fillInTheBlanksAccuracy').innerHTML = (100*fill_correct/fill_attempted).toFixed(2) + "%";
            }
            
            if(this.responseText === 1 && this.responseText === "1"){
                console.log("Account_id does not exists");
            }
            if(this.responseText === 1 && this.responseText === "2"){
                console.log("No students data at the moment");
            }
            if(this.responseText === 1 && this.responseText === "3"){
                console.log("A server error occurred");
            }
        }   
    };
    xmlhttp.open("POST", "../scripts/teacher", true);
    // Request headers required for a POST request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`function_name=${"viewSummaryReport"}`);


