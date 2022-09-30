<?php
// A "secrets" file containing database credentials is stored in the parent directory of the web root so it is inaccessible by web users
require "../../secrets.php";

// Start the session if none exists
if(!isset($_SESSION)) {
    session_start();
}

// The database is locally hosted on our server so we will use localhost
$servername = "localhost";
// Create database connection with the credentials supplied in secrets.php
$conn = new mysqli($servername, $username, $password, $db);
if($debug_mode) {
    if($conn->connect_error) echo "Connection to database failed.";
    else echo "Successfully connected to database!";
}

// Versioning
$version = "0.1";

// Global settings
$debug_mode = TRUE;
?>