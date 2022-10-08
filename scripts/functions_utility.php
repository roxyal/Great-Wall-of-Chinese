<?php
// Miscellaneous utility functions that don't need their own files. 
// Don't need config.php, as config.php will already be required in the other function files that access this file. 

function checkUsernameExists(string $username) {
    $check_username = $conn->prepare("SELECT * FROM `accounts` WHERE `username` = ?");
    $check_username->bind_param("s", $username);
    $check_username->execute();
    $check_username->store_result();
    if($check_username->num_rows < 1) return false;
    return true;
}

function checkEmailExists(string $email) {
    $check_email = $conn->prepare("SELECT * FROM `accounts` WHERE `email` = ?");
    $check_email->bind_param("s", $email);
    $check_email->execute();
    $check_email->store_result();
    if($check_email->num_rows < 1) return false;
    return true;
}

function checkTeacherExists(int $teacher_id) {
    $check_teacher = $conn->prepare("SELECT * FROM `accounts` WHERE `account_id` = ? AND `account_type` = 'Teacher'");
    $check_teacher->bind_param("i", $teacher_id);
    $check_teacher->execute();
    $check_teacher->store_result();
    if($check_teacher->num_rows > 0) return true;
    return false;
}

?>