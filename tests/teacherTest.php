<?php
//session_start();
//use PHPUnit\Framework\TestCase;

class teacherTest extends PHPUnit\Framework\TestCase{

    public function CreateAssignmentTest(){
        //createAssignment(string $assignment_name, int $account_id, int $created_timestamp, int $due_timestamp, string $questions)
        require("scripts\config.php");
        require("scripts\functions_utility.php");
        require("scripts\teacher.php");
        
        // Insert teacher test cases
        $time = time();
        $sql = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql->bind_param('isssss', 9999, "Teacher", "teacheracc", "TeacherPass123", "valid_email@email.com", "correct_name");
        $sql->execute();

        // Outputs: int 0 on success (1 qn)
        $this->assertEquals(0, $teacher->createAssignment("testassignment", 9999, $time, $time, "qn,ans1,ans2,ans3,ans4,ans,explain"));
        //          int 0 on success (>1 qn)
        $this->assertEquals(0, $teacher->createAssignment("testassignment2", 9999, $time, $time, "qn,ans1,ans2,ans3,ans4,ans,explain|qn,ans1,ans2,ans3,ans4,ans,explain"));
        //          int 1 on non existing teacher
        $this->assertEquals(1, $teacher->createAssignment("testassignment3", 1111, $time, $time, "qn,ans1,ans2,ans3,ans4,ans,explain"));
        //          int 2 on existing assignment name
        $this->assertEquals(2, $teacher->createAssignment("testassignment", 9999, $time, $time, "qn,ans1,ans2,ans3,ans4,ans,explain"));
        //          int 3 on assignment name < length 2
        $this->assertEquals(3, $teacher->createAssignment("a", 9999, $time, $time, "qn,ans1,ans2,ans3,ans4,ans,explain"));
        //          int 4 on server error
        $this->assertEquals(4, $teacher->createAssignment("999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999", 9999, $time, $time, "qn,ans1,ans2,ans3,ans4,ans,explain"));

        # Delete test cases 
        $sql2 = $conn->prepare("DELETE FROM `questions_bank` WHERE `account_id` = ?");
        $sql2->bind_param('i', 9999);
        $sql2->execute();

        $sql3 = $conn->prepare("DELETE FROM `assignments` WHERE `account_id` = ?");
        $sql3->bind_param('i', 9999);
        $sql3->execute();

        $sql4 = $conn->prepare("DELETE FROM `accounts` WHERE `account_id` = ?");
        $sql4->bind_param('i', 9999);
        $sql4->execute();
    }

    public function ViewSummaryReportTest(){
        require("scripts\config.php");
        require("scripts\functions_utility.php");
        require("scripts\teacher.php");
        
        // Insert student test case
        $sql = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql->bind_param('isssss', 9997, "Student", "studentacc", "StudentPass123", "valid_email@email.com", "correct_name");
        $sql->execute();

        $sql2 = $conn->prepare("INSERT INTO `students`(`student_id`, `character_type`, `teacher_account_id`) VALUES (?, ?, ?)");
        $sql2->bind_param('iii', 9997, 1, 9999);
        $sql2->execute();

        // Insert teacher test cases
        $sql3 = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql3->bind_param('isssss', 9999, "Teacher", "teacheracc", "TeacherPass123", "valid_email2@email.com", "correct_name");
        $sql3->execute();

        $sql4 = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql4->bind_param('isssss', 9998, "Teacher", "teacheracc2", "TeacherPass123", "valid_email3@email.com", "correct_name");
        $sql4->execute();

        // Lets say the teacher has one student tied under him
        $test_string = "correct_name,0,0,0,0,0,0,0,0,0,0,0,0";
        
        // Outputs: int 0 on success
        $this->assertEquals($test_string, $teacher->viewSummaryReport(9999));
        //          int 1 on non existing teacher
        $this->assertEquals(1, $teacher->viewSummaryReport(1111));
        //          int 2 on no students under the teacher
        $this->assertEquals(2, $teacher->viewSummaryReport(9998));
        //          int 3 on server error
        $this->assertEquals(3, $teacher->viewSummaryReport(9999999999999999999999999999999999999999));

        # Delete test cases 
        $sql5 = $conn->prepare("DELETE FROM `accounts` WHERE `name` = ?");
        $sql5->bind_param('s', "correct_name");
        $sql5->execute();

        $sql6 = $conn->prepare("DELETE FROM `students` WHERE student_id = ?");
        $sql6->bind_param('i', 9997);
        $sql6->execute();
    }
}


