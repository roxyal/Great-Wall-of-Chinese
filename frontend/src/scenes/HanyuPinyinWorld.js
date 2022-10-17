import {getLoggedInUsername} from "../../utility.js";
import {getLoggedInCharacter} from "../../utility.js";

var userName = await getLoggedInUsername();
var characterID = await getLoggedInCharacter();
// var userName = getLoggedInUsername();
// var characterID = getLoggedInCharacter();
console.log(userName);
console.log(characterID);

export class HanyuPinyinWorld extends Phaser.Scene {
    constructor() {
        super("hanyuPinyinWorld");
        this.userName = userName;
        this.characterID = characterID;
        console.log(this.userName);
        console.log(this.characterID);
    }

    preload() {
        // Load world assets
        this.load.image("darkForest", "assets/hanyuPinyinWorld/darkforest.png");
        this.load.image("box", "assets/hanyuPinyinWorld/box.png");
        this.load.spritesheet("shadyGuy", "assets/hanyuPinyinWorld/shady_guy.png", {frameWidth: 34, frameHeight: 34});
        this.load.spritesheet("torch", "assets/hanyuPinyinWorld/torch.png", {frameWidth: 64, frameHeight: 64});
        this.load.audio("hanyu_music", "assets/hanyuPinyinWorld/night_theme_2.wav");

        // Load common assets
        this.load.image("scroll", "assets/common/10b-parchmentborder.gif");
        this.load.image("speech", "assets/common/speechBubble.png");
        this.load.spritesheet("sign", "assets/common/wooden-sign.png", {frameWidth: 65, frameHeight: 64});

        // Load characters
        this.load.atlas("huntress", "assets/characters/huntress_spritesheet.png", "assets/characters/huntress.json");
        this.load.atlas("martialIdle", "assets/characters/martial-idle.png", "assets/characters/martial-idle.json");
        this.load.atlas("martialRun", "assets/characters/martial-run.png", "assets/characters/martial-run.json");
        this.load.atlas("wizard", "assets/characters/wizard_spritesheet.png", "assets/characters/wizard.json");
        this.load.atlas("heroKnight", "assets/characters/heroKnight_spritesheet.png", "assets/characters/heroKnight.json");
    }

    create() {
        const {width, height} = this.scale;
        this.add.image(0, 0, "darkForest").setOrigin(0).setDisplaySize(width, height).setAlpha(0.5);

        // Create animations for characters
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
            frames: this.anims.generateFrameNumbers("shadyGuy", {
                start: 0,
                end: 4
            }),
            repeat: -1
        });

        // Create animations for torches
        this.anims.create({
            key: "burn",
            frameRate: 8,
            frames: this.anims.generateFrameNumbers("torch", {
                start: 0,
                end: 5
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
        this.physics.world.setBounds(0, 150, width, height - 150);

        // Add wooden sign that has the name of the world
        this.sign = this.physics.add.sprite(width * 0.75, height * 0.25, "sign").setScale(2).setTint(0x301e01);
        this.sign.body.immovable = true;
        this.sign.body.setSize(this.sign.width, this.sign.height * 0.6, false);
        this.add.text(this.sign.x, this.sign.y * 0.9, "Current world: Hanyu Pinyin", {
            fill: "gray",
            align: "center", 
            fontSize: "14px",
            wordWrap: {width: `${this.sign.displayWidth}`, useAdvancedWrap: true},
        })
        .setOrigin(0.5);

        // Add torches
        this.torches = this.physics.add.staticGroup();
        this.torches.create(width * 0.45, height * 0.2, "torch");
        this.torches.create(width * 0.55, height * 0.2, "torch");
        this.torches.getChildren().forEach(torch => {
            torch.anims.play("burn", true);
        }, this);

        // Add box for NPC to stand on
        this.add.image(width * 0.5, height * 0.32, "box").setScale(2).setTint(0x3b2501);

        // Add player character based on characterID
        switch (this.characterID) {
            case 1:
                this.player = this.physics.add.sprite(200, 400, "martialIdle").setScale(2);
                this.idleKey = "martialIdle";
                this.runningKey = "martialRunning";
                break;
            case 2:
                this.player = this.physics.add.sprite(200, 200, "huntress").setScale(2.2);
                this.idleKey = "huntressIdle";
                this.runningKey = "huntressRunning";
                break;
            case 3:
                this.player = this.physics.add.sprite(200, 200, "heroKnight").setScale(1.7);
                this.idleKey = "heroKnightIdle";
                this.runningKey = "heroKnightRunning";
                break;
            case 4:
                this.player = this.physics.add.sprite(200, 200, "wizard").setScale(1.3);
                this.idleKey = "wizardIdle";
                this.runningKey = "wizardRunning";
                break;
            default:
                console.log("Something went wrong in player creation in create()");
        }
        this.player.body.syncBounds = true;
        this.player.setBounce(1);
        this.player.setCollideWorldBounds(true);

        // Add username below player character
        this.playerName = this.add.text(this.player.x, this.player.y + this.player.height, this.userName, {fill: "white", backgroundColor: "black", fontSize: "12px"}).setOrigin(0.5);

        // Add NPC
        this.npc = this.physics.add.sprite(width * 0.5, height * 0.22, "shadyGuy").setScale(3).setAlpha(0.7);
        this.npc.body.immovable = true;
        this.npc.flipX = true;
        this.npc.anims.play("npcIdle", true);

        // Add speech bubble for NPC
        this.speech = this.add.image(this.npc.x - this.npc.width / 2, this.npc.y - this.npc.displayHeight/2, "speech");
        this.speech.flipX = true;
        this.tweens.add({
            targets: this.speech,
            y: 70,
            duration: 1000,
            ease: "Linear",
            yoyo: true,
            repeat: -1,
        })

        // Add dialogue for NPC
        this.dialogue = this.add.text(this.speech.x, this.speech.y, "Hey kid, click me to enter adventure mode.", {fill: "white", fontSize: "11px"}).setOrigin(0.5);
        this.dialogue.setVisible(false);

        // Add colliders between characters and world objects
        this.physics.add.collider(this.sign, this.player);
        this.physics.add.collider(this.npc, this.player);

        // Create buttons
        const assignmentButton = this.add.image(width, 0, "scroll").setDisplaySize(100, 80).setOrigin(1, 0);
        this.add.text(assignmentButton.x - 50, assignmentButton.y + 40, "Assignments", {fill: "black", fontSize: "12px"}).setOrigin(0.5);

        // Play music
        this.sound.play("hanyu_music", {loop: true, volume: 0.3});
    }

    update() {
        // Play animations based on keyboard controls
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(150);
            this.player.flipX = false;
            this.player.anims.play(this.runningKey, true);
        } else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-150);
            this.player.flipX = true;
            this.player.anims.play(this.runningKey, true);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-150);
            this.player.anims.play(this.runningKey, true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(150);
            this.player.anims.play(this.runningKey, true);
        } else {
            this.player.setVelocity(0);
            this.player.anims.play(this.idleKey, true);
        }
        if (this.cursors.up.isUp && this.cursors.down.isUp) {
            this.player.setVelocityY(0);
        }
        if (this.cursors.left.isUp && this.cursors.right.isUp) {
            this.player.setVelocityX(0);
        }

        // Set text to follow character
        this.playerName.setPosition(this.player.x, this.player.y + this.player.height);

        // Display NPC dialogue only when character is close
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y) <= 150) {
            this.dialogue.setVisible(true);
            this.speech.setVisible(false);   
        } else {
            this.dialogue.setVisible(false);
            this.speech.setVisible(true);
        }
    }
}