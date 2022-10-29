<?php
session_start();
use PHPUnit\Framework\TestCase;

class CreateAccountTest extends TestCase{
    public function CreateAccountTest(){
        //createAccount(string $username, string $name, string $email, string $password, int $teacher_id, int $character)
        require('scripts\function_createAccount.php');
        require("scripts\config.php");
        require("scripts\functions_utility.php");

        // Insert teacher test case
        $sql = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql->bind_param('isssss', 1111, "Teacher", "teacheracc", "TeacherPass123", "valid_email0@email.com", "correct_name");
        $sql->execute();

        // Outputs: int 0 on success
        $this -> assertEquals(0, createAccount("correctusername", "correct_name", "valid_email@email.com", "Cz3003password", 1111, 1));
        //          int 1 on email taken 
        $this -> assertEquals(1, createAccount("correctusername", "correct_name", "valid_email@email.com", "Cz3003password", 1111, 1));
        //          int 2 on username taken
        $this -> assertEquals(2, createAccount("correctusername", "correct_name", "valid_email@gmail.com", "Cz3003password", 1111, 1));
        //          int 3 on invalid teacher id
        $this -> assertEquals(3, createAccount("correctusername3", "correct_name", "valid_email3@gmail.com", "Cz3003password", 9999, 1));   
        //          int 4 on invalid character id
        $this -> assertEquals(4, createAccount("correctusername4", "correct_name", "valid_email4@gmail.com", "Cz3003password", 1111, 9999));   
        //          int 5 on server error after writing a value that exceeds what database can enter
        $this -> assertEquals(5, createAccount("correctusername5", "correct_name", "valid_email5@gmail.com", "Cz3003password", 1111, 999999999999999));   
        //          int 6 on invalid email format
        $this -> assertEquals(6, createAccount("correctusername6", "correct_name", "invalid_email", "Cz3003password", 1111, 1));   
        //          int 7 on invalid username format
        $this -> assertEquals(7, createAccount("a", "correct_name", "valid_email7@gmail.com", "Cz3003password", 1111, 1));
        //          int 8 on invalid password format
        $this -> assertEquals(8, createAccount("correctusername8", "correct_name", "valid_email8@gmail.com", "wrongpassword", 1, 1));  

        # Delete test cases 
        $sql = $conn->prepare("DELETE FROM `accounts` WHERE `name` = ?");
        $sql->bind_param('s', "correct_name");
        $sql->execute();

        $sql2 = $conn->prepare("DELETE FROM `students` WHERE `teacher_account_id` = ?");
        $sql2->bind_param('i', 1111);
        $sql2->execute();
    }
}


