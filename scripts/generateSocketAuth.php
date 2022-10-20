<?php
require "config.php";
require "functions_utility.php";
if(isset($_SESSION["account_id"]) && checkAccountIdExists($_SESSION["account_id"])) {
    // Generate a random token for user's socket
    $token = bin2hex(random_bytes(16));
    $time = time();
    // Insert into database
    $sql = $conn->query("insert into socket_connections (token, account_id, resource_id, timestamp) values ('$token', {$_SESSION["account_id"]}, 0, $time)");
    // Return the token
    echo $token;
}
else {
    echo "-1";
}
?>