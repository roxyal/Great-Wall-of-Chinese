<?php
session_start();
use PHPUnit\Framework\TestCase;

class CreateAccountTest extends TestCase{
    public function testCreateAccountSuccess(){
        //createAccount(string $username, string $name, string $email, string $password, int $teacher_id, int $character)
        require('scripts\function_createAccount.php');
        require("scripts\config.php");
        require("scripts\functions_utility.php");

        // Outputs: int 0 on success
        $this -> assertEquals(0, createAccount("correctusername", "correct_name", "valid_email@email.com", "Cz3003234a@sdfasdf", 1, 1));
        //          int 1 on email taken 
        $this -> assertEquals(1, createAccount("correctusername", "correct_name", "taken_email@email.com", "Cz3003234a@sdfasdf", 1, 1));
        //          int 2 on username taken
        $this -> assertEquals(2, createAccount("takenusername", "correct_name", "valid_email@gmail.com", "Cz3003234a@sdfasdf", 1, 1));
        //          int 3 on invalid teacher
        $this -> assertEquals(3, createAccount("correctusername", "correct_name", "valid_email@gmail.com", "Cz3003234a@sdfasdf", 98999999, 1));   
        //          int 4 on invalid character id
        $this -> assertEquals(4, createAccount("correctusername", "correct_name", "valid_email@gmail.com", "Cz3003234a@sdfasdf", 1, 9999));   
        //          int 5 on server error after writing a value that exceeds what database can enter
        $this -> assertEquals(5, createAccount("correctusername", "correct_name", "valid_email@gmail.com", "Cz3003234a@sdfasdf", 1, 999999999999999));   
        //          int 6 on invalid email format
        $this -> assertEquals(6, createAccount("correctusername", "correct_name", "invalid_email", "Cz3003234a@sdfasdf", 1, 1));   
        //          int 7 on invalid username format
        $this -> assertEquals(7, createAccount("a", "cool_name", "asdf@gmail.com", "valid_email@gmail.com", 1, 1));
        //          int 8 on invalid password format
        $this -> assertEquals(8, createAccount("correctusername", "correct_name", "valid_email@gmail.com", "wrong_password", 1, 1));  

        # Delete test cases 
        $sql = $conn->("SELECT `account_id` FROM `accounts` WHERE username = ?")
        $sql->bind_param('s', "correctusername");
        $sql->execute();
        $sql->store_result();
        $sql->bind_result($account_id);
        $sql->fetch();

        $sql2 = $conn->prepare("DELETE FROM `accounts` WHERE username = ?");
        $sql2->bind_param('s', "correctusername");
        $sql2->execute();

        $sql3 = $conn->prepare("DELETE FROM `students` WHERE student_id = ?");
        $sql3->bind_param('i', $account_id);
        $sql3->execute();
    }
}


