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
                $statement2 = yield $pool->prepare("select accounts.username, accounts.account_id from accounts join socket_connections on accounts.account_id = socket_connections.account_id where token=:token and status='Connected' order by timestamp desc limit 1");

                $result = yield $statement2->execute(['token' => $queryParameters['token']]);
                yield $result->advance();
                $row = $result->getCurrent();
                $client->userinfoUsername = $row["username"];
                $client->userinfoID = $row["account_id"];
                // $client->pvpStatus = "Available";
                // $client->pvpOpponent = "";
                

                echo "$client->userinfoUsername#$client->userinfoID just connected as Client$client->resourceId with token {$queryParameters['token']}!\n";
            }
            else {
                echo "Client ({$client->resourceId}) encountered error.\n";
            }
        });
    }

    public function onMessage(ConnectionInterface $client, $msg) {

        echo "Client $client->resourceId said $msg\n";

        // Message handler for slash commands

        // /challenge <player_username>: create a new challenge record in db
        if(preg_match_all("/^\/challenge (.+)$/", $msg, $matches)) {
            $recipientUsername = $matches[1][0];
            if($client->userinfoUsername == $recipientUsername) {
                $client->send("[error] 1: You cannot challenge yourself!");
                return;
            }
            
            // Loop through players in the socket to see if username matches
            foreach ($this->clients as $player) {
                if ($player->userinfoUsername == $recipientUsername) {
                    // May need some constraint checks e.g. cannot challenge a player if they already have a challenge ongoing
                    
                    // Save the 

                    $player->send("[challenge] $client->userinfoUsername has challenged you to a match!\n");
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
            if($client->userinfoUsername == $recipientUsername) {
                $client->send("[error] 1: You cannot challenge yourself!");
                return;
            }
            
            // Loop through players in the socket to see if username matches
            foreach ($this->clients as $player) {
                if ($player->userinfoUsername == $recipientUsername) {
                    // May need some constraint checks e.g. cannot challenge a player if they already have a challenge ongoing

                    $player->send("[challenge] $client->userinfoUsername has challenged you to a match!\n");
                    echo "$client->userinfoUsername challenged user {$recipientUsername}!\n";
                    return;
                }
            }

            echo "Client $client->resourceId accepted challenge ID {$matches[1][0]}!\n";
        }

        // /reject <player_username>: reject the challenge
        if(preg_match_all("/^\/reject (.+)$/", $msg, $matches)) {
            // Do some database checks for existing challenge id, permissions, etc
            echo "Client $client->resourceId rejected challenge ID {$matches[1][0]}!\n";
        }

        // /message <player_username> <message>: sends a new message to player's username
        if(preg_match_all("/^\/message (.+) (.+)$/", $msg, $matches)) {
            $recipientUsername = $matches[1][0];
            $message = $matches[2][0];
            echo "Sending message to user $recipientUsername: $message\n";

            foreach ($this->clients as $player) {
                if ($player->userinfoUsername == $recipientUsername) {
                    $player->send("[message] $client->userinfoUsername: $message\n");
                }
            }            
        }

        // /world <message>: sends a new message to player
        if(preg_match_all("/^\/world (.+)$/", $msg, $matches)) {
            $message = $matches[1][0];
            echo "Client $client->resourceId messaged world: $message\n";

            foreach ($this->clients as $player) {

                // Don't send the message back to the person who sent it
                if ($client->resourceId == $player->resourceId) {
                    continue;
                }
    
                $player->send("[world] $client->userinfoUsername: $message\n");
            }
        }
    }

    public function onClose(ConnectionInterface $client) {
        echo "Client $client->resourceId left\n";

        // Change the token in db to disconnected
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
            $statement = yield $pool->prepare("update socket_connections set status='Disconnected' where resource_id=:id");
            
            /** @var \Amp\Mysql\ResultSet $result */
            if(yield $statement->execute(['id' => $client->resourceId])) {
                echo "Disconnected client ({$client->resourceId}).\n";
            }
            else {
                echo "Client ({$client->resourceId}) encountered error.\n";
            }
        });
    }

    public function onError(ConnectionInterface $client, \Exception $e) {
        echo "Client $client->resourceId received error $e\n";
    }
}
