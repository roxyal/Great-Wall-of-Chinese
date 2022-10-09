<?php 


// Function: Create Account
// Inputs: string $username, string $name, string $email, string $password, int $timestamp, int $teacher_id, int $character
// Outputs: int 0 on success
//          int 1 on email taken
//          int 2 on username taken
//          int 3 on invalid teacher
//          int 4 on invalid character
//          int 5 on server error
//          int 6 on invalid email format
//          int 7 on invalid username format
//          int 8 on invalid password format

// This is the create account function. It is called every time a user clicks submit on the registration form. 
function createAccount(string $username, string $name, string $email, string $password, int $teacher_id, int $character) {
    
    require "config.php";
    require "functions_utility.php";

    // Check valid email format
    if(preg_match("/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/", $email) !== 1) return 6;
    // Check valid username format
    if(preg_match("/^[a-zA-Z0-9]{3,}$/", $username) !== 1) return 7;
    // Check valid password format
    if(preg_match("/^(?:(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*)$/", $email) !== 1) return 8;
    // Check if email exists
    if(checkEmailExists($email)) return 1;
    // Check if username exists
    if(checkUsernameExists($username)) return 2;
    // Check if teacher exists
    if(!checkTeacherExists($teacher_id)) return 3;
    // Assume that there are 4 characters with ids from 1 to 4
    if($character < 1 || $character > 4) return 4;
    
    // Add a join date? 
    $accounts_insert = $conn->prepare("INSERT INTO `accounts`(`account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?)");
    
    // Hash the password
    $hash = password_hash($password, PASSWORD_DEFAULT);

    if( 
        $accounts_insert &&
        $accounts_insert->bind_param('sssss', "Student", $username, $hash, $email, $name) &&
        $accounts_insert->execute()
    ) {
        // Successfully created new account, now create the student profile
        $students_insert = $conn->prepare("INSERT INTO `students`(`student_id`, `character_type`, `teacher_account_id`) VALUES (?, ?, ?)");
        if( 
            $students_insert &&
            $students_insert->bind_param('iii', $conn->insert_id, $character, $teacher_id) &&
            $students_insert->execute()
        ) {
            // Successfully created student profile. 
            return 0;
        }
        else {
            // Database error
            if($debug_mode) echo $conn->error;
            return 5;
        }
    }
    else {
        // Database error
        if($debug_mode) echo $conn->error;
        return 5;
    }
}
?>