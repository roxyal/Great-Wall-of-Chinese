<?php
if(isset($_POST["email"])) echo forgotPassword($_POST["email"]);

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Sends the user an email with a link to reset their password
// Function: Forgot password
// Inputs: string $email
// Outputs: int 0 on success
//          int 1 on email not found
//          int 2 on server error
//          int 3 on reset password email failed

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
            // Generate a random hex value and insert into the password resets table
            $hash = bin2hex(random_bytes(16));
            $time = time();
            $inserthash = $conn->prepare("insert into password_resets (account_id, email, hash, timestamp) values (?, ?, ?, ?)");
            if(
                $inserthash->bind_param("issi", $account_id, $email, $hash, $time) &&
                $inserthash->execute()
            ) {
                // Send email to user

                // Require composer
                require "../vendor/autoload.php";

                $mail = new PHPMailer(true);
                try {
                    //Server settings
                    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
                    $mail->isSMTP();
                    $mail->Host       = 'mail.chinese.ilovefriedorc.com';
                    $mail->SMTPAuth   = true;
                    $mail->Username   = $email_username;
                    $mail->Password   = $email_password; 
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                    $mail->Port       = 587;
                
                    //Recipients
                    $mail->setFrom('qinshihuang@chinese.ilovefriedorc.com', 'Qin Shi Huang');
                    $mail->addAddress($email);
                
                    //Content
                    $mail->isHTML(true);                                  //Set email format to HTML
                    $mail->Subject = "Password Reset for Great Wall of Chinese";
                    $mail->Body    = "Dear $uname,<br/><br/>
                                      Please click on this link to reset your password: 
                                      https://chinese.ilovefriedorc.com/reset_password?token=$hash";
                    $mail->AltBody = "Dear $uname,
                                      Please click on this link to reset your password: 
                                      https://chinese.ilovefriedorc.com/reset_password?token=$hash";
                
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