<?php 

// Function: Send chat message
// Inputs: int $recipient_id, int $sender_id, string $message
// Outputs: int 0 on success
//          int 1 on invalid recipient
//          int 2 on invalid sender
//          int 3 on invalid message
//          int 4 on server error

function sendMessage(int $recipient_id, int $sender_id, string $message) {
    require "config.php";
    require "functions_utility.php";
    
    // Check valid recipient, empty string for world
    if(!checkAccountIdExists($recipient_id) && $recipient_id !== 0) return 1;
    // Check if sender id exists
    if(!checkAccountIdExists($sender_id)) return 2;
    // Check if message contains characters
    if(strlen($message) < 1) return 3;

    $sql = $conn->prepare("INSERT INTO `message_log`(`timestamp`, `sender_id`, `recipient_id`, `message`) VALUES (?, ?, ?, ?)");
    $time = time();

    if( 
        $sql &&
        $sql->bind_param('iiis', $time, $sender_id, $recipient_id, $message) &&
        $sql->execute()
    ) {
        // Successfully inserted new message
        return 0;
    }
    else {
        // Database error
        if($debug_mode) echo $conn->error;
        return 4;
    }
}
?>