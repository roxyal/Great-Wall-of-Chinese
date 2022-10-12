<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Great Wall of Chinese</title>
    <link rel="stylesheet" href="./frontend/style.css">

        <!-- Booststrap (CSS) assets -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3" crossorigin="anonymous"></script>
        <!-- Font Awesome (icons) assets -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
    <div id="container">
        <div class="content-window container-sm w-50 h-75">

            <?php 
            // require "./scripts/config.php";

            function validToken(string $token): bool {
                $sql = $conn->prepare("select account_id, timestamp from password_resets where hash = ? and valid = 1 and timestamp ");
                if(
                    $sql->bind_param("s", $_POST["token"]) &&
                    $sql->execute() &&
                    $sql->store_result()
                 ) {
                    $sql->bind_result($account_id, $timestamp); 
                    $sql->fetch();

                    // If token doesn't exist
                    if($sql->num_rows < 1) return false;
                    
                    // If token is timed out (> 3 days since generated)
                    // if()
                }
                else {
                    if($debug_mode) echo "A database error occurred.";
                    return false;
                }
            }

            if(isset($_GET["token"]) && validToken($_GET["token"])) {
            ?>
                <h1 style = "margin-bottom: 30px;">Reset Password</h1>
                <div class="container w-75">
                    <div class="form-floating row mb-3">
                        <input id = 'newPassword' class="form-control" data-bs-placement="right" data-bs-toggle="tooltip" data-bs-title="Your password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter and 1 number." type="password" name="newPassword" placeholder="Password">
                        <label for="newPassword">New Password</label>    
                    </div>
                    <div class="form-floating row mb-3">
                        <input id = 'newPasswordConfirm' class="form-control" type="password" name="newPasswordConfirm" placeholder="Password">
                        <label for="newPasswordConfirm">Confirm New Password</label> 
                        <div class="invalid-feedback">
                            Passwords do not match.
                        </div> 
                    </div>
                    <div class="row mb-3">
                        <button class="btn btn-info" id = 'submitButton' onclick="resetPassword()">Reset Password</button>
                    </div>
                    <div id="response" class="alert d-flex align-items-center" role="alert">
                </div>
                <script>
                    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl)
                    })

                    function resetPassword() {
                        document.getElementById("newPassword").classList.remove("is-invalid");
                        document.getElementById("newPasswordConfirm").classList.remove("is-invalid");
                        document.getElementById("response").innerHTML = "";
                        document.getElementById("response").classList.remove("alert-danger");

                        var p1 = document.getElementById("newPassword").value;
                        var p2 = document.getElementById("newPasswordConfirm").value;
                        if(p1 == p2) {
                            
                        }
                        else {
                            document.getElementById("newPassword").classList.add("is-invalid");
                            document.getElementById("newPasswordConfirm").classList.add("is-invalid");
                        }
                    }
                </script>
            <?php
            }
            else {
            ?>
                <div class="container w-75 text-center">
                    Looks like you followed an invalid link.<br/><br/>
                    <a href="./frontend/main_menu"><div class="btn btn-info">Return to Main Menu</div></a>
                </div>
            <?php
            }
            ?>
        </div>
    </div>
</body>
</html>