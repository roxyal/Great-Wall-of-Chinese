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
    $sql = $conn->prepare("select * from password_resets where hash = ? and valid = 1 and timestamp >= UNIX_TIMESTAMP() - 900");
    $sql->bind_param("s", $token);
    $sql->execute();
    $sql->store_result();
    if($sql->num_rows > 0) return true;
    return false;
}

function getLoggedInUsername(): string {
    require "config.php";
    if(isset($_SESSION["username"])) return $_SESSION["username"];
    else return "undefined";
}

function getLoggedInAccountId(): string {
    require "config.php";
    if(isset($_SESSION["account_id"])) return $_SESSION["account_id"];
    else return "undefined";
}

function getLoggedInCharacter(): int {
    require "config.php";
    if(isset($_SESSION["character_id"])) return $_SESSION["character_id"];
    else return 0; // or some other default character id
}

function getLoggedInTeacherId(): int {
    require "config.php";
    if(isset($_SESSION["teacher_id"])) return $_SESSION["teacher_id"];
    else return 0; 
}

function getLoggedInAccountType(): string {
    require "config.php";
    if(isset($_SESSION["account_type"])) return $_SESSION["account_type"];
    else return "undefined"; 
}

// Helper function to convert the questions stringToArray format
function stringToArray($questions, $delimiter){
    $delimiter = $delimiter;
    $word = explode($delimiter, $questions); 
    return $word;
}

// Helper function to convert the date format send from frontend to UNIX time
function convertDateToInt($date){
    $delimiter = '-';
    $word = explode($delimiter, $date); 
    $str_date = array($word[2], $word[1], $word[0]);
    $str_date = join("-", $str_date);
    $int_date = strtotime($str_date);

    return $int_date; 
}

if(isset($_GET["func"])) {
    try {
        echo call_user_func("getLoggedIn{$_GET["func"]}");
    }
    catch (Exception $e) {
        // if($debug_mode) echo "Something went wrong.\n";
        echo -1;
    }
}
?>