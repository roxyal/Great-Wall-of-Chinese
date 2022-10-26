<?php
//session_start();
//use PHPUnit\Framework\TestCase;

class teacherTest extends PHPUnit\Framework\TestCase{
    public function testViewSummaryReportTest(){
        require 'scripts\config.php';
        require 'scripts\teacher.php';

        // Outputs: int 0 on success
        //          int 1 on no student tied with the teacher
        //          int 2 on server error
        
        // Create a class teacher so that we call its function
        $teacher = new Teacher($conn);

        // Taking a teacher's account_id with no student tied to it
        $noStudent_teacher_account_id = 3;
        $result_1 = $teacher->viewSummaryReport($noStudent_teacher_account_id);
        $this->assertEquals(1, $result_1);

        // Lets say the teacher has one student tied under him
        $test_array = array(0=>array(
                            'student_id' => 1,
                            'character_type'   => 'Wu Kong',
                            'idiom_lower_accuracy' => 15,
                            'idiom_upper_accuracy' => 29,
                            'fill_lower_accuracy'  => 74,
                            'fill_upper_accuracy'  => 23,
                            'pinyin_lower_accuracy'=> 32,
                            'pinyin_upper_accuracy'=> 60));
        
        $hasStudent_teacher_account_id = 2;
        $result_0 = $teacher->viewSummaryReport($hasStudent_teacher_account_id);
        $this->assertEquals($test_array, $result_0 );
    }


}


