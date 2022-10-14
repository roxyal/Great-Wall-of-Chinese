<?php
if(isset($_POST["email"])) echo forgotPassword($_POST["email"]);

// Sends the user an email with a link to reset their password
// Function: Forgot password
// Inputs: string $email
// Outputs: int 0 on success
//          int 1 on email not found
//          int 2 on server error
//          int 3 on reset password email failed
//          int 4 on user requested within 15 mins of last request 

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function forgotPassword(string $email) {
    require "config.php";

    // Check if email exists and get user id
    $checkemail = $conn->prepare("select account_id, username from accounts where email = ?");
    if(
        $checkemail->bind_param("s", $email) &&
        $checkemail->execute() &&
        $checkemail->store_result()
    ) {
        $checkemail->bind_result($account_id, $uname);
        $checkemail->fetch();
        if($checkemail->num_rows > 0) { 
            
            // Ensure the user didn't recently request a password reset within 15 mins. No need to use prepared query here since there is no user-input variable
            $sql = $conn->query("select * from password_resets where account_id = $account_id and timestamp >= UNIX_TIMESTAMP() - 900");
            if($sql->num_rows > 0) return 4;

            // Generate a random hex value
            $hash = bin2hex(random_bytes(16));
            $time = time();
            $valid = 1;

            // Insert random token into the password resets table
            $inserthash = $conn->prepare("insert into password_resets (account_id, email_address, hash, timestamp, valid) values (?, ?, ?, ?, ?)");
            if(
                $inserthash->bind_param("issii", $account_id, $email, $hash, $time, $valid) &&
                $inserthash->execute()
            ) {
                // Make all the user's previous password requests invalid. 
                $conn->query("update password_resets set valid = 0 where account_id = $account_id");

                // Send email to user

                // Require composer
                require "../vendor/autoload.php";

                $mail = new PHPMailer(true);
                try {
                    //Server settings
                    // $mail->SMTPDebug  = SMTP::DEBUG_SERVER;
                    $mail->isSMTP();
                    $mail->Host       = 'smtp.gmail.com';
                    $mail->SMTPAuth   = true;
                    $mail->Username   = $email_username;
                    $mail->Password   = $email_password; 
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                    $mail->Port       = 587;
                
                    //Recipients
                    $mail->setFrom('qinshihuang@ilovefriedorc.com', 'Qin Shi Huang');
                    $mail->addAddress($email);
                
                    //Content
                    $mail->isHTML(true);
                    $mail->Subject = "Password Reset for Great Wall of Chinese";
                    $mail->Body    = "Dear $uname,<br/><br/>
                                      Please visit this link to reset your password:<br/>
                                      <a href='https://chinese.ilovefriedorc.com/Great-Wall-of-Chinese/reset_password?token=$hash'>https://chinese.ilovefriedorc.com/Great-Wall-of-Chinese/reset_password?token=$hash</a><br/><br/>
                                      This link is valid for 15 minutes. Do not share this link with anyone.";
                    $mail->AltBody = "Dear $uname,
                                      Please visit this link to reset your password: 
                                      https://chinese.ilovefriedorc.com/reset_password?token=$hash
                                      This link is valid for 15 minutes. Do not share this link with anyone.";
                
                    $mail->send();
                    // Success, tell user to check their email
                    return 0;
                } catch (Exception $e) {
                    if($debug_mode) echo $mail->ErrorInfo;
                    return 3;
                }
            }
            else {
                // Database error
                if($debug_mode) echo $conn->error;
                return 2;
            }
        }
        else {
            // Email not found
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