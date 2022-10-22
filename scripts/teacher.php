<?php
include "config.php";
include "functions_utility.php";

// Retrieve the account_id(teacher_id) using session
$account_id = getLoggedInAccountId();
$created_timestamp = time();

$teacher = new Teacher($conn);

if(isset($_POST["assignmentName"]) && isset($_POST["dateInput"]) && isset($_POST["qnSendToBackend"])
        && isset($_POST["function_name"]) && $_POST["function_name"] == "createAssignment"){
    echo $teacher->createAssignment($_POST["assignmentName"], $account_id, $created_timestamp, $teacher->convertDateToInt($_POST["dateInput"]), $_POST["qnSendToBackend"]);
}

// A Teacher class that holds all the function needed for teacher
class Teacher{
    
    private $conn;
    
    // A constructor that calls database controller once.
    public function __construct($db)
    {
        $this->conn = $db;
    }
   
    // Functions: A function for teachers to create assignment
    // Inputs: int $account_id (teacher_id)
    // Outputs: Upon success, will return 0. Successfully create assignment
    //          int 1 on the teacher is not exists
    //          int 2 on database error
    function createAssignment(string $assignment_name, int $account_id, int $created_timestamp, int $due_timestamp, string $questions)
    {
        // Check if account id exists
        if(!checkAccountIdExists($account_id)) return 1;

        // Iterate through the questions, as questions is an arrayList
        // $sql_var[0] - question
        // $sql_var[1] - choice1, questions[x][2]-choice2, questions[x][3]-choice3, questions[x][4]-choice4
        // $sql_var[5] - answer
        // $sql_var[6] - explanation

        $arrayOfQuestion = $this->stringToArray($questions, '|');

        for ($x = 0; $x < count($arrayOfQuestion); $x++)
        {
            // First SQL statement is to insert the questions to the questions_bank table
            
            $sql_1 = "INSERT INTO questions_bank(question, choice1, choice2, choice3, choice4, answer, explanation, account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt_1 = $this->conn->prepare($sql_1);

            $sql_var = $this->stringToArray($arrayOfQuestion[$x], ',');

            if(
                $stmt_1->bind_param('sssssssi', $sql_var[0], $sql_var[1], $sql_var[2], $sql_var[3],
                                                $sql_var[4], $sql_var[5], $sql_var[6], $account_id) &&
                $stmt_1->execute()
            ){
                continue;
            }
            else
            {
                if($debug_mode) echo $this->conn->error;
                        return 2; // ERROR with database SQL
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
                return 2; // ERROR with database SQL
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
    
    // Functions: A function for teachers to view students' summary report
    // Inputs: int $teacher_account_id
    // Outputs: Upon success, will return an ArrayOfList of information of the students under him/her
    //          int 1 on the teacher is not exists
    //          int 2 on teacher want to viewSummaryReport but has no students under him/her
    //          int 3 database error
    public function viewSummaryReport($teacher_account_id)
    {
        // Check to see if account_id exist
        if (!checkTeacherExists($teacher_account_id)) return 1;

        // Check to see if teacher has students
        if (!$this->checkTeacherHasStudentExists($teacher_account_id)) return 2;
        
        $sql = "SELECT student_id, character_type, idiom_lower_accuracy, idiom_upper_accuracy, fill_lower_accuracy, fill_upper_accuracy, pinyin_lower_accuracy, pinyin_upper_accuracy FROM students WHERE teacher_account_id = ?";
        $stmt = $this->conn->prepare($sql);
        $students_summary = [];
        
        if (
                $stmt->bind_param('i', $teacher_account_id) &&
                $stmt->execute()
        ){
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc())
            {
                array_push($students_summary, $row);
            }
            return $students_summary;
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                return 3; // ERROR with database SQL
        }       
    }
    
    // Helper function to convert the questions stringToArray format
    function stringToArray($questions, $delimiter)
    {
        $delimiter = $delimiter;
        $word = explode($delimiter, $questions); 
        return $word;
    }

    // Helper function to convert the date format send from frontend to UNIX time
    function convertDateToInt($date)
    {
        $delimiter = '-';
        $word = explode($delimiter, $date); 
        $str_date = array($word[2], $word[1], $word[0]);
        $str_date = join("-", $str_date);
        $int_date = strtotime($str_date);

        return $int_date; 
    }
}

