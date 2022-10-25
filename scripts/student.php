<?php
include "config.php";
include "functions_utility.php";

// Retrieve account_id using SESSION
$account_id = getLoggedInAccountId();

$student = new Student($conn);

// Trigger createCustomGame
if(isset($_POST["customLevelName"]) && isset($_POST["question_type_difficulty"]) && isset($_POST["function_name"]) && $_POST["function_name"] == "createCustomGame"){
    echo $student->createCustomGame($account_id, $_POST["customLevelName"], $_POST["question_type_difficulty"]);
}

// Trigger viewAllCustomGame
if(isset($_POST["function_name"]) && $_POST["function_name"] == "viewAllCustomGame"){
    echo $student->viewAllCustomGame($account_id);
}

// Trigger deleteCustomGame
if(isset($_POST["customLevelName"]) && isset($_POST["function_name"]) && $_POST["function_name"] == "deleteCustomGame"){
    echo $_POST["customLevelName"];
    echo $student->deleteCustomGame($account_id, $_POST["customLevelName"]);
}

// A Student class that holds all the function needed for students
class Student
{
    private $conn;
    
    // A constructor that calls database controller once.
    public function __construct($db)
    {
        $this->conn = $db;
    }
   
    // Function: Opponent choose to accept/reject Pvp request
    // Inputs: int $requester_id, int $opponent_id, $status
    // Outputs: Return the status(0/1/3) Update the Pvp_session with the status (Accept/Reject/Expired(If time exceeded)
    //          int 4 on requeseter_id/opponent_id is not exists
    //          int 2 on server error. 
    
    public function acceptPvpRequest(int $requester_id, int $opponent_id, $status)
    {
        // Check to see if requester_id or opponent_id is exists
        if (!checkAccountIdExists($requester_id) or !checkAccountIdExists($opponent_id)) return 4;
        
        // 0 status = accept; 1 status = reject, 2 status = Waiting, 3 status = Expired
        // Obtain the latest timestamp's pvp request
        $sql_1 = "SELECT * FROM pvp_session WHERE requester_id = ? AND opponent_id = ? ORDER BY timestamp DESC LIMIT 1";
        $stmt_1 = $this->conn->prepare($sql_1);
        
        if (
            $stmt_1->bind_param('ii', $requester_id, $opponent_id) &&
            $stmt_1->execute()
        ){
            $result_1 = $stmt_1->get_result();
            $row_1 = $result_1->fetch_assoc();
            $timestamp = time();
            // Accept/Reject Time - TimeOfPvpRequest send
            $time_diff = $timestamp-$row_1['timestamp'];
            
            $sql_2 = "UPDATE pvp_session SET status = ? WHERE requester_id = ? AND opponent_id = ? AND timestamp = ?";
            $stmt_2 = $this->conn->prepare($sql_2);
            
            // Pvprequest exceed 1minute, automatically set status become 3 = Expired
            if ($time_diff > 60)
            {   
                $status = 3;
            }
            
            // Update the Pvp session with the status Accept/Reject/Expired
            if(
                $sql_2 && 
                $stmt_2->bind_param('iiii', $status, $requester_id, $opponent_id, $row_1['timestamp']) &&
                $stmt_2->execute()
            ){
                return $status;
            }
            else
            {
                if($debug_mode) echo $this->conn->error;
                    return 2; // ERROR with database SQL
            }
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                return 2; // ERROR with database SQL
        }
    }
    
    // Function: helper function to check if the customLevelName has been created before
    //           To prevent having duplicates customGameName
    // Inputs: int int $account_id, string $customLevelName
    //                                    
    // Outputs: TRUE: database already have this name which is created before by the user
    //          False: database never find this custom
    public function checkCustomGameNameExists(int $account_id, string $customLevelName): bool
    {
        // Check through the database to see if the user has a customLevelName which is created before
        $sql = "SELECT * FROM custom_levels WHERE account_id = ? AND customLevelName = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("is", $account_id, $customLevelName);
        $stmt->execute();
        $stmt->store_result();
        if($stmt->num_rows > 0) return true;
        return false;
    }
    
    // Function: Student can create their own custom game based on their input
    // Inputs: int int $account_id, string $customLevelName, string $question_type_difficulty
    //                                    
    // Outputs: Int 0 on success, successfully created CustomGame
    //          int 1 on account_id is not exists
    //          int 2 on server error. 
    public function createCustomGame(int $account_id, string $customLevelName, string $question_type_difficulty)
    {
        // Check to see if account_id exists
        if (!checkAccountIdExists($account_id)) return 1;
        
        // Check to see if the customLevelName exists
        if ($this->checkCustomGameNameExists($account_id, $customLevelName)) return 2;
        
        // customGameName must be at least be 2 letters
        if (strlen($customLevelName) < 2) return 3;
        
        // Insert a row into custom_levels table based on user's input
        // $question_type_difficulty is a string variable, example "Idioms, Medium|Pinyin, Hard"
        $sql = "INSERT INTO custom_levels (account_id, customLevelName, question_type_difficulty, timestamp) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $timestamp = time();
        
        // After that, a custom game Id row will be created in the custom_levels table
        if( 
            $stmt->bind_param('issi', $account_id, $customLevelName, $question_type_difficulty, $timestamp) &&
            $stmt->execute()
        ){
            return 0;
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                return 4; // ERROR with database SQL
        }
    }
    
    // Function: Student can delete their own custom game
    // Inputs: int int $account_id, string $customLevelName
    //                                    
    // Outputs: Int 0 on success, successfully deleted CustomGame
    //          int 1 on account_id is not exists
    //          int 2 on server error. 
    function deleteCustomGame(int $account_id, string $customLevelName)
    {
        // Check to see if account_id exists
        if (!checkAccountIdExists($account_id)) return 1;
        
        // Delete the custom level from the table, based on account_id and customLevelName
        $sql = "DELETE FROM custom_levels WHERE account_id = ? AND customLevelName = ?";
        $stmt = $this->conn->prepare($sql);
        
        // After that, that specific customgame row will be deleted from the database
        if( 
            $stmt->bind_param('is', $account_id, $customLevelName) &&
            $stmt->execute()
        ){
            return 0;
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                return 2; // ERROR with database SQL
        }
    }
        
    // A helper function for CustomGame question function.
    public function generateQuestion(int $account_id, int $idiom_lower_count, int $idiom_upper_count,
                                        int $fill_lower_count, int $fill_upper_count,
                                        int $pinyin_lower_count, int $pinyin_upper_count)
    {
        
        $qn_category = ['idiom_Lower pri', 'idiom_Upper pri','fill_Lower pri',
                        'fill_Upper pri','pinyin_Lower pri', 'pinyin_Upper pri'];
        
        $qn_list = [$idiom_lower_count, $idiom_upper_count, $fill_lower_count,
            $fill_upper_count, $pinyin_lower_count, $pinyin_upper_count];
        
        for ($x=0; $x <count($qn_list); $x++)
        {
            if ($qn_list[$x] > 0)
            {
                
                // Using delimiter to extract the section name question type name
                // word[0] = fill/pinyin/idiom
                // word[1] = Lower pri / Upper pri
                $delimiter = '_';
                $word = explode($delimiter, $qn_category[$x]); 
                
                $sql_1 = "SELECT * FROM questions WHERE section = ? AND question_type = ?
                        ORDER BY RAND()
                        LIMIT ?";
                $stmt_1 = $this->conn->prepare($sql_1);
                if( 
                    $stmt_1->bind_param('ssi', $word[1], $word[0], $qn_list[$x]) &&
                    $stmt_1->execute()
                ){
                    $result = $stmt_1->get_result();
                    while ($row = $result->fetch_assoc())
                    {
                        $sql_2 = "INSERT INTO questions_bank (question_type, section, level, question, choice1, choice2, choice3, choice4, answer, explanation, account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        $stmt_2 = $this->conn->prepare($sql_2);
                    
                        if(
                            $stmt_2->bind_param('ssssssssssi', $row['question_type'], $row['section'],
                                                $row['level'], $row['question'], $row['choice1'],
                                                $row['choice2'], $row['choice3'], $row['choice4'],
                                                $row['answer'], $row['explanation'], $account_id) &&
                            $stmt_2->execute()  
                        ){
                            continue;
                        }
                        else
                        {
                            if($debug_mode) echo $this->conn->error;
                                return 2; // ERROR with database SQL
                        }
                    }
                }
                else
                {
                    if($debug_mode) echo $this->conn->error;
                        return 2; // ERROR with database SQL
                }
            }
        }
        return 0;
    }
    
    // Functions: Send Pvp request to opponent
    // Inputs: int $requester_id, int $opponent_id, int $pvp_room_type
    // Outputs: Int 0 on success, successfully sendPvp request to opponent
    //          int 1 on requester/opponent_id is not exists
    //          int 2 on requester choose CustomGame, but has no customGame created. error
    //          int 3 on server error. 
    public function sendPvpRequest(int $requester_id, int $opponent_id, int $pvp_room_type)
    {
        // Check to see if requester_id or opponent_id is valid
        if (!checkAccountIdExists($requester_id) or !checkAccountIdExists($opponent_id)) return 1;
        
        // pvp_room_type -> 0 denotes choose CustomGame for PVP; 1 denotes choose RandomizeGame for PVP;
        if ($pvp_room_type == 0){
            // Check to see if user has create a custom game before anot
            // No Custom Game created return 1; (Please go create ..)
            if (!$this->checkCustomGameExists($requester_id)){
                return 2;
            }
        }
        // When you send a pvp request, it will create a row in the pvp_session table
        $status = 2; // when u send request the status default is 2 = Waiting 
        $timestamp = time();
        
        $sql = "INSERT INTO pvp_session (requester_id, opponent_id, status, timestamp, pvp_room_type) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        
        if (
            $stmt->bind_param('iiiii', $requester_id, $opponent_id, $status, $timestamp, $pvp_room_type) &&
            $stmt->execute()
        ){
            return 0;
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                return 3; // ERROR with database SQL
        }
    }
    
    // Functions: Student to view other Players profiles
    // Inputs: int $account_id
    // Outputs: Upon success, will return a list of information of the player that you want view
    //          int 1 on player that you want to view does not exists
    //          int 2 on database error
    public function viewProfile(int $account_id)
    {
        // Check to see if player that you want view is valid
        if (!checkAccountIdExists($account_id)) return 1;
        
        $sql = "SELECT student_id, character_type, idiom_lower_accuracy, idiom_upper_accuracy,
        fill_lower_accuracy, fill_upper_accuracy, pinyin_lower_accuracy,
        pinyin_upper_accuracy,name FROM students s LEFT JOIN accounts a ON a.account_id = s.student_id WHERE s.student_id = ?";
        
        $stmt = $this->conn->prepare($sql);
        
        if( 
            $stmt->bind_param('i', $account_id) &&
            $stmt->execute()
        ){
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            
            return $row;
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                return 2; // ERROR with database SQL
        }
    }
    
    // Functions: Student to view all its created Custom Game
    // Inputs: int $account_id
    // Outputs: Upon success, will return a string of CustomLevelName 
    //          int 1 on player that you want to view does not exists
    //          int 2 on database error
    function viewAllCustomGame(int $account_id)
    {
        // Check if user id exists
        if (!checkAccountIdExists($account_id)) return 1;
        
        $customLevelName_str = '';
        
        // sql statement to retrieve all the data of customGame created by the account_id
        $sql = "SELECT customLevelName FROM custom_levels WHERE account_id = ?";
        $stmt = $this->conn->prepare($sql);
        
        if( 
            $stmt->bind_param('i', $account_id) &&
            $stmt->execute()

        ){
            $result = $stmt->get_result();
            $num_rows = $result->num_rows;
            $count = 0;
            while ($row = $result->fetch_assoc())
            {
                // Concatenate all the customName created by the user into a string format
                $customLevelName_str = $customLevelName_str.$row['customLevelName'];
                if ($count+1 != $num_rows)
                    $customLevelName_str = $customLevelName_str.',';
                $count = $count + 1;
            }
            return $customLevelName_str;
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                    return 2; // ERROR with database SQL
        }
    }
 
    function viewLeaderBoard($account_id)
    {   
    
        // Check if user id exists
        if (!checkAccountIdExists($account_id)) return 1;

        $leaderboard_list = [];
        // Obtain the whole leaderboards information PVP rank, rank_points as well as Adventure's mode accuracy
        $sql = "SELECT a.name, s.student_id, s.idiom_lower_accuracy, s.idiom_upper_accuracy, s.fill_lower_accuracy,
                                s.fill_upper_accuracy, s.pinyin_lower_accuracy, s.pinyin_upper_accuracy, l.rank,
                                l.rank_points FROM students s INNER JOIN leaderboard l ON s.student_id = l.account_id
                                INNER JOIN accounts a ON l.account_id = a.account_id";

        $stmt = $this->conn->prepare($sql);
        
        if( 
            $stmt->execute()

        ){
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc())
            {
                array_push($leaderboard_list, $row);
            }
            return $leaderboard_list;
        }
        else
        {
            if($debug_mode) echo $this->conn->error;
                    return 2; // ERROR with database SQL
        }
    }
}
?>