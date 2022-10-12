<?php
// Miscellaneous utility functions that don't need their own files. 

function checkUsernameExists(string $uname): bool {
    require "config.php";
    $sql = $conn->prepare("SELECT * FROM `accounts` WHERE `username` = ?");
    $sql->bind_param("s", $uname);
    $sql->execute();
    $sql->store_result();
    if($sql->num_rows < 1) return false;
    return true;
}

function checkEmailExists(string $email): bool {
    require "config.php";
    $sql = $conn->prepare("SELECT * FROM `accounts` WHERE `email` = ?");
    $sql->bind_param("s", $email);
    $sql->execute();
    $sql->store_result();
    if($sql->num_rows < 1) return false;
    return true;
}

function checkTeacherExists(int $teacher_id): bool {
    require "config.php";
    $sql = $conn->prepare("SELECT * FROM `accounts` WHERE `account_id` = ? AND `account_type` = 'Teacher'");
    $sql->bind_param("i", $teacher_id);
    $sql->execute();
    $sql->store_result();
    if($sql->num_rows > 0) return true;
    return false;
}

function checkAccountIdExists(int $account_id): bool {
    require "config.php";
    $sql = $conn->prepare("SELECT * FROM `accounts` WHERE `account_id` = ?");
    $sql->bind_param("i", $account_id);
    $sql->execute();
    $sql->store_result();
    if($sql->num_rows < 1) return false;
    return true;
}

function validToken(string $token): bool {
    // Checks if a password reset token is valid and was requested within 15 minutes
    require "config.php";
    echo $token;
    $sql = $conn->prepare("select * from password_resets where hash = ? and valid = 1 and timestamp >= UNIX_TIMESTAMP() - 900");
    $sql->bind_param("s", $_POST["token"]);
    $sql->execute();
    $sql->store_result();
    if($sql->num_rows > 0) return true;
    return false;
}
?>