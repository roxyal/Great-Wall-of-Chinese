<?php
//session_start();
//use PHPUnit\Framework\TestCase;

class studentTest extends PHPUnit\Framework\TestCase{
    
    public function testViewProfile(){

        require("scripts\config.php");
        require("scripts\functions_utility.php");
        require('scripts\function_createAccount.php');
        
        // Insert student test case
        $account_id = 9999; 
        $sql = $conn->prepare("INSERT INTO `students`(`student_id`, `character_type`, `teacher_account_id`) VALUES (?, ?, ?)");
        $sql->bind_param('iii', $account_id, 1, 1);
        $sql->execute();

        $sql2 = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql2->bind_param('isssss', 9999, "Student", "studentacc", "StudentPass123", "valid_email@email.com", "correct_name");
        $sql2->execute();
        
        $test_profile = array(
                        'student_id' => $account_id,
                        'character_type'   => 1,
                        'teacher_account_id'  => 1,
                        'idiom_lower_correct' => 0,
                        'idiom_lower_attempted' => 0,
                        'idiom_lower_reset_date' => 0,
                        'idiom_upper_correct' => 0,
                        'idiom_upper_attempted' => 0,
                        'idiom_upper_reset_date' => 0,
                        'fill_lower_correct'  => 0,
                        'fill_lower_attempted'  => 0,
                        'fill_lower_reset_date'  => 0,
                        'fill_upper_correct'  => 0,
                        'fill_upper_attempted'  => 0,
                        'fill_upper_reset_date'  => 0,
                        'pinyin_lower_correct'  => 0,
                        'pinyin_lower_attempted'  => 0,
                        'pinyin_lower_reset_date'  => 0,
                        'pinyin_upper_correct'  => 0,
                        'pinyin_upper_attempted'  => 0,
                        'pinyin_upper_reset_date'  => 0);
                
        // Outputs: int 0 on success on viewing the profile (return an Array)
        $student_id = 9999;
        $result_0 = $student->viewProfile($student_id);
        $this->assertEquals($test_profile, $result_0);
        
        //          int 1 on invalid account id
        $student_id = 9998;
        $result_1 = $student->viewProfile($student_id);
        $this->assertEquals(0, $result_1);

        //          int 2 on server error
        $student_id = 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
        $result_2 = $student->viewProfile($student_id);
        $this->assertEquals(0, $result_2);

        # Delete successful testcase after testing 
        $sql3 = $conn->prepare("DELETE FROM `accounts` WHERE account_id = ?");
        $sql3->bind_param('s', $account_id);
        $sql3->execute();

        $sql4 = $conn->prepare("DELETE FROM `students` WHERE student_id = ?");
        $sql4->bind_param('i', $account_id);
        $sql4->execute();
    }

    public function testSendPvpRequestTest(){

        require 'scripts\config.php';
        $student_conn = new Student($conn);
        
        // Outputs: int 0 on success on sending Pvp invitation to opponent
        //          int 1 on user SendPvpRequest and choose CustomGame Mode, but user never create before 
        //          int 2 on server error

        // Return 1
        $requester_id_noCustomGame = 1;
        $opponent_id = 3;
        $pvp_room_type = 0; // Choose CustomGame Mode
        $result_1 = $student_conn->sendPvpRequest($requester_id_noCustomGame, $opponent_id, $pvp_room_type);
        $this->assertEquals(1, $result_1);

        // Return 0 
        $requester_id_noCustomGame = 3;
        $opponent_id = 1;
        $pvp_room_type = 0; // Choose CustomGame Mode
        $result_1 = $student_conn->sendPvpRequest($requester_id_noCustomGame, $opponent_id, $pvp_room_type);
        $this->assertEquals(0, $result_1);
    }

    public function testAcceptPvpRequestTest(){

        require 'scripts\config.php';
        $student_conn = new Student($conn);
        
        // Outputs: int 0 on success on accept/reject pvp request
        //          int 2 on server error
        
        $requester_id = 1;
        $opponent_id = 3;
        $status = 0; 
        $result_0 = $student_conn->acceptPvpRequest($requester_id, $opponent_id, $status);
        $this->assertEquals(0, $result_0);
    }

    public function testCreateCustomGameTest(){

        require 'scripts\config.php';
        $student_conn = new Student($conn);
        
        // Outputs: int 0 on success on accept pvp request
        //          int 2 on server error
        
        $account_id = 4;
        $idiom_lower_count = 2;
        $idiom_upper_count = 0;
        $fill_lower_count = 0;
        $fill_upper_count = 3;
        $pinyin_lower_count = 0;
        $pinyin_upper_count = 0;

        $result_0 = $student_conn->createCustomGame($account_id, $idiom_lower_count, $idiom_upper_count,
                                                    $fill_lower_count, $fill_upper_count,
                                                    $pinyin_lower_count, $pinyin_upper_count);
        $this->assertEquals(0, $result_0);
    }
}


