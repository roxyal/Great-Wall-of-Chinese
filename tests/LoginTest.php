<?php
session_start();
use PHPUnit\Framework\TestCase;

class LoginTest extends TestCase{
    public function testLoginSuccess(){
        //login(string $uname, string $pass)
        require('scripts\function_login.php');
        require("scripts\config.php");
        require("scripts\functions_utility.php");

        // Insert student test case
        $username = "studentacc";
        $password = "StudentPass123";
        $email = "valid_email@email.com";
        $name = "correct_name";
        $sql = $conn->prepare("INSERT INTO `accounts`(`account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?)");
        $sql->bind_param('sssss', "Student", $username, $hash, $email, $name);
        $sql->execute();

        $account_id = $conn->insert_id;
        $students_insert = $conn->prepare("INSERT INTO `students`(`student_id`, `character_type`, `teacher_account_id`) VALUES (?, ?, ?)");
        $students_insert->bind_param('iii', $account_id, 1, 1);
        $students_insert->execute();

        // Insert teacher test case
        $username2 = "teacheracc";
        $password2 = "TeacherPass123";
        $email2 = "valid_email2@email.com";
        $name2 = "correct_name2";
        $sql2 = $conn->prepare("INSERT INTO `accounts`(`account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?)");
        $sql2->bind_param('sssss', "Teacher", $username2, $password2, $email2, $name2);
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
        $sql3->bind_param('s', $username);
        $sql3->execute();

        $sql4 = $conn->prepare("DELETE FROM `accounts` WHERE username = ?");
        $sql4->bind_param('s', $username2);
        $sql4->execute();

        $sql5 = $conn->prepare("DELETE FROM `students` WHERE student_id = ?");
        $sql5->bind_param('i', $account_id);
        $sql5->execute();
    }
}


