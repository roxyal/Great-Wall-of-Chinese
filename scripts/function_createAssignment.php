<?php 
require "config.php";

// Function: Create Assignment
// Inputs: string $assignment_name, int $teacher_id, int $created_timestamp, int $due_timestamp
// Outputs: int 0 on success
//          int 1 on invalid

function createAssignment(string $assignment_name, int $account_id, int $created_timestamp, int $due_timestamp) {

    // Check if account id exists
    if(!checkAccountIdExists($account_id)) return 2;

    $sql = $conn->prepare("INSERT INTO `assignments`(`assignment_name`, `account_id`, `created_timestamp`, `due_timestamp`) VALUES (?, ?, ?, ?)");

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

echo createAssignment("assignment name", 1, 2, 3, 4);

?>