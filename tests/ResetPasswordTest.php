<?php
session_start();
use PHPUnit\Framework\TestCase;

class ResetPasswordTest extends TestCase{
    public function testResetPasswordSuccess(){
        //resetPassword(string $password, string $token)
        require('scripts\function_resetPassword.php');
        require("scripts\config.php");
        require("scripts\functions_utility.php");

        // Insert test cases
        $username = "studentacc";
        $hash = password_hash("validtoken", PASSWORD_DEFAULT);
        $email = "valid_email@email.com";
        $name = "correct_name";
        $sql = $conn->prepare("INSERT INTO `accounts`(`account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?)");
        $sql->bind_param('sssss', "Student", $username, $hash, $email, $name);
        $sql->execute();

        $account_id = $conn->insert_id;
        $time = time();
        $valid = 1;
        $sql2 = $conn->prepare("INSERT INTO `password_resets` (`account_id`, `email_address`, `timestamp`, `hash`, `valid`) values (?, ?, ?, ?, ?)");
        $sql2->bind_param("issii", $account_id, $email, $time, $hash, $valid);
        $sql2->execute();

        // Outputs: int 1 on invalid token
        $this -> assertEquals(1, resetPassword("Cz3003password", "invalidtoken"));
        //          int 2 on server error after writing a value that exceeds what database can enter
        $this -> assertEquals(2, resetPassword("999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999", $hash));
        //          int 3 on invalid password (length < 8)
        $this -> assertEquals(3, resetPassword("Cz3003p", $hash));   
        //          int 3 on invalid password (no numeric)
        $this -> assertEquals(3, resetPassword("CzLoveSSAD", $hash));     
        //          int 3 on invalid password (no lowercase)
        $this -> assertEquals(3, resetPassword("CZLOVESSAD123", $hash));      
        //          int 3 on invalid password (no uppercase)
        $this -> assertEquals(3, resetPassword("czlovessad123", $hash)); 
        //          int 0 on success
        $this -> assertEquals(0, resetPassword("Cz3003password", $hash));

        # Delete test cases 
        $sql3 = $conn->prepare("DELETE FROM `accounts` WHERE username = ?");
        $sql3->bind_param('s', $username);
        $sql3->execute();

        $sql4 = $conn->prepare("DELETE FROM `password_resets` WHERE account_id = ?");
        $sql4->bind_param('i', $account_id);
        $sql4->execute();
    }
}


