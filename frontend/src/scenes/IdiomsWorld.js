import {getLoggedInUsername} from "../../utility.js";
import {getLoggedInCharacter} from "../../utility.js";

export class IdiomsWorld extends Phaser.Scene {
    constructor() {
        super("idiomsWorld");
    }
    
    preload() {
        // Load world assets
        this.load.image("field", "assets/idiomsWorld/field.jpg");
        this.load.spritesheet("stranger", "assets/idiomsWorld/stranger.png", {frameWidth: 32, frameHeight: 32});
        this.load.image("rock", "assets/idiomsWorld/rock.png");
        this.load.audio("idioms_music", "assets/idiomsWorld/field_theme_2.wav");

        // Load common assets
        this.load.spritesheet("sign", "assets/common/wooden-sign.png", {frameWidth: 65, frameHeight: 64});
        this.load.image("speech", "assets/common/speechBubble.png");
        this.load.image("scroll", "assets/common/10b-parchmentborder.gif");

        // Load characters
        this.load.atlas("huntress", "assets/characters/huntress_spritesheet.png", "assets/characters/huntress.json");
        this.load.atlas("martialIdle", "assets/characters/martial-idle.png", "assets/characters/martial-idle.json");
        this.load.atlas("martialRun", "assets/characters/martial-run.png", "assets/characters/martial-run.json");
        this.load.atlas("wizard", "assets/characters/wizard_spritesheet.png", "assets/characters/wizard.json");
        this.load.atlas("heroKnight", "assets/characters/heroKnight_spritesheet.png", "assets/characters/heroKnight.json");
    }

    create() {
        const {width, height} = this.scale;
        this.add.image(0, 0, "field").setOrigin(0, 0).setDisplaySize(width, height);

        // Create animations for player
        this.anims.create({
            key: "huntressIdle",
            frameRate: 8,
            frames: this.anims.generateFrameNames("huntress", {
                prefix: "huntress0",
                start: 1,
                end: 10,
                zeroPad: 2
            }),
            repeat: -1
        });
        this.anims.create({
            key: "huntressRunning",
            frameRate: 8,
            frames: this.anims.generateFrameNames("huntress", {
                prefix: "huntress0",
                start: 11,
                end: 18
            }),
            repeat: -1
        });
        this.anims.create({
            key: "wizardIdle",
            frameRate: 8,
            frames: this.anims.generateFrameNames("wizard", {
                prefix: "wizard00",
                start: 1,
                end: 6
            }),
            repeat: -1
        });
        this.anims.create({
            key: "wizardRunning",
            frameRate: 8,
            frames: this.anims.generateFrameNames("wizard", {
                prefix: "wizard0",
                start: 7,
                end: 14,
                zeroPad: 2
            }),
            repeat: -1
        });
        this.anims.create({
            key: "martialIdle",
            frameRate: 8,
            frames: this.anims.generateFrameNames("martialIdle", {
                prefix: "martial00",
                start: 1,
                end: 4,
            }),
            repeat: -1
        });
        this.anims.create({
            key: "martialRunning",
            frameRate: 8,
            frames: this.anims.generateFrameNames("martialRun", {
                prefix: "martial",
                start: 5,
                end: 12,
                zeroPad: 3
            }),
            repeat: -1
        });
        this.anims.create({
            key: "heroKnightIdle",
            frameRate: 8,
            frames: this.anims.generateFrameNames("heroKnight", {
                prefix: "heroKnight0",
                start: 1,
                end: 11,
                zeroPad: 2
            }),
            repeat: -1
        });
        this.anims.create({
            key: "heroKnightRunning",
            frameRate: 8,
            frames: this.anims.generateFrameNames("heroKnight", {
                prefix: "heroKnight0",
                start: 12,
                end: 19,
            }),
            repeat: -1
        });

        // Create animations for NPC
        this.anims.create({
            key: "npcIdle",
            frameRate: 8,
            frames: this.anims.generateFrameNumbers("stranger", {
                start: 0,
                end: 3
            }),
            repeat: -1
        });

        // Add keyboard support
        this.cursors = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D
        });

        // Increase collision detection
        this.physics.world.setFPS(120);

        // Limit world boundaries so characters cannot run too high up
        this.physics.world.setBounds(0, 80, width, height - 80);

        // Add wooden sign that has the name of the world
        this.sign = this.physics.add.sprite(width * 0.7, height * 0.2, "sign").setScale(2);
        this.sign.body.immovable = true;
        this.sign.body.setSize(this.sign.width, this.sign.height * 0.75, false);
        this.add.text(this.sign.x, this.sign.y * 0.9, "Current world: Idioms", {
            fill: "white",
            align: "center", 
            fontSize: "14px",
            wordWrap: {width: `${this.sign.displayWidth}`, useAdvancedWrap: true},
        })
        .setOrigin(0.5);

        // Add rock for NPC to stand on
        this.add.image(width * 0.5, height * 0.32, "rock").setScale(2);

        // Need to select idle based on character id
        // Add player character, set physics, and add text that follows character.
        this.martial = this.physics.add.sprite(200, 200, "wizardIdle").setScale(2);
        this.martial.body.syncBounds = true;
        this.martial.setBounce(1);
        this.martial.setCollideWorldBounds(true);


        const userName = getLoggedInUsername();
        const characterID = getLoggedInCharacter();
        console.log(userName);
        console.log(characterID);
        // set name according to player's username here
        this.martialText = this.add.text(this.martial.x, this.martial.y, userName, {fill: "white", backgroundColor: "black", fontSize: "12px"}).setOrigin(0.5);

        // Add NPC
        this.npc = this.physics.add.sprite(width * 0.5, height * 0.2, "stranger").setScale(4);
        this.npc.body.immovable = true;
        this.npc.body.syncBounds = true;
        this.npc.anims.play("npcIdle", true);

        // Add speech bubble for NPC
        this.speech = this.add.image(this.npc.x - this.npc.width, this.npc.y - this.npc.displayHeight/2, "speech");
        this.speech.flipX = true;
        this.tweens.add({
            targets: this.speech,
            y: 50,
            duration: 1000,
            ease: "Linear",
            yoyo: true,
            repeat: -1,
        })

        // Add dialogue for NPC
        this.dialogue = this.add.text(this.speech.x, this.speech.y, "Click me to enter adventure mode.", {fill: "yellow", backgroundColor: "black", fontSize: "11px"}).setOrigin(0.5);
        this.dialogue.setVisible(false);
        
        // Add colliders between player and world objects
        this.physics.add.collider(this.sign, this.martial);
        this.physics.add.collider(this.martial, this.npc);

        // Create buttons
        const assignmentButton = this.add.image(width, 0, "scroll").setDisplaySize(100, 80).setOrigin(1, 0);
        this.add.text(assignmentButton.x - 50, assignmentButton.y + 40, "Assignments", {fill: "black", fontSize: "12px"}).setOrigin(0.5);
        
        // Play music
        this.sound.play("idioms_music", {loop: true, volume: 0.3});
    }

    update() {
        if (this.cursors.right.isDown) {
            this.martial.setVelocityX(150);
            this.martial.flipX = false;
            this.martial.anims.play("martialRunning", true);
        } else if (this.cursors.left.isDown) {
            this.martial.setVelocityX(-150);
            this.martial.flipX = true;
            this.martial.anims.play("martialRunning", true);
        } else if (this.cursors.up.isDown) {
            this.martial.setVelocityY(-150);
            this.martial.anims.play("martialRunning", true);
        } else if (this.cursors.down.isDown) {
            this.martial.setVelocityY(150);
            this.martial.anims.play("martialRunning", true);
        } else {
            this.martial.setVelocity(0);
            this.martial.anims.play("martialIdle", true);
        }
        if (this.cursors.up.isUp && this.cursors.down.isUp) {
            this.martial.setVelocityY(0);
        }
        if (this.cursors.left.isUp && this.cursors.right.isUp) {
            this.martial.setVelocityX(0);
        }

        // Set text to follow character
        this.martialText.setPosition(this.martial.x, this.martial.y + this.martial.height);

        // Display NPC dialogue only when character is close
        if (Phaser.Math.Distance.Between(this.martial.x, this.martial.y, this.npc.x, this.npc.y) <= 150) {
            this.dialogue.setVisible(true);
            this.speech.setVisible(false);   
        } else {
            this.dialogue.setVisible(false);
            this.speech.setVisible(true);
        }
    }
}