<?php 
// Function: Create assignment for a student with assignment name
// Inputs: string $assignment_name, int $teacher_id, int $created_timestamp, int $due_timestamp
// Outputs: int 0 on success
//          int 1 on invalid account

function createAssignment(string $assignment_name, int $account_id, int $created_timestamp, int $due_timestamp) {

    require "config.php";
    require "functions_utility.php";

    // Check if account id exists
    if(!checkAccountIdExists($account_id)) return 1;

    $sql = $conn->prepare("INSERT INTO `assignments`(`assignment_name`, `account_id`, `created_timestamp`, `due_timestamp`) VALUES (?, ?, ?, ?)");

    if( 
        $sql &&
        $sql->bind_param('siii', $assignment_name, $account_id, $created_timestamp, $due_timestamp) &&
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