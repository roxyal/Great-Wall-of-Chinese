<?php 
require "config.php";

// Function: Create Account
// Inputs: string $username, string $name, string $email, string $password, int $timestamp, int $teacher_id, int $character
// Outputs: int 0 on success
//          int 1 on email taken
//          int 2 on username taken
//          int 3 on invalid teacher
//          int 4 on invalid character
//          int 5 on server error

// This is the create account function. It is called every time a user clicks submit on the registration form. 
function createAccount(string $username, string $name, string $email, string $password, int $timestamp, int $teacher_id, int $character) {

    // Check if email exists
    $check_email = $conn->prepare("SELECT * FROM `accounts` WHERE `email` = ?");
    if(
        $check_email->bind_param("s", $email) &&
        $check_email->execute() &&
        $check_email->store_result()
    ) {
        if($check_email->num_rows < 1) {
            // Email doesn't exist, continue

            // Check if username exists
            $check_username = $conn->prepare("SELECT * FROM `accounts` WHERE `username` = ?");
            if(
                $check_username->bind_param("s", $username) &&
                $check_username->execute() &&
                $check_username->store_result()
            ) {
                if($check_username->num_rows < 1) {
                    // Username doesn't exist, continue

                    // Check if teacher exists
                    $check_teacher = $conn->prepare("SELECT * FROM `accounts` WHERE `account_id` = ? AND `account_type` = 'Teacher'");
                    if(
                        $check_teacher->bind_param("i", $teacher_id) &&
                        $check_teacher->execute() &&
                        $check_teacher->store_result()
                    ) {
                        if($check_teacher->num_rows > 0) {
                            // Teacher exists, continue

                            // Assume that there are 4 characters with ids from 1 to 4
                            if($character > 0 && $character < 5) {
                                // Character exists, continue

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
                            else {
                                // Invalid character
                                return 4;
                            }
                        }
                        else {
                            // Teacher doesn't exist
                            return 3;
                        }
                    }
                    else {
                        // Database error
                        if($debug_mode) echo $conn->error;
                        return 5;
                    }
                }
                else {
                    // Username taken
                    return 2;
                }
            }
            else {
                // Database error
                if($debug_mode) echo $conn->error;
                return 5;
            }
        }
        else {
            // Email taken
            return 1;
        }
    }
    else {
        // Database error
        if($debug_mode) echo $conn->error;
        return 2;
    }
}
?>