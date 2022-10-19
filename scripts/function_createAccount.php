<?php 
// Add a POST handler here to handle any AJAX requests sent to this file.
// isset($variable) checks if the variable "exists", i.e. defined or initialised.
if(isset($_POST["username"]) && isset($_POST["name"]) && isset($_POST["email"]) && isset($_POST["password"]) && isset($_POST["teacher_id"]) && isset($_POST["character"]) ) {
    echo createAccount($_POST["username"], $_POST["name"], $_POST["email"], $_POST["password"], $_POST["teacher_id"], $_POST["character"]);
}

// Function: Create Account
// Inputs: string $uname, string $name, string $email, string $pass, int $timestamp, int $teacher_id, int $character
// Outputs: int 0 on success
//          int 1 on email taken
//          int 2 on username taken
//          int 3 on invalid teacher
//          int 4 on invalid character
//          int 5 on server error
//          int 6 on invalid email format
//          int 7 on invalid username format
//          int 8 on invalid password format

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;



// This is the create account function. It is called every time a user clicks submit on the registration form. 
function createAccount(string $uname, string $name, string $email, string $pass, int $teacher_id, int $character) {

    require_once "functions_utility.php";
    require_once "config.php";

    // Check valid email format
    if(preg_match("/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\..+$/", $email) !== 1) return 6;
    // Check valid username format
    if(preg_match("/^[a-zA-Z0-9]{3,}$/", $uname) !== 1) return 7;
    // Check valid password format
    if(preg_match("/^(?:(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,})$/", $pass) !== 1) return 8;
    // Check if email exists
    if(checkEmailExists($email)) return 1;
    // Check if username exists
    if(checkUsernameExists($uname)) return 2;
    // Check if teacher exists
    if(!checkTeacherExists($teacher_id)) return 3;
    // Assume that there are 4 characters with ids from 1 to 4
    if($character < 1 || $character > 4) return 4;
    
    // Add a join date? 
    $accounts_insert = $conn->prepare("INSERT INTO `accounts`(`account_type`, `username`, `password`, `email`, `name`) VALUES (?, ?, ?, ?, ?)");
    
    // Hash the password
    $hash = password_hash($pass, PASSWORD_DEFAULT);
    
    $actype = "Student";

    if( 
        $accounts_insert &&
        $accounts_insert->bind_param('sssss', $actype, $uname, $hash, $email, $name) &&
        $accounts_insert->execute()
    ) {
        // Successfully created new account, now create the student profile
        $account_id = $conn->insert_id;
        $students_insert = $conn->prepare("INSERT INTO `students`(`student_id`, `character_type`, `teacher_account_id`) VALUES (?, ?, ?)");
        if( 
            $students_insert &&
            $students_insert->bind_param('iii', $account_id, $character, $teacher_id) &&
            $students_insert->execute()
        ) {
            // Successfully created student profile. 

            // Send a welcome email

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
                $mail->Subject = "Welcome to Great Wall of Chinese!";
                $mail->Body    = "Dear Peasant $uname,<br/><br/>
                                You have successfully registered an account at  
                                <a href='https://chinese.ilovefriedorc.com/Great-Wall-of-Chinese/'>Great Wall of Chinese!</a><br/><br/>
                                You are now hereby decreed to start construction of the Great Wall immediately.";
                $mail->AltBody = "Dear Peasant $uname,
                                You have successfully registered an account at  
                                Great Wall of Chinese! Visit the website: https://chinese.ilovefriedorc.com/Great-Wall-of-Chinese/<br/><br/>
                                You are now hereby decreed to start construction of the Great Wall immediately.";
                $mail->send();
            } catch (Exception $e) {
                if($debug_mode) echo $mail->ErrorInfo;
            }

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