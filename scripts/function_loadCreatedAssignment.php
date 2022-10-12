<?php 
// Function: Load a list of teacher's created assignments
// Inputs: int $teacher_id
// Outputs: list of assignments created from the user
//          int 1 on invalid

function loadCreatedAssignment(int $account_id) {
    require "config.php";    
    //require "functions_utility.php"; 

    // Check if account id exists
    //if(!checkAccountIdExists($account_id)) return 2;

    $sql = $conn->prepare("SELECT * FROM `assignments` WHERE `account_id` = ?");

    if( 
        $sql &&
        $sql->bind_param('i', $account_id) &&
        $sql->execute()
    ) {
        $result = $sql->get_result();
        $row = $result->fetch_assoc();
        
        return $row;
    }
    else {
        // Database error
        if($debug_mode) echo $conn->error;
        return 4;
    }
}
?>