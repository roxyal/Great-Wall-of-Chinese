<?php
// Miscellaneous utility functions that don't need their own files. 

function checkUsernameExists(string $username) {
    require "config.php";
    $sql = $conn->prepare("SELECT * FROM `accounts` WHERE `username` = ?");
    $sql->bind_param("s", $username);
    $sql->execute();
    $sql->store_result();
    if($sql->num_rows < 1) return false;
    return true;
}

function checkEmailExists(string $email) {
    require "config.php";
    $sql = $conn->prepare("SELECT * FROM `accounts` WHERE `email` = ?");
    $sql->bind_param("s", $email);
    $sql->execute();
    $sql->store_result();
    if($sql->num_rows < 1) return false;
    return true;
}

function checkTeacherExists(int $teacher_id) {
    require "config.php";
    $sql = $conn->prepare("SELECT * FROM `accounts` WHERE `account_id` = ? AND `account_type` = 'Teacher'");
    $sql->bind_param("i", $teacher_id);
    $sql->execute();
    $sql->store_result();
    if($sql->num_rows > 0) return true;
    return false;
}

function checkAccountIdExists(int $account_id) {
    require "config.php";
    $sql = $conn->prepare("SELECT * FROM `accounts` WHERE `account_id` = ?");
    $sql->bind_param("i", $account_id);
    $sql->execute();
    $sql->store_result();
    if($sql->num_rows < 1) return false;
    return true;
}

?>