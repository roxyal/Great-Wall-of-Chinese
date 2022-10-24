// link backend here to get individual stats

let individualStatHTML = '';

// loop through to add into individualStatsHTML

individualStatHTML += `<tr>
							<td>STUDENT NAME</td>
							<td>IDOIMS LOWER PRI ACC</td>
							<td>IDOIMS UPPER PRI ACC</td>
							<td>FILL IN THE BLANKS LOWER PRI ACC</td>
							<td>FILL IN THE BLANKS ACC</td>
							<td>HANYU PINYIN LOWER PRI ACC</td>
							<td>HANYU PINYIN UPPER PRI ACC</td>
					   </tr>`; // for testing

document.getElementById('individualStats').innerHTML = individualStatHTML;		


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


// link backend here then fill in accordingly
