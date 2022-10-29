<?php
session_start();
use PHPUnit\Framework\TestCase;

class SendMessageTest extends TestCase{
    public function SendMessageTest(){
        //sendMessage(int $recipient_id, int $sender_id, string $message)
        require('scripts\function_sendMessage.php');
        require("scripts\config.php");
        require("scripts\functions_utility.php");

        // Insert student test case
        $sql = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql->bind_param('isssss', 9999, "Student", "studentacc", "StudentPass123", "valid_email@email.com", "correct_name");
        $sql->execute();

        $sql2 = $conn->prepare("INSERT INTO `accounts`(`account_id`, `account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?, ?)");
        $sql2->bind_param('isssss', 9998, "Student", "studentacc2", "StudentPass123", "valid_email2@email.com", "correct_name");
        $sql2->execute();

        // Outputs: int 0 on success
        $this -> assertEquals(0, sendMessage(9999, 9998, "Hello world!"));
        //          int 1 on invalid recipient id
        $this -> assertEquals(1, sendMessage(1111, 9998, "Hello world!"));
        //          int 2 on invalid sender id
        $this -> assertEquals(2, sendMessage(9999, 1111, "Hello world!"));
        //          int 3 on empty message
        $this -> assertEquals(3, sendMessage(9999, 9998, ""));
        //          int 4 on server error after writing a value that exceeds what database can enter
        $this -> assertEquals(4, sendMessage(999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999, 9998, "Hello world!"));

        # Delete test cases 
        $sql3 = $conn->prepare("DELETE FROM `accounts` WHERE `name` = ?");
        $sql3->bind_param('s', "correct_name");
        $sql3->execute();

        $sql4 = $conn->prepare("DELETE FROM `message_log` WHERE `sender_id` = ?");
        $sql4->bind_param('i', 9998);
        $sql4->execute();
    }
}


