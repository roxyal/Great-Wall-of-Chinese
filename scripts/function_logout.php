<?php 
require "config.php";

// Function: Logout
// Inputs: Nothing
// Outputs: Nothing

function logout() {
    // To log a user out, simply unset the session and destroy the session.
    session_unset();
    session_destroy();
}
?>