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
                echo "New connection ({$client->resourceId}) with token {$queryParameters['token']}!\n";
            }
            else {
                echo "Client ({$client->resourceId}) encountered error.\n";
            }
        });
    }

    public function onMessage(ConnectionInterface $client, $msg) {

        echo "Client $client->resourceId said $msg\n";

        // Message handler for slash commands
        // /challenge <player_id>: create a new challenge record in db
        if(preg_match_all("/^\/challenge ([0-9]+)$/", $msg, $matches)) {
            // Do some database checks for existing account id
            echo "Client $client->resourceId challenged account ID {$matches[1][0]}!\n";
        }

        // /accept <challenge_id>: start the pvp match
        if(preg_match_all("/^\/accept ([0-9]+)$/", $msg, $matches)) {
            // Do some database checks for existing challenge id, permissions, etc
            echo "Client $client->resourceId accepted challenge ID {$matches[1][0]}!\n";
        }

        // /reject <challenge_id>: reject the challenge
        if(preg_match_all("/^\/reject ([0-9]+)$/", $msg, $matches)) {
            // Do some database checks for existing challenge id, permissions, etc
            echo "Client $client->resourceId rejected challenge ID {$matches[1][0]}!\n";
        }

        // /message <player_id> <message>: sends a new message to player
        if(preg_match_all("/^\/message ([0-9]+) (.+)$/", $msg, $matches)) {
            // Do some database checks for existing id, permissions, etc
            echo "Client $client->resourceId messaged account ID {$matches[1][0]}: {$matches[2][0]}\n";

            // Get the recipient's resource ID
            \Amp\Loop::run(function() {        
                require "../../../secrets.php";
                $config = \Amp\Mysql\ConnectionConfig::fromString(
                    "host=127.0.0.1 user=$username password=$password db=$db"
                );
                
                /** @var \Amp\Mysql\Pool $pool */
                $pool = \Amp\Mysql\pool($config);
                
                /** @var \Amp\Mysql\Statement $statement */
                $statement = yield $pool->prepare("select account_id from socket_connections where resource_id=:id");
                
                /** @var \Amp\Mysql\ResultSet $result */
                if(yield $statement->execute(['id' => $matches[1][0]])) {
                    
                }
                else {
                    echo "Client ({$client->resourceId}) encountered error.\n";
                }
            });

            foreach ($this->clients as $player) {

                if ($client->resourceId == $player->resourceId) {
                    continue;
                }
    
                $player->send("[world] Client$client->resourceId: $msg\n");
            }
        }

        // /world <message>: sends a new message to player
        if(preg_match_all("/^\/world (.+)$/", $msg, $matches)) {
            // Do some database checks for existing id, permissions, etc
            echo "Client $client->resourceId messaged world: {$matches[1][0]}\n";

            foreach ($this->clients as $player) {

                // Don't send the message back to the person who sent it
                if ($client->resourceId == $player->resourceId) {
                    continue;
                }
    
                $player->send("[world] Client{$client->resourceId}: $msg\n");
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
