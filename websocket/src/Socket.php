<?php

namespace Skythel\Websocket;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Amp\Mysql;

class Socket implements MessageComponentInterface {

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $client) {

        echo "Connecting new client...\n";

        // Store the new connection in $this->clients
        $this->clients->attach($client);

        // Change the token in db to connected
        \Amp\Loop::run(function() use ($client) {
            // Get the auth token
            parse_str($client->httpRequest->getUri()->getQuery(), $queryParameters);
    
            require "../../../secrets.php";
            $config = \Amp\Mysql\ConnectionConfig::fromString(
                "host=127.0.0.1 user=$username password=$password db=$db"
            );
            
            /** @var \Amp\Mysql\Pool $pool */
            $pool = \Amp\Mysql\pool($config);
            
            /** @var \Amp\Mysql\Statement $statement */
            $statement = yield $pool->prepare("update socket_connections set status='Connected', resource_id=:id where token=:token");
            
            /** @var \Amp\Mysql\ResultSet $result */
            if(yield $statement->execute(['id' => $client->resourceId, 'token' => $queryParameters['token']])) {

                // Save the client's username
                $statement2 = yield $pool->prepare("select accounts.username, accounts.account_id, students.character_type, students.teacher_account_id from accounts join socket_connections on accounts.account_id = socket_connections.account_id join students on accounts.account_id = students.student_id where token=:token and status='Connected' order by timestamp desc limit 1");

                $result = yield $statement2->execute(['token' => $queryParameters['token']]);
                yield $result->advance();
                $row = $result->getCurrent();
                $client->userinfoUsername = $row["username"];
                $client->userinfoID = $row["account_id"];
                $client->userinfoCharacter = $row["character_type"];
                $client->userinfoWorld = $queryParameters["world"];
                $client->teacherID = $row["teacher_account_id"]; 
                $client->posX = 200;
                $client->posY = 400;
                
                // Hold the username of opponent, time updated, and status in an array
                // ["Available", <anything>, <unix_time>]: the client is available for pvp
                // ["Sent", "user1", <unix_time>]: the client has sent a challenge to user1
                // ["Received", "user1", <unix_time>]: the client has received a challenge from user1
                // ["Playing", "user1", <unix_time>]: the client is currently playing against user1
                $client->pvpStatus = ["Available", "", time()]; 

                // Hold the client's current room that they are doing adventure or assignment in
                // $client->currentRoom = [];

                // Pass the coordinates and character id to all logged in players in the game world
                $allPlayers["firstload"] = 0;
                foreach ($this->clients as $player) {
                    // var_dump($player->posX);
                    // var_dump($player->posY);
                    if($client->userinfoUsername == $player->userinfoUsername) continue;
                    if($player->userinfoWorld == $client->userinfoWorld && $client->userinfoUsername !== $player->userinfoUsername) {
                        $player->send("[connect] $client->userinfoUsername: $client->userinfoCharacter");
                        $allPlayers[$player->userinfoUsername] = "$player->userinfoCharacter-$player->posX-$player->posY";
                    }
                }

                // Send the client the data of all logged in users
                $client->send(json_encode($allPlayers));
                
                echo "$client->userinfoUsername#$client->userinfoID just connected as Client$client->resourceId with token {$queryParameters['token']}!\n";
            }
            else {
                echo "Client ({$client->resourceId}) encountered error.\n";
            }
            $pool->close();
        });
    }

    public function onMessage(ConnectionInterface $client, $msg) {

        // Character moving
        if(preg_match_all("/^\/move x(.+) y(.+) t(.+)$/", $msg, $matches)) {
            $posX = $matches[1][0];
            $posY = $matches[2][0];
            $time = $matches[3][0];
            // Save the player's updated location
            $client->posX = $posX;
            $client->posY = $posY;
            echo "$client->userinfoUsername moved to x$client->posX y$client->posY t$time\n";

            // Broadcast the update to all other players
            foreach ($this->clients as $player) {
                // if($client->userinfoUsername == $player->userinfoUsername) continue;
                if($player->userinfoWorld == $client->userinfoWorld && $client->userinfoUsername !== $player->userinfoUsername) {
                    $player->send("[move] $client->userinfoUsername: c$client->userinfoCharacter x$client->posX y$client->posY t$time");
                }
            }
        }

        // Update the client
        if(preg_match("/^\/update$/", $msg)) {
            $allPlayers = [];
            foreach ($this->clients as $player) {
                // if($client->userinfoUsername == $player->userinfoUsername) continue;
                if($player->userinfoWorld == $client->userinfoWorld && $client->userinfoUsername !== $player->userinfoUsername) {
                    $allPlayers[$player->userinfoUsername] = "$player->userinfoCharacter-$player->posX-$player->posY";
                }
            }

            // Send the client the data of all logged in users
            $client->send(json_encode($allPlayers));
            return;
        }

        // Start adventure mode
        if(preg_match_all("/^\/adventure (.+)/", $msg, $matches)) {
            $section = strtolower($matches[1][0]); // lower or upper

            // Make the player unavailable for pvp
            $client->pvpStatus = ["Playing", "", time()];

            \Amp\Loop::run(function() use ($client, $section) {
                require "../../../secrets.php";
                $config = \Amp\Mysql\ConnectionConfig::fromString(
                    "host=127.0.0.1 user=$username password=$password db=$db"
                );
            
                $pool = \Amp\Mysql\pool($config);
                
                // Get the client's accuracy data
                $statement = yield $pool->prepare("select * from students where student_id = :id");

                $result = yield $statement->execute(['id' => $client->userinfoID]);
                yield $result->advance();
                $row = $result->getCurrent();

                $resetdate = $row["{$client->userinfoWorld}_{$section}_reset_date"];

                // The reset date saved in db is the date at which the scores will be reset. Attempting adventure before this reset date will change the reset date to 2 days from the attempt. 
                if(time() > $resetdate) {
                    // Reset the scores
                    $correct = 0;
                    $attempted = 0;
                    $accuracy = 0;
                }
                else {
                    $correct = $row["{$client->userinfoWorld}_{$section}_correct"];
                    $attempted = $row["{$client->userinfoWorld}_{$section}_attempted"];
                    $accuracy = $correct / $attempted;
                }
                
                // Create the room id from <userid><timestamp> to be unique. These values won't ever be extracted from the room id, it is only used as an identifier. 
                $rid = intval($client->userinfoID.time());

                // Assign player to a new room
                $client->currentRoom = array("room" => $rid, "type" => "adv", "section" => $section, "totalCorrect" => $correct, "totalAttempted" => $attempted, "sessionCorrect" => [], "sessionAttempted" => []);
                // "sessionCorrect" and "sessionAttempted" hold arrays of question ids and answer given, only within currentRoom
                
                if($accuracy < 0.5) {
                    // Give easy question
                    $sql = "select * from questions where question_type like :world and section like :section and level = 'Easy' order by rand() limit 1";
                }
                elseif($accuracy < 0.75) {
                    // Give medium question
                    $sql = "select * from questions where question_type like :world and section like :section and level = 'Medium' order by rand() limit 1";
                }
                else {
                    // Give hard question
                    $sql = "select * from questions where question_type like :world and section like :section and level = 'Hard' order by rand() limit 1";
                }

                $statement = yield $pool->prepare($sql);
                $result = yield $statement->execute(['world' => $client->userinfoWorld, 'section' => "$section Pri"]);
                yield $result->advance();
                $row = $result->getCurrent();

                $client->currentQuestion = $row;
                $client->send("[question] {$row["question"]}, {$row["choice1"]}, {$row["choice2"]}, {$row["choice3"]}, {$row["choice4"]}, {$row["level"]}");

                $pool->close();
            });
        }

        // Start assignment mode
        if(preg_match_all("/^\/assignment (.+)/", $msg, $matches)) {
            $assignment = $matches[1][0];  

            \Amp\Loop::run(function() use ($client, $assignment) {
                require "../../../secrets.php";
                $config = \Amp\Mysql\ConnectionConfig::fromString(
                    "host=127.0.0.1 user=$username password=$password db=$db"
                );
            
                $pool = \Amp\Mysql\pool($config);

                $statement = yield $pool->prepare("select assignments.account_id, assignments.assignment_id, count(*) as count from assignments join questions_bank on assignments.assignment_name = questions_bank.assignment_name where assignment_name = :name");
                $result = yield $statement->execute(['name' => $assignment]);
                yield $result->advance();
                $row = $result->getCurrent();
                // Make sure the client is allowed to answer this assignment
                if($client->teacherID !== $row["account_id"]) {
                    $client->send("[error] You are not allowed to take this assignment.");
                    echo "$client->userinfoUsername is not allowed to take this assignment.";
                    return;
                }

                // Make the player unavailable for pvp
                $client->pvpStatus = ["Playing", "", time()];
                
                // Create the room id from <userid><timestamp> to be unique. These values won't ever be extracted from the room id, it is only used as an identifier. 
                $rid = intval($client->userinfoID.time());

                // Assign player to a new room
                $client->currentRoom = array("room" => $rid, "type" => "ass", "asid" => $row["assignment_id"], "qns" => $row["count"], "sessionCorrect" => [], "sessionAttempted" => []);
                // "sessionCorrect" and "sessionAttempted" hold arrays of question ids and answer given, only within currentRoom
                
                $sql = "select * from questions_bank where assignment_name like :name order by rand() limit 1";
                $statement = yield $pool->prepare($sql);
                $result = yield $statement->execute(['name' => $assignment]);
                yield $result->advance();
                $row = $result->getCurrent();

                $client->currentQuestion = $row;
                $client->send("[question] {$row["question"]}, {$row["choice1"]}, {$row["choice2"]}, {$row["choice3"]}, {$row["choice4"]}");

                $pool->close();
            });
        }

        // Mark client's answer
        if(preg_match_all("/^\/answer (\d)/", $msg, $matches)) {
            // Check game mode 
            if(isset($client->currentRoom["type"]) && $client->currentRoom["type"] == "adv") {
                $max_qns = 10;
            }
            elseif(isset($client->currentRoom["type"]) && $client->currentRoom["type"] == "ass") {
                $max_qns = $client->currentRoom["qns"];
            }
            elseif(isset($client->currentRoom["type"]) && $client->currentRoom["type"] == "pvp") {
                $max_qns = 5;
            }
            else {
                echo "$client->userinfoUsername is not allowed to answer\n";
                return;
            }
            $answer = $matches[1][0]; 
            
            \Amp\Loop::run(function() use ($client, $answer, $max_qns) {
                require "../../../secrets.php";
                $config = \Amp\Mysql\ConnectionConfig::fromString(
                    "host=127.0.0.1 user=$username password=$password db=$db"
                );
            
                $pool = \Amp\Mysql\pool($config);

                $roomObject = $client->currentRoom;
                $roomObject["totalAttempted"]++;
                $roomObject["sessionAttempted"][] = [$client->currentQuestion["question_id"], $answer];
                $correct = false;

                // Check against client's current question info
                if($client->currentQuestion["answer"] == $answer) {
                    // Correct
                    $roomObject["totalCorrect"]++;
                    $roomObject["sessionCorrect"][] = [$client->currentQuestion["question_id"], $answer];
                    $correct = true;
                }
                $client->currentRoom = $roomObject;
                unset($roomObject);

                // Record in database
                if($client->currentRoom["type"] == "adv") {
                    $sql = "insert into adventure_tracking (adventure_room_id, account_id, question_id, answer, timestamp) values (:rid, :acc_id, :q_id, :ans, :time)";
                    $statement = yield $pool->prepare($sql);
                    yield $statement->execute(['rid' => $client->currentRoom["room"], 'acc_id' => $client->userinfoID, 'q_id' => $client->currentQuestion["question_id"], 'ans' => $answer, 'time' => time()]);
                }
                elseif($client->currentRoom["type"] == "ass") { 
                    $sql = "insert into assignments_log (assignment_room_id, assignment_id, account_id, question_id, answer, timestamp) values (:rid, :asid, :acc_id, :q_id, :ans, :time)"; 
                    $statement = yield $pool->prepare($sql);
                    yield $statement->execute(['rid' => $client->currentRoom["room"], 'asid' => $client->currentRoom["asid"], 'acc_id' => $client->userinfoID, 'q_id' => $client->currentQuestion["question_id"], 'ans' => $answer, 'time' => time()]);
                }
                elseif($client->currentRoom["type"] == "pvp") {
                    $sql = "insert into pvp_tracking (pvp_room_id, account_id, question_id, answer, timestamp) values (:rid, :acc_id, :q_id, :ans, :time)";
                    $statement = yield $pool->prepare($sql);
                    yield $statement->execute(['rid' => $client->currentRoom["room"], 'acc_id' => $client->userinfoID, 'q_id' => $client->currentQuestion["question_id"], 'ans' => $answer, 'time' => time()]);
                }
                else {
                    echo "$client->userinfoUsername encountered an unknown error.";
                    return;
                }
                
                // Send the result and explanation
                $client->send("[answer] $correct, {$client->currentQuestion["choice{$client->currentQuestion["answer"]}"]}, {$client->currentQuestion["explanation"]}");

                // Send the next question if any
                if(count($client->currentRoom["sessionAttempted"]) >= $max_qns) {
                    // Send result
                    $client->send("[result] ".count($client->currentRoom["sessionCorrect"])." ".count($client->currentRoom["sessionAttempted"]));
                    
                    // echo "HELLO";

                    if($client->currentRoom["type"] == "adv") {
                        // Obtain the section
                        $section = $client->currentRoom["section"];
                        
                        // Update the players' record
                        // world_section_correct = e.g. idiom_lower_correct
                        // world_section_attempted = e.g. idiom_lower_attempted
                        $world_section_correct = $client->userinfoWorld.'_'.$section.'_correct';
                        $world_section_attempted = $client->userinfoWorld.'_'.$section.'_attempted';
                        $world_section_reset = $client->userinfoWorld.'_'.$section.'_reset_date';
                        $num_correct = count($client->currentRoom["sessionCorrect"]);
                        $num_attempted = count($client->currentRoom["sessionAttempted"]);
                        $reset_date = time()+86400*2;
                        
                        $sql = "UPDATE students SET {$world_section_correct} = {$world_section_correct} + {$num_correct}, {$world_section_attempted} = {$world_section_attempted} + {$num_attempted}, {$world_section_reset} = {$reset_date} WHERE student_id = {$client->userinfoID}";
                        $statement = yield $pool->query($sql);
                        // $statement->execute();
                    }
                    
                    unset($client->currentQuestion);
                    unset($client->currentRoom);
                    
                    // Make the player available for pvp
                    $client->pvpStatus = ["Available", "", time()];
                }
                else {
                    $accuracy = $client->currentRoom["totalCorrect"] / $client->currentRoom["totalAttempted"];
                    // Get array of attempted questions within this session
                    $attempted = $client->currentRoom["sessionAttempted"][0][0];
                    for($i = 1; $i<count($client->currentRoom["sessionAttempted"]); $i++) {
                        $attempted .= ", {$client->currentRoom["sessionAttempted"][$i][0]}";
                    }

                    // Send next question
                    if($accuracy < 0.5) {
                        // Give easy question
                        $sql = "select * from questions where question_type like :world and section like :section and level = 'Easy' and question_id not in ($attempted) order by rand() limit 1";
                    }
                    elseif($accuracy < 0.75) {
                        // Give medium question
                        $sql = "select * from questions where question_type like :world and section like :section and level = 'Medium' and question_id not in ($attempted) order by rand() limit 1";
                    }
                    else {
                        // Give hard question
                        $sql = "select * from questions where question_type like :world and section like :section and level = 'Hard' and question_id not in ($attempted) order by rand() limit 1";
                    }

                    $statement = yield $pool->prepare($sql);
                    $result = yield $statement->execute(['world' => $client->userinfoWorld, 'section' => "{$client->currentRoom["section"]} Pri"]);
                    yield $result->advance();
                    $row = $result->getCurrent();

                    $client->currentQuestion = $row;
                    $client->send("[question] {$row["question"]}, {$row["choice1"]}, {$row["choice2"]}, {$row["choice3"]}, {$row["choice4"]}, {$row["level"]}");
                }
                $pool->close();
            });
        }

        // Message handler for slash commands

        echo "Client $client->resourceId said $msg\n";

        // /challenge <player_username>: create a new challenge record in db
        if(preg_match_all("/^\/challenge (.+)$/", $msg, $matches)) {
            $recipientUsername = $matches[1][0];
            if(!strcasecmp($client->userinfoUsername, $recipientUsername)) {
                $client->send("[error] 1: You cannot challenge yourself!");
                return;
            }

            if($client->pvpStatus[0] !== "Available" && $client->pvpStatus[2] > time()-60) {
                $client->send("[error] 5: You currently have an ongoing challenge.");
                return;
            }
            
            // Loop through players in the socket to see if username matches
            foreach ($this->clients as $player) {
                if ($player->userinfoWorld == $client->userinfoWorld && !strcasecmp($player->userinfoUsername, $recipientUsername)) {
                    // May need some constraint checks e.g. cannot challenge a player if they already have a challenge ongoing
                    if($player->pvpStatus[0] !== "Available" && $player->pvpStatus[2] > time()-60) {
                        $client->send("[error] 3: Your opponent is currently engaged in a match.");
                        return;
                    }
                    
                    // Save the info in pvpStatus
                    $time = time();
                    $client->pvpStatus = ["Sent", $player->userinfoUsername, $time];
                    $player->pvpStatus = ["Received", $client->userinfoUsername, $time];
                    $client->send("[challenge sent] $client->userinfoUsername: I challenge you to battle, $player->userinfoUsername!");
                    $player->send("[challenge] $client->userinfoUsername: I challenge you to battle, $player->userinfoUsername! Will you accept or reject?");
                    
                    // Save the info in database
                    // ...

                    echo "$client->userinfoUsername challenged user {$recipientUsername}!\n";
                    return;
                }
            }

            // Player was not found
            $client->send("[error] 2: The player cannot be found.");
        }

        // /accept <player_username>: start the pvp match
        if(preg_match_all("/^\/accept (.+)$/", $msg, $matches)) {
            // Do some database checks for existing challenge id, permissions, etc
            $recipientUsername = $matches[1][0];
            if(!strcasecmp($client->userinfoUsername, $recipientUsername)) {
                $client->send("[error] 1: You cannot challenge yourself!");
                return;
            }
            
            // Check if client has existing invitation
            if($client->pvpStatus[0] !== "Received" || strcasecmp($client->pvpStatus[1], $recipientUsername) || $client->pvpStatus[2] < time()-60) {
                $client->send("[error] 4: This challenge request does not exist.");
                return;
            }

            // Loop through players in the socket to see if username matches
            foreach ($this->clients as $player) {
                if ($player->userinfoWorld == $client->userinfoWorld && !strcasecmp($player->userinfoUsername, $recipientUsername)) {
                    if($player->pvpStatus[0] !== "Sent" || strcasecmp($player->pvpStatus[1], $client->userinfoUsername) || $client->pvpStatus[2] < time()-60) {
                        $client->send("[error] 4: This challenge request does not exist.");
                        return;
                    }
                    
                    // Save the info in pvpStatus
                    $time = time();
                    $client->pvpStatus = ["Playing", $player->userinfoUsername, time()];
                    $player->pvpStatus = ["Playing", $client->userinfoUsername, time()];
                    $client->send("[challenge accepted] $client->userinfoUsername: I accept your challenge, $player->userinfoUsername!");
                    $player->send("[challenge accepted] $client->userinfoUsername: I accept your challenge, $player->userinfoUsername!");
                    
                    // Save the info in database
                    // ...

                    // echo "$client->userinfoUsername challenged user {$recipientUsername}!\n";
                    return;
                }
            }

            // Player was not found
            $client->send("[error] 2: The player cannot be found.");
            // echo "Client $client->resourceId accepted challenge ID {$matches[1][0]}!\n";
        }

        // /reject <player_username>: reject the challenge
        if(preg_match_all("/^\/reject (.+)$/", $msg, $matches)) {
            // Do some database checks for existing challenge id, permissions, etc
            $recipientUsername = $matches[1][0];
            if(!strcasecmp($client->userinfoUsername, $recipientUsername)) {
                $client->send("[error] 1: You cannot challenge yourself!");
                return;
            }
            
            // Check if client has existing invitation
            if($client->pvpStatus[0] !== "Received" || strcasecmp($client->pvpStatus[1], $recipientUsername) || $client->pvpStatus[2] < time()-60) {
                $client->send("[error] 4: This challenge request does not exist.");
                return;
            }

            // Loop through players in the socket to see if username matches
            foreach ($this->clients as $player) {
                if ($player->userinfoWorld == $client->userinfoWorld && !strcasecmp($player->userinfoUsername, $recipientUsername)) {
                    if($player->pvpStatus[0] !== "Sent" || strcasecmp($player->pvpStatus[1], $client->userinfoUsername) || $client->pvpStatus[2] < time()-60) {
                        $client->send("[error] 4: This challenge request does not exist.");
                        return;
                    }
                    
                    // Revert the pvpStatus to available
                    $time = time();
                    $client->pvpStatus = ["Available", "", $time];
                    $player->pvpStatus = ["Available", "", $time];
                    $client->send("[challenge rejected] $client->userinfoUsername: I reject your challenge, $player->userinfoUsername!");
                    $player->send("[challenge rejected] $client->userinfoUsername: I reject your challenge, $player->userinfoUsername! sadface :'(");
                    
                    // Save the info in database
                    // ...

                    // echo "$client->userinfoUsername challenged user {$recipientUsername}!\n";
                    return;
                }
            }

            // Player was not found
            $client->send("[error] 2: The player cannot be found.");
            // echo "Client $client->resourceId rejected challenge ID {$matches[1][0]}!\n";
        }

        // /message <player_username> <message>: sends a new message to player's username
        if(preg_match_all("/^\/message (.+) (.+)$/", $msg, $matches)) {
            $recipientUsername = $matches[1][0];
            $message = $matches[2][0];
            echo "Sending message to user $recipientUsername: $message\n";

            foreach ($this->clients as $player) {
                if ($player->userinfoWorld == $client->userinfoWorld && !strcasecmp($player->userinfoUsername, $recipientUsername)) {
                    $player->send("[message] $client->userinfoUsername: $message");
                    $client->send("[to $player->userinfoUsername] $client->userinfoUsername: $message");
                    return;
                }
            }

            // Player doesn't exist or offline
            $client->send("[error] 2: The player cannot be found.");
        }

        // /world <message>: sends a new message to player
        if(preg_match_all("/^\/world (.+)$/", $msg, $matches)) {
            $message = $matches[1][0];
            echo "Client $client->resourceId messaged world: $message\n";

            foreach ($this->clients as $player) {
                if ($player->userinfoWorld == $client->userinfoWorld) {
                    // Don't send the message back to the person who sent it
                    // if ($client->resourceId == $player->resourceId) {
                    //     continue;
                    // }
                    $player->send("[world] $client->userinfoUsername: $message");
                }
            }
        }

        // /status <player_username>: reveals the pvpStatus of a player
        if(preg_match_all("/^\/status (.+)$/", $msg, $matches)) {
            $recipientUsername = $matches[1][0];
            echo "Client $client->resourceId checked the pvpStatus of $recipientUsername\n";

            foreach ($this->clients as $player) {
                if ($player->userinfoWorld == $client->userinfoWorld && !strcasecmp($player->userinfoUsername, $recipientUsername)) {
                    $client->send("[status] $player->userinfoUsername: {$player->pvpStatus[0]} {$player->pvpStatus[1]} at {date('y M d h:i:s', $player->pvpStatus[2])}");
                    return;
                }
            }

            // Player doesn't exist or offline
            $client->send("[error] 2: The player cannot be found.");
        }
    }

    public function onClose(ConnectionInterface $client) {
        echo "Client $client->resourceId left\n";

        // Disconnect the resource
        $this->clients->detach($client);

        // Change the token in db to disconnected
        \Amp\Loop::run(function() use ($client) {
            // Get the auth token
            // parse_str($client->httpRequest->getUri()->getQuery(), $queryParameters);
    
            require "../../../secrets.php";
            $config = \Amp\Mysql\ConnectionConfig::fromString(
                "host=127.0.0.1 user=$username password=$password db=$db"
            );
            
            /** @var \Amp\Mysql\Pool $pool */
            $pool = \Amp\Mysql\pool($config);
            
            /** @var \Amp\Mysql\Statement $statement */
            $statement = yield $pool->prepare("update socket_connections set status='Disconnected' where resource_id=:id");
            
            /** @var \Amp\Mysql\ResultSet $result */
            if(yield $statement->execute(['id' => $client->resourceId])) {
                echo "Disconnected client ({$client->resourceId}).\n";

                // Update all other players
                foreach ($this->clients as $player) {
                    // Remove the pvp request from any players with a pending request from disconnected player
                    if($player->pvpStatus[1] == $client->userinfoUsername) {
                        $player->pvpStatus = ["Available", "", time()];
                    }

                    if($player->userinfoWorld == $client->userinfoWorld) {
                        $player->send("[disconnect] $client->userinfoUsername: $client->userinfoCharacter");
                    }
                }
            }
            else {
                echo "Client ({$client->resourceId}) encountered error.\n";
            }
            $pool->close();
        });
    }

    public function onError(ConnectionInterface $client, \Exception $e) {
        echo "Client $client->resourceId received error $e\n";
    }
}
