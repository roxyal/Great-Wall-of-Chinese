<?php
if(isset($_POST["p1"]) && isset($_POST["token"])) echo resetPassword($_POST["p1"], $_POST["token"]);

// Resets the password of a user given a password and a reset token
// Function: Reset password
// Inputs: string $password, string $token
// Outputs: int 0 on success
//          int 1 on invalid token
//          int 2 on server error
//          int 3 on invalid password format

function resetPassword(string $pass, string $token) {
    require "config.php";

    // Check password format
    if(preg_match("/^(?:(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,})$/", $pass) !== 1) return 3;

    // Check if token is valid and get user id
    $check = $conn->prepare("select account_id from password_resets where hash = ? and timestamp >= UNIX_TIMESTAMP() - 900 and valid = 1");
    if(
        $check->bind_param("s", $token) &&
        $check->execute() &&
        $check->store_result()
    ) {
        $check->bind_result($account_id);
        $check->fetch();
        if($check->num_rows > 0) { 

            // Create a hash of the password 
            $hash = password_hash($pass, PASSWORD_DEFAULT);

            // Update the user's password
            if($conn->query("update accounts set password = '$hash' where account_id = $account_id")) {
                // Make all the user's previous password requests invalid. 
                $conn->query("update password_resets set valid = 0 where account_id = $account_id");
                // Successfully updated password
                return 0;
            }
            else {
                // Database error
                if($debug_mode) echo $conn->error;
                return 2;
            }
        }
        else {
            // Invalid token
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