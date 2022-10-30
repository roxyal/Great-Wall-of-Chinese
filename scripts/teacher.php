<?php
include "config.php";
include "functions_utility.php";

// Retrieve the account_id(teacher_id) using session
$account_id = getLoggedInAccountId();
$created_timestamp = time();

$teacher = new Teacher($conn);

// triggerCreateAssignment
if(isset($_POST["assignmentName"]) && isset($_POST["dateInput"]) && isset($_POST["qnSendToBackend"])
        && isset($_POST["function_name"]) && $_POST["function_name"] == "createAssignment"){
    echo $teacher->createAssignment($_POST["assignmentName"], $account_id, $created_timestamp, convertDateToInt($_POST["dateInput"]), $_POST["qnSendToBackend"]);
}

// triggerSendToStudents
if(isset($_POST["assignmentName"]) && isset($_POST["function_name"]) && $_POST["function_name"] == "sendToStudents"){
    echo $teacher->sendToStudents($_POST["assignmentName"], $account_id);
}

// triggerDeleteAssignment
if(isset($_POST["assignmentToDelete"]) && isset($_POST["function_name"]) && $_POST["function_name"] == "deleteAssignment"){
    echo $teacher->deleteAssignment($account_id, $_POST["assignmentToDelete"]);
}

// triggerViewSummaryReport
if(isset($_POST["function_name"]) && $_POST["function_name"] == "viewSummaryReport"){
    echo $teacher->viewSummaryReport($account_id);
}

// triggerViewAllAssignment
if(isset($_POST["function_name"]) && $_POST["function_name"] == "viewAllAssignment"){
    echo $teacher->viewAllAssignment($account_id);
}

if(isset($_POST["assignmentSubmissions"]) && $_POST["assignmentSubmissions"] !== "") {
    echo $teacher->viewAssignmentSubmissions($account_id, $_POST["assignmentSubmissions"]);
}


// A Teacher class that holds all the function needed for teacher
class Teacher{
    
    private $conn;
    
    // A constructor that calls database controller once.
    public function __construct($db)
    {
        $this->conn = $db;
    }
   
    // Function: helper function to check if the assignmentName has been created before
    //           To prevent having duplicates assignmentName
    // Inputs: int int $account_id, string assignmentName
    //                                    
    // Outputs: TRUE: database already have this name which is created before by the user
    //          False: database never find this custom
    public function checkAssignmentNameExists(int $account_id, string $assignment_name): bool
    {
        // Check through the database to see if the user has a customLevelName which is created before
        $sql = "SELECT * FROM assignments WHERE account_id = ? AND assignment_name = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("is", $account_id, $assignment_name);
        $stmt->execute();
        $stmt->store_result();
        if($stmt->num_rows > 0) return true;
        return false;
    }

    // Functions: A function for teachers to send assignment to students
    // Inputs : int $assignmentName
    // Outputs: int 0 on successfully sent to students
    //          int 1 when teacher does not exist
    //          int 2 on assignment does not exist
    //          int 3 on database error
    public function sendToStudents(string $assignment_name, int $account_id){
        // Check if account id exists
        if(!checkAccountIdExists($account_id)) return 1;
        
        // Check if AssignmentName exists
        if(!$this->checkAssignmentNameExists($account_id, $assignment_name)) return 2;
        
        $sql = "UPDATE assignments SET sent_to_students = 1 WHERE assignment_name = ?";
        $stmt = $this->conn->prepare($sql);

        if( 
            $stmt->bind_param('s', $assignment_name) &&
            $stmt->execute()
        ){
            return 0;
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                    return 3; // ERROR with database SQL
        }


    }

    // Functions: A function for teachers to create assignment
    // Inputs: int $account_id (teacher_id)
    // Outputs: Upon success, will return 0. Successfully create assignment
    //          int 1 on the teacher is not exists
    //          int 2 on database error
    public function createAssignment(string $assignment_name, int $account_id, int $created_timestamp, int $due_timestamp, string $questions)
    {
        // Check if account id exists
        if(!checkAccountIdExists($account_id)) return 1;

        // Check if AssignmentName exists
        if($this->checkAssignmentNameExists($account_id, $assignment_name)) return 2;
        
        // AssignmentName must at least be 2 letters
        if (strlen($assignment_name) < 2) return 3;
        
        // Iterate through the questions, as questions is an arrayList
        // $sql_var[0] - question
        // $sql_var[1]-[4] = choice1 - choice4
        // $sql_var[5] - answer
        // $sql_var[6] - explanation

        $arrayOfQuestion =  stringToArray($questions, '|');

        for ($x = 0; $x < count($arrayOfQuestion); $x++)
        {
            // First SQL statement is to insert the questions to the questions_bank table
            
            $sql_1 = "INSERT INTO questions_bank(assignment_name, question, choice1, choice2, choice3, choice4, answer, explanation, account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt_1 = $this->conn->prepare($sql_1);
            
            $sql_var = stringToArray($arrayOfQuestion[$x], ',');

            if(
                $stmt_1->bind_param('ssssssssi', $assignment_name, $sql_var[0], $sql_var[1], $sql_var[2],
                                                $sql_var[3], $sql_var[4], $sql_var[5], $sql_var[6], $account_id) &&
                $stmt_1->execute()
            ){
                continue;
            }
            else
            {
                if($debug_mode) echo $this->conn->error;
                        return 4; // ERROR with database SQL
            }
        }
        // Second SQL statement is to insert into the assignment_table
        $sql_2 = "INSERT INTO assignments(assignment_name, account_id, created_timestamp, due_timestamp, questions) VALUES (?, ?, ?, ?, ?)";
        $stmt_2 = $this->conn->prepare($sql_2);

        if(
            $stmt_2->bind_param('siiis', $assignment_name, $account_id, $created_timestamp, $due_timestamp,
                                            $questions) &&
            $stmt_2->execute()
        ){
            return 0;
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                return 4; // ERROR with database SQL
        }
    }
    
    // A utility function to check if the teacher has any students
    public function checkTeacherHasStudentExists($teacher_account_id) : bool
    {
        $sql = "SELECT * FROM students WHERE teacher_account_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('i', $teacher_account_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $num_row = $result->num_rows;
        if($num_row < 1){
            return false;
        } 
        return true;
    }
    
    // Function: Teacher can delete assignment which is created by them
    // Inputs: int int $teacher_account_id, string $assignmentName
    //                                    
    // Outputs: Int 0 on success, successfully deleted Assignment
    //          int 1 on account_id is not exists
    //          int 2 on server error. 
    public function deleteAssignment(int $teacher_account_id, string $assignmentName)
    {
        // Check to see if account_id exists
        if (!checkAccountIdExists($teacher_account_id)) return 1;

        // Check if AssignmentName exists
        if(!$this->checkAssignmentNameExists($teacher_account_id, $assignmentName)) return 3;
        
        // Delete the Assignment from the table, based on account_id and assignmentName
        $sql_1 = "DELETE FROM assignments WHERE account_id = ? AND assignment_name = ?";
        $stmt_1 = $this->conn->prepare($sql_1);
        
        // After that, that specific assignment_id row will be deleted from the database
        if( 
            $stmt_1->bind_param('is', $teacher_account_id, $assignmentName) &&
            $stmt_1->execute()
        ){
            // When the assignment is deleted from the assignment table, the questions_bank question also must be deleted
            // Delete the Assignment question from the question_bank based on account_id and assignmentName
            $sql_2 = "DELETE FROM questions_bank WHERE account_id = ? AND assignment_name = ?";
            $stmt_2 = $this->conn->prepare($sql_2);
            if( 
                $stmt_2->bind_param('is', $teacher_account_id, $assignmentName) &&
                $stmt_2->execute()
            ){
                return 0;
            }
            else
            {
                if($debug_mode) echo $this->conn->error;
                    return 2; // ERROR with database SQL
            }
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                return 2; // ERROR with database SQL
        }
    }
    
    // Functions: Teacher can view all their created Assignments
    // Inputs: int $teacher_account_id
    // Outputs: Upon success, will return a string of AssignmentNames 
    //          int 1 on player that you want to view does not exists
    //          int 2 on database error
    public function viewAllAssignment(int $teacher_account_id)
    {
        // Check if user id exists
        if (!checkAccountIdExists($teacher_account_id)) return 1;
        
        $assignmentName_str = '';
        
        // sql statement to retrieve all the Assignment's name created by the $teacher_account_id
        $sql = "SELECT assignment_name, created_timestamp, due_timestamp FROM assignments WHERE account_id = ?";
        $stmt = $this->conn->prepare($sql);
        
        if( 
            $stmt->bind_param('i', $teacher_account_id) &&
            $stmt->execute()

        ){
            $result = $stmt->get_result();
            $num_rows = $result->num_rows;
            
            $count = 0;
            $comma = ',';
            while ($row = $result->fetch_assoc())
            {
                // Concatenate all the AssignmentName created by the user into a string format
                $assignmentName_str = $assignmentName_str.$row['assignment_name'].$comma.
                convertIntToDate($row['created_timestamp']).$comma.
                convertIntToDate($row['due_timestamp']);

                if ($count+1 != $num_rows)
                    $assignmentName_str = $assignmentName_str.'|';
                $count = $count + 1;
            }
            return $assignmentName_str;
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                    return 2; // ERROR with database SQL
        }
    }
    
    // Functions: A function for teachers to view students' summary report
    // Inputs: int $teacher_account_id
    // Outputs: Upon success, will return a string of information of all its students
    // Example: Kelvin,5,10,0,0,0,0,0,0,15,20,0,0 | Kelly,10,10,0,0,0,0,0,0,20,20,0,0
    //          int 1 on the teacher is not exists
    //          int 2 on teacher want to viewSummaryReport but has no students under him/her
    //          int 3 database error
    public function viewSummaryReport($teacher_account_id)
    {
        // Check to see if account_id exist
        if (!checkTeacherExists($teacher_account_id)) return 1;

        // Check to see if teacher has students
        if (!$this->checkTeacherHasStudentExists($teacher_account_id)) return 2;
        
        $sql = "SELECT a.name, s.idiom_lower_correct, s.idiom_lower_attempted, s.idiom_upper_correct, s.idiom_upper_attempted,
                 s.fill_lower_correct, s.fill_lower_attempted, s.fill_upper_correct, s.fill_upper_attempted,
                 s.pinyin_lower_correct, s.pinyin_lower_attempted, s.pinyin_upper_correct, s.pinyin_upper_attempted
                 FROM students s INNER JOIN accounts a ON s.student_id = a.account_id WHERE s.teacher_account_id = ?";
        
        $stmt = $this->conn->prepare($sql);
        $students_summary_str = "";
        
        if (
                $stmt->bind_param('i', $teacher_account_id) &&
                $stmt->execute()
        ){
            $result = $stmt->get_result();
            $num_rows = $result->num_rows;
            $count = 0;
            $comma = ',';
            while ($row = $result->fetch_assoc())
            {
                // Concatenate all the customName created by the user into a string format
                $students_summary_str = $students_summary_str.$row['name'].$comma.
                        $row['idiom_lower_correct'].$comma.$row['idiom_lower_attempted'].
                        $comma.$row['idiom_upper_correct'].$comma.$row['idiom_upper_attempted'].$comma.$row['fill_lower_correct'].
                        $comma.$row['fill_lower_attempted'].$comma.$row['fill_upper_correct'].
                        $comma.$row['fill_upper_attempted'].$comma.$row['pinyin_lower_correct'].
                        $comma.$row['pinyin_lower_attempted'].$comma.$row['pinyin_upper_correct'].
                        $comma.$row['pinyin_upper_attempted'];

                if ($count+1 != $num_rows)
                    $students_summary_str = $students_summary_str.'|';
                $count = $count + 1;
            }
            return $students_summary_str;
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                return 3; // ERROR with database SQL
        }       
    }

    public function viewAssignmentSubmissions($teacher_account_id, $assignment_name)
    {
        // Check to see if account_id exist
        if (!checkTeacherExists($teacher_account_id)) return 1;

        // Check to see if teacher has students
        if (!$this->checkTeacherHasStudentExists($teacher_account_id)) return 2;
        
        $sql = "SELECT accounts.username, max(assignments_log.timestamp) as submittedtime, questions_bank.answer = assignments_log.answer as correct FROM `assignments_log` JOIN questions_bank on questions_bank.question_id = assignments_log.question_id JOIN accounts on assignments_log.account_id = accounts.account_id WHERE `assignments_log`.`assignment_id`= (SELECT assignment_id from assignments where assignment_name = ?) GROUP BY accounts.username";
        
        $stmt = $this->conn->prepare($sql);
        $output = "";

        if (
                $stmt->bind_param('s', $assignment_name) &&
                $stmt->execute()
        ){
            $result = $stmt->get_result();
            $num_rows = $result->num_rows;
            $count = 0;
            while ($row = $result->fetch_assoc())
            {
                $output .= $row["username"].",".convertIntToDate($row["submittedtime"]).",".$row["correct"];

                if ($count+1 != $num_rows)
                    $output .= '|';
                $count++;
            }
            return $output;
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                return 3; // ERROR with database SQL
        }       
    }
}

