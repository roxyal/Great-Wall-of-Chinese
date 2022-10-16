<?php
session_start();
use PHPUnit\Framework\TestCase;

class CreateAccountTest extends TestCase{
    public function testCreateAccountTest(){
        //createAccount(string $username, string $name, string $email, string $password, int $teacher_id, int $character)
        require_once('scripts\function_createAccount.php');
        // Outputs: int 0 on success
        $this -> assertEquals(6, createAccount("correct_username", "correct_name", "valid_email@email.com", "Cz3003234a@sdfasdf", 1, 1));
        //          int 1 on email taken 
        $this -> assertEquals(6, createAccount("correct_username", "correct_name", "taken_email@email.com", "Cz3003234a@sdfasdf", 1, 1));
        //          int 2 on username taken
        $this -> assertEquals(6, createAccount("taken_username", "correct_name", "valid_email@gmail.com", "Cz3003234a@sdfasdf", 1, 1));
        //          int 3 on invalid teacher
        $this -> assertEquals(6, createAccount("correct_username", "correct_name", "valid_email@gmail.com", "Cz3003234a@sdfasdf", 98999999, 1));   
        //          int 4 on invalid character
        $this -> assertEquals(6, createAccount("correct_username", "correct_name", "valid_email@gmail.com", "Cz3003234a@sdfasdf", 1, 9999));   
        //          int 5 on server error after writing a value that exceeds what database can enter
        $this -> assertEquals(6, createAccount("correct_username", "correct_name", "valid_email@gmail.com", "Cz3003234a@sdfasdf", 1, 999999999999999));   
        //          int 6 on invalid email format
        $this -> assertEquals(6, createAccount("correct_username", "correct_name", "invalid_email", "Cz3003234a@sdfasdf", 1, 1));   
        //          int 7 on invalid username format
        $this -> assertEquals(7, createAccount("a", "cool_name", "asdf@gmail.com", "valid_email@gmail.com", 1, 1));
        //          int 8 on invalid password format
        $this -> assertEquals(8, createAccount("correct_username", "correct_name", "valid_email@gmail.com", "wrong_password", 1, 1));   
    }


}


