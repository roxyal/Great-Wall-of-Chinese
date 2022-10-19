<?php

//require "functions_utility.php";
// A Teacher class that holds all the function needed for teacher
class Teacher{
    
    private $conn;
    
    // A constructor that calls database controller once.
    public function __construct($db)
    {
        $this->conn = $db;
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
    
    // A function for teachers to view students' summary report
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
}

