<?php 
// Function: Logout
// Inputs: Nothing
// Outputs: Nothing

require "config.php";
// To log a user out, simply unset the session and destroy the session.
session_unset();
session_destroy();
header("Location: ../frontend/login");

?>