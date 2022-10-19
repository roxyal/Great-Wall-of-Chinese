<?php 
// Function: Create assignment for a student with assignment name
// Inputs: string $assignment_name, int $teacher_id, int $created_timestamp, int $due_timestamp
// Outputs: int 0 on success
//          int 1 on invalid account

function deleteAssignment(int $assignment_id) {

    require "config.php";
    require "functions_utility.php";

    // Check if account id exists
    //if(!checkAccountIdExists($account_id)) return 1;

    $sql = $conn->prepare("DELETE FROM `assignments` WHERE `assignment_id` = ?");

    if( 
        $sql &&
        $sql->bind_param('i', $assignment_id) &&
        $sql->execute()
    ) {
        // Successfully inserted new message
        return 0;
    }
    else {
        // Database error
        if($debug_mode) echo $conn->error;
        return 1;
    }
}
?>