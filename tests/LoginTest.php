<?php
session_start();
use PHPUnit\Framework\TestCase;

class LoginTest extends TestCase{
    public function LoginTest(){
        //login(string $uname, string $pass)
        require('scripts\function_login.php');
        require("scripts\config.php");
        require("scripts\functions_utility.php");

        // Insert student test case
        $sql = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql->bind_param('isssss', 9999, "Student", "studentacc", "StudentPass123", "valid_email@email.com", "correct_name");
        $sql->execute();

        // Insert teacher test case
        $sql2 = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql2->bind_param('isssss', 9998, "Teacher", "teacheracc", "TeacherPass123", "valid_email2@email.com", "correct_name2");
        $sql2->execute();

        // Outputs: int 0 on success (student login)
        $this -> assertEquals(0, login("studentacc", "StudentPass123"));
        //          int 0 on success (teacher login)
        $this -> assertEquals(0, login("teacheracc", "TeacherPass123"));
        //          int 1 on incorrect password (student)
        $this -> assertEquals(1, login("studentacc", "StudentPass12"));
        //          int 1 on incorrect password (teacher)
        $this -> assertEquals(1, login("teacheracc", "TeacherPass12"));
        //          int 1 on incorrect username and password (student)
        $this -> assertEquals(1, login("studentacc22", "StudentPass12"));
        //          int 1 on incorrect username and password (teacher)
        $this -> assertEquals(1, login("teacheracc22", "TeacherPass12"));
        //          int 2 on server error after writing a value that exceeds what database can enter
        $this -> assertEquals(2, login("999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999", "TeacherPass123"));

        # Delete test cases 
        $sql3 = $conn->prepare("DELETE FROM `accounts` WHERE username = ?");
        $sql3->bind_param('s', "studentacc");
        $sql3->execute();

        $sql4 = $conn->prepare("DELETE FROM `accounts` WHERE username = ?");
        $sql4->bind_param('s', "teacheracc");
        $sql4->execute();
    }
}


