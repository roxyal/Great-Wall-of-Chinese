<?php

// triggerViewLeaderBoard
if(isset($_POST["function_name"]) && $_POST["function_name"] == "viewLeaderBoard"){
    echo viewLeaderBoard();
}

// Function: viewLeaderBoard
// Inputs: no argument needed
// Outputs: string of information that contain Adventure as well as PVP leaderboards information
// Example of Output string:
// 1,Kelvin,85.0000|2,Kelly,67.5000|3,kyrin,55.7143*1,kyrin,Bling Bling,1000|2,Kelvin,Bronze,50|3,Kelly,Bronze,50
//          int 1 on account_id does not exists
//          int 2 on server error.
function viewLeaderBoard()
{
    require_once "config.php";
    require_once "functions_utility.php";
    
    // Get the account_id
    $account_id = getLoggedInAccountId();
    
    // Check if account_id exists
    if(!checkAccountIdExists($account_id)) return 1;
    
    $leaderboard_str = "";
    $comma = ',';
    
    // SQL statement that sort and calculates the accuracy for ADVENTURE MODE
    $sql_1 = "SELECT a.name, 100*((s.idiom_lower_correct+s.fill_lower_correct+s.pinyin_lower_correct)+ 2*(s.idiom_upper_correct+s.fill_upper_correct+s.pinyin_upper_correct))/((s.idiom_lower_attempted+s.fill_lower_attempted+s.pinyin_lower_attempted)+2*(s.idiom_upper_attempted+s.fill_upper_attempted+s.pinyin_upper_attempted)) AS accuracy 
            FROM students s INNER JOIN accounts a
            WHERE s.student_id = a.account_id AND a.account_type = 'Student' AND 100*((s.idiom_lower_correct+s.fill_lower_correct+s.pinyin_lower_correct)+ 2*(s.idiom_upper_correct+s.fill_upper_correct+s.pinyin_upper_correct))/((s.idiom_lower_attempted+s.fill_lower_attempted+s.pinyin_lower_attempted)+2*(s.idiom_upper_attempted+s.fill_upper_attempted+s.pinyin_upper_attempted)) > 0
            ORDER BY accuracy DESC LIMIT 20";
    
    $stmt_1 = $conn->prepare($sql_1);
    
    if ($stmt_1->execute())
    {
        $result = $stmt_1->get_result();
        $num_rows = $result->num_rows;
        $count = 0;
        
        while ($row = $result->fetch_assoc())
        {
            $position = $count +1;
            // Concatenate the top-20 highest ADVENTURE_mode accuracy player information (position, name, accuracy)
            $leaderboard_str = $leaderboard_str.$position.$comma.$row['name'].$comma.$row['accuracy'];

            if ($count+1 != $num_rows)
                $leaderboard_str = $leaderboard_str.'|';
            $count = $count + 1;
        }
        // reset the count so that we can use for below again
        $count = 0;
        
        // * is to split up between ADVENTURE mode and PVP mode's leaderboard
        $leaderboard_str = $leaderboard_str.'*';
        
        // Another SQL statement that sort and calculates the accuracy but for PVP MODE
        $sql_2 = "SELECT a.name, l.rank, l.rank_points FROM leaderboard l INNER JOIN accounts a
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
                $leaderboard_str = $leaderboard_str.$position.$comma.$row['name'].$comma.$row['rank'].
                        $comma.$row['rank_points'];

                if ($count+1 != $num_rows)
                    $leaderboard_str = $leaderboard_str.'|';
                $count = $count + 1;
            }
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