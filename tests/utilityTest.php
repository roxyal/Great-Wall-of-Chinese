<?php
//session_start();
//use PHPUnit\Framework\TestCase;

class utilityTest extends PHPUnit\Framework\TestCase{
    
    public function CheckUsernameExistsTest(){

        require("scripts\config.php");
        require("scripts\functions_utility.php");
        
        // Insert student test case
        $sql = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql->bind_param('isssss', 9999, "Student", "existinguser", "StudentPass123", "valid_email@email.com", "correct_name");
        $sql->execute();
                
        // Outputs: bool true on success
        $this->assertEquals(true, checkUsernameExists("existinguser"));
        
        //          bool false on failure
        $this->assertEquals(false, checkUsernameExists("nonexistinguser"));

        # Delete test cases 
        $sql2 = $conn->prepare("DELETE FROM `accounts` WHERE account_id = ?");
        $sql2->bind_param('i', 9999);
        $sql2->execute();
    }

    public function CheckEmailExistsTest(){

        require("scripts\config.php");
        require("scripts\functions_utility.php");
        
        // Insert student test case
        $sql = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql->bind_param('isssss', 9999, "Student", "studentacc", "StudentPass123", "valid_email@email.com", "correct_name");
        $sql->execute();
                
        // Outputs: bool true on success
        $this->assertEquals(true, checkEmailExists("valid_email@email.com"));
        
        //          bool false on failure
        $this->assertEquals(false, checkEmailExists("invalid_email@email.com"));

        # Delete test cases 
        $sql2 = $conn->prepare("DELETE FROM `accounts` WHERE account_id = ?");
        $sql2->bind_param('i', 9999);
        $sql2->execute();
    }

    public function CheckTeacherExistsTest(){

        require("scripts\config.php");
        require("scripts\functions_utility.php");
        
        // Insert teacher test case
        $sql = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql->bind_param('isssss', 9999, "Teacher", "teacheracc", "TeacherPass123", "valid_email@email.com", "correct_name");
        $sql->execute();
                
        // Outputs: bool true on success
        $this->assertEquals(true, checkTeacherExists(9999));
        
        //          bool false on failure
        $this->assertEquals(false, checkTeacherExists(9998));

        # Delete test cases 
        $sql2 = $conn->prepare("DELETE FROM `accounts` WHERE account_id = ?");
        $sql2->bind_param('i', 9999);
        $sql2->execute();
    }

    public function CheckAccountIdExistsTest(){

        require("scripts\config.php");
        require("scripts\functions_utility.php");
        
        // Insert teacher test case
        $sql = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql->bind_param('isssss', 9999, "Student", "studentacc", "StudentPass123", "valid_email@email.com", "correct_name");
        $sql->execute();
                
        // Outputs: bool true on success
        $this->assertEquals(true, checkAccountIdExists(9999));
        
        //          bool false on failure
        $this->assertEquals(false, checkAccountIdExists(9998));

        # Delete test cases 
        $sql2 = $conn->prepare("DELETE FROM `accounts` WHERE account_id = ?");
        $sql2->bind_param('i', 9999);
        $sql2->execute();
    }

    public function ValidTokenTest(){

        require("scripts\config.php");
        require("scripts\functions_utility.php");
        
        // Insert password reset test case
        $account_id = 9999;
        $email = "valid_email@email.com";
        $time = time();
        $hash = password_hash("validtoken", PASSWORD_DEFAULT);
        $valid = 1;
        $sql = $conn->prepare("INSERT INTO `password_resets` (`account_id`, `email_address`, `timestamp`, `hash`, `valid`) values (?, ?, ?, ?, ?)");
        $sql->bind_param("issii", $account_id, $email, $time, $hash, $valid);
        $sql->execute();
                
        // Outputs: bool true on success
        $this->assertEquals(true, validToken($hash));
        
        //          bool false on failure
        $this->assertEquals(false, validToken("invalidtoken"));

        # Delete test cases 
        $sql2 = $conn->prepare("DELETE FROM `password_resets` WHERE account_id = ?");
        $sql2->bind_param('i', 9999);
        $sql2->execute();
    }
}


