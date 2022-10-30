<?php

// triggerViewLeaderBoard
if(isset($_POST["function_name"]) && $_POST["function_name"] == "viewLeaderBoard"){
    echo viewLeaderBoard();
}

// Function: viewLeaderBoard
// Inputs: no argument needed
// Outputs: string of information that contain Adventure as well as PVP leaderboards information
// Example of Output string:
// 1,vinvin,22,55.0000|2,diedforoursyntax,21,30.0000|3,testa,20,22.2222*1,diedforoursyntax,Bling Bling,1000|2,Kelvi,Bronze,50
//          int 1 on account_id does not exists
//          int 2 on server error.
function viewLeaderBoard()
{
    require_once "config.php";
    require_once "functions_utility.php";
    
//    // Get the account_id
//    $account_id = getLoggedInAccountId();
//    
//    // Check if account_id exists
//    if(!checkAccountIdExists($account_id)) return 1;
    
    $leaderboard_str = "";
    $comma = ',';
    
    // SQL statement that sort and calculates the accuracy for ADVENTURE MODE
    // lower question will be awarded 1 points if correct, upper will be awarded 2 points
    // This is to differentiate between players
    // First sort will be based on adventure_points, second will be based on their accuracy
    $sql_1 = "SELECT a.username, (s.idiom_lower_correct+s.fill_lower_correct+s.pinyin_lower_correct)+2*(s.idiom_upper_correct+s.fill_upper_correct+s.pinyin_upper_correct) AS adv_score, 100*(s.idiom_lower_correct+s.fill_lower_correct+s.pinyin_lower_correct+s.idiom_upper_correct+s.fill_upper_correct+
            s.pinyin_upper_correct)/(s.idiom_lower_attempted+s.fill_lower_attempted+
            s.pinyin_lower_attempted+s.idiom_upper_attempted+s.fill_upper_attempted+
            s.pinyin_upper_attempted) AS accuracy FROM students s INNER JOIN accounts a
            WHERE s.student_id = a.account_id AND a.account_type = 'Student' AND
            100*(s.idiom_lower_correct+s.fill_lower_correct+s.pinyin_lower_correct+s.idiom_upper_correct+s.fill_upper_correct+
            s.pinyin_upper_correct)/(s.idiom_lower_attempted+s.fill_lower_attempted+
            s.pinyin_lower_attempted+s.idiom_upper_attempted+s.fill_upper_attempted+
            s.pinyin_upper_attempted) > 0 ORDER BY adv_score DESC, accuracy DESC LIMIT 20";
    
    $stmt_1 = $conn->prepare($sql_1);
    
    if ($stmt_1->execute())
    {
        $result = $stmt_1->get_result();
        $num_rows = $result->num_rows;
        $count = 0;
        
        while ($row = $result->fetch_assoc())
        {
            $position = $count +1;
            // Concatenate the top-20 highest ADVENTURE_mode accuracy player information (position, username,adv_score ,accuracy)
            $leaderboard_str = $leaderboard_str.$position.$comma.$row['username'].$comma.
                                $row['adv_score'].$comma.$row['accuracy'];

            if ($count+1 != $num_rows)
                $leaderboard_str = $leaderboard_str.'|';
            $count = $count + 1;
        }
        $stmt_3 = $conn->query("SELECT a.username, (s.idiom_lower_correct+s.fill_lower_correct+s.pinyin_lower_correct)+2*(s.idiom_upper_correct+s.fill_upper_correct+s.pinyin_upper_correct) AS adv_score, 100*(s.idiom_lower_correct+s.fill_lower_correct+s.pinyin_lower_correct+s.idiom_upper_correct+s.fill_upper_correct+
        s.pinyin_upper_correct)/(s.idiom_lower_attempted+s.fill_lower_attempted+
        s.pinyin_lower_attempted+s.idiom_upper_attempted+s.fill_upper_attempted+
        s.pinyin_upper_attempted) AS accuracy FROM students s INNER JOIN accounts a
        WHERE s.student_id = a.account_id AND a.account_id = {$_SESSION["account_id"]}");
        $row_3 = $stmt_3->fetch_array(MYSQLI_ASSOC);
        $leaderboard_str .= "|<i class=\"fa-solid fa-user\"></i>,".$row_3["username"].",".$row_3["adv_score"].",".$row_3["accuracy"];
        
        // reset the count so that we can use for below again
        $count = 0;
        
        // * is to split up between ADVENTURE mode and PVP mode's leaderboard
        $leaderboard_str = $leaderboard_str.'*';
        
        // Another SQL statement that sort and calculates the accuracy but for PVP MODE
        $sql_2 = "SELECT a.username, l.rank, l.rank_points FROM leaderboard l INNER JOIN accounts a
            WHERE l.account_id = a.account_id AND l.rank_points > 0 ORDER BY rank_points DESC LIMIT 20";
        
        $stmt_2 = $conn->prepare($sql_2);
        if($stmt_2->execute())
        {
            $result = $stmt_2->get_result();
            $num_rows = $result->num_rows;
        
            while ($row = $result->fetch_assoc())
            {
                $position = $count +1;
                // Concatenate the top-20 highest PVP_mode accuracy player information (position, name, rank, rank points)
                $leaderboard_str = $leaderboard_str.$position.$comma.$row['username'].$comma.$row['rank'].
                        $comma.$row['rank_points'];

                if ($count+1 != $num_rows)
                    $leaderboard_str = $leaderboard_str.'|';
                $count = $count + 1;
            }
            $stmt_3 = $conn->query("SELECT a.username, l.rank, l.rank_points FROM leaderboard l INNER JOIN accounts a on l.account_id = a.account_id where a.account_id = {$_SESSION['account_id']}");
            $row_3 = $stmt_3->fetch_array(MYSQLI_ASSOC);
            $leaderboard_str .= "|<i class=\"fa-solid fa-user\"></i>,".$row_3["username"].",".$row_3["rank"].",".$row_3["rank_points"];

            return $leaderboard_str;
        }
        else
        {
            if($debug_mode) echo $conn->error;
                return 2;
        }
    }
    else
    {
        if($debug_mode) echo $conn->error;
        return 2;
    }
}
?>