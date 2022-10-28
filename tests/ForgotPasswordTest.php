<?php
session_start();
use PHPUnit\Framework\TestCase;

class ForgotPasswordTest extends TestCase{
    public function ForgotPasswordTest(){
        require('scripts\function_forgotPassword.php');
        require("scripts\config.php");
        require("scripts\functions_utility.php");

        // Insert student test cases
        $username = "studentacc";
        $hash = password_hash("validtoken", PASSWORD_DEFAULT);
        $email = "valid_email@email.com";
        $name = "correct_name";
        $sql = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql->bind_param('isssss', 9999, "Student", $username, $hash, $email, $name);
        $sql->execute();

        $username2 = "studentacc2";
        $hash2 = password_hash("validtoken", PASSWORD_DEFAULT);
        $email2 = "clash_email@email.com";
        $name2 = "correct_name2";
        $sql2 = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql2->bind_param('isssss', 9998, "Student", $username2, $hash2, $email2, $name2);
        $sql2->execute();

        // Insert password reset test cases
        $time = time();
        $valid = 1;
        $sql3 = $conn->prepare("INSERT INTO `password_resets` (`account_id`, `email_address`, `timestamp`, `hash`, `valid`) values (?, ?, ?, ?, ?)");
        $sql3->bind_param("issii", 9999, $email, $time, $hash, $valid);
        $sql3->execute();

        $sql4 = $conn->prepare("INSERT INTO `password_resets` (`account_id`, `email_address`, `timestamp`, `hash`, `valid`) values (?, ?, ?, ?, ?)");
        $sql4->bind_param("issii", 9998, $email2, $time, $hash2, $valid);
        $sql4->execute();

        $sql5 = $conn->prepare("INSERT INTO `password_resets` (`account_id`, `email_address`, `timestamp`, `hash`, `valid`) values (?, ?, ?, ?, ?)");
        $sql5->bind_param("issii", 9998, $email2, $time, $hash2, $valid);
        $sql5->execute();

        // Outputs: int 1 on invalid email
        $this -> assertEquals(1, forgotPassword("invalid_email@email.com"));
        //          int 2 on server error after writing a value that exceeds what database can enter
        $this -> assertEquals(2, forgotPassword("999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999"));      
        //          int 3 on failure to send email
        //          int 4 on recent password reset detected
        $this -> assertEquals(4, forgotPassword("clash_email@email.com")); 
        //          int 0 on success
        $this -> assertEquals(0, forgotPassword("valid_email@email.com"));

        # Delete test cases 
        $sql6 = $conn->prepare("DELETE FROM `accounts` WHERE account_id = ?");
        $sql6->bind_param('i', 9999);
        $sql6->execute();

        $sql7 = $conn->prepare("DELETE FROM `accounts` WHERE account_id = ?");
        $sql7->bind_param('i', 9998);
        $sql7->execute();

        $sql8 = $conn->prepare("DELETE FROM `password_resets` WHERE account_id = ?");
        $sql8->bind_param('i', 9999);
        $sql8->execute();

        $sql9 = $conn->prepare("DELETE FROM `password_resets` WHERE account_id = ?");
        $sql9->bind_param('i', 9998);
        $sql9->execute();
    }
}


