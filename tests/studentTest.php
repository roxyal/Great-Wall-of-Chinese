<?php
//session_start();
//use PHPUnit\Framework\TestCase;

class studentTest extends PHPUnit\Framework\TestCase{
    
    public function testViewProfile(){

        require 'scripts\config.php';
        require 'scripts\student.php';
        $student = new Student($conn);
        // Outputs: int 0 on success on viewing the profile (return an Array)
        //          int 2 on server error
        
        // User view a profile using student_id
        // It returns an array of information about that student that he click
        $test_profile = array(
                        'student_id' => 1,
                        'character_type'   => 'Wu Kong',
                        'idiom_lower_accuracy' => 15,
                        'idiom_upper_accuracy' => 29,
                        'fill_lower_accuracy'  => 74,
                        'fill_upper_accuracy'  => 23,
                        'pinyin_lower_accuracy'=> 32,
                        'pinyin_upper_accuracy'=> 60,
                        'name' => 'Kelvin');
                
        $student_id = 1;
        $result_0 = $student->viewProfile($student_id);
        $this->assertEquals($test_profile, $result_0);
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


