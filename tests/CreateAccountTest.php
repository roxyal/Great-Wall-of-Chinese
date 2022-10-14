<?php
session_start();
use PHPUnit\Framework\TestCase;

class CreateAccountTest extends TestCase{
    public function testCreateAccountTest(){
        //createAccount(string $username, string $name, string $email, string $password, int $teacher_id, int $character)
        require 'scripts\function_createAccount.php';
        // Outputs: int 0 on success
        //          int 1 on email taken 
        //          int 2 on username taken
        //          int 3 on invalid teacher
        //          int 4 on invalid character
        //          int 5 on server error
        //          int 6 on invalid email format
        $this -> assertEquals(6, createAccount("correct_username", "correct_name", "invalid_email", "Cz3003234a@sdfasdf", 1, 1));   
        //          int 7 on invalid username format
        $this -> assertEquals(7, createAccount("a", "cool_name", "asdf@gmail.com", "Cz3003234a@sdfasdf", 1, 1));
        //          int 8 on invalid password format
        $this -> assertEquals(8, createAccount("correct_username", "correct_name", "asdf@gmail.com", "wrong_password", 1, 1));   
    }


}


