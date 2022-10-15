export class BlanksWorld extends Phaser.Scene {
    constructor() {
        super("blanksWorld");
    }

    // call backend functions here to get username and character id

    preload() {
        // Load world assets
        this.load.image("greatWall", "assets/blanksWorld/great-wall.jpg");
        this.load.image("chest", "assets/blanksWorld/chest.png");
        this.load.image("barrel", "assets/blanksWorld/barrel.png");
        this.load.spritesheet("merchant", "assets/blanksWorld/merchant.png", {frameWidth: 32, frameHeight: 32});
        this.load.audio("blanks_music", "assets/blanksWorld/prairie.wav");
        this.load.audio("hello", "assets/blanksWorld/hello.wav");

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
        this.add.image(0, 0, "greatWall").setOrigin(0).setDisplaySize(width, height);
        
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
            frames: this.anims.generateFrameNumbers("merchant", {
                start: 0,
                end: 4
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
        this.physics.world.setBounds(0, 160, width, height - 210);

        // Add wooden sign that has the name of the world
        this.sign = this.physics.add.sprite(width * 0.75, height * 0.33, "sign").setScale(2);
        this.sign.body.immovable = true;
        this.sign.body.setSize(this.sign.width, this.sign.height * 0.6, false);
        this.add.text(this.sign.x, this.sign.y * 0.9, "Current world: Fill in the blanks", {
            fill: "white",
            align: "center", 
            fontSize: "14px",
            wordWrap: {width: `${this.sign.displayWidth}`, useAdvancedWrap: true},
        })
        .setOrigin(0.5);

        // Add barrel for NPC to stand on
        this.add.image(width * 0.5, height * 0.4, "barrel").setScale(2);

        // Add chest
        this.add.image(width * 0.4, height * 0.4, "chest").setScale(2);
        
        // Add character, set physics, and add text to character
        this.heroKnight = this.physics.add.sprite(500, 300, "heroKnight").setScale(1.7);
        this.heroKnight.setBounce(1);
        this.heroKnight.setCollideWorldBounds(true);
        this.heroKnightText = this.add.text(this.heroKnight.x, this.heroKnight.y + this.heroKnight.height, "sharon2403", {fill: "white", backgroundColor: "black", fontSize: "12px"}).setOrigin(0.5);
        this.heroKnight.anims.play("heroKnightIdle", true); 
        
        // Add NPC
        this.npc = this.physics.add.sprite(width * 0.5, height * 0.29, "merchant").setScale(3);
        this.npc.body.immovable = true;
        this.npc.anims.play("npcIdle", true);

        this.npc.setInteractive();
        this.npc.on("pointerdown", () => this.sound.play("hello"));

        // Add speech bubble for NPC
        this.speech = this.add.image(this.npc.x - this.npc.width / 2, this.npc.y - this.npc.displayHeight/2, "speech");
        this.speech.flipX = true;
        this.tweens.add({
            targets: this.speech,
            y: 115,
            duration: 1000,
            ease: "Linear",
            yoyo: true,
            repeat: -1,
        })

        // Add dialogue for NPC
        this.dialogue = this.add.text(this.speech.x, this.speech.y, "Hey, there! Fancy some practice? Just click on me!", {fill: "white", fontSize: "11px"}).setOrigin(0.5);
        this.dialogue.setVisible(false);

        // Add colliders between characters and world objects
        this.physics.add.collider(this.sign, this.heroKnight);
        this.physics.add.collider(this.npc, this.heroKnight);
    
        // Create buttons
        const assignmentButton = this.add.image(width, 0, "scroll").setDisplaySize(100, 80).setOrigin(1, 0);
        this.add.text(assignmentButton.x - 50, assignmentButton.y + 40, "Assignments", {fill: "black", fontSize: "12px"}).setOrigin(0.5);

        // Play music
        this.sound.play("blanks_music", {loop: true, volume: 0.3});
    }

    update() {
        // Play animations based on keyboard controls
        if (this.cursors.right.isDown) {
            this.heroKnight.setVelocityX(150);
            this.heroKnight.flipX = false;
            this.heroKnight.anims.play("heroKnightRunning", true);
        } else if (this.cursors.left.isDown) {
            this.heroKnight.setVelocityX(-150);
            this.heroKnight.flipX = true;
            this.heroKnight.anims.play("heroKnightRunning", true);
        } else if (this.cursors.up.isDown) {
            this.heroKnight.setVelocityY(-150);
            this.heroKnight.anims.play("heroKnightRunning", true);
        } else if (this.cursors.down.isDown) {
            this.heroKnight.setVelocityY(150);
            this.heroKnight.anims.play("heroKnightRunning", true);
        } else {
            this.heroKnight.setVelocity(0);
            this.heroKnight.anims.play("heroKnightIdle", true);
        }
        if (this.cursors.up.isUp && this.cursors.down.isUp) {
            this.heroKnight.setVelocityY(0);
        }
        if (this.cursors.left.isUp && this.cursors.right.isUp) {
            this.heroKnight.setVelocityX(0);
        }

        // Set text to follow character
        this.heroKnightText.setPosition(this.heroKnight.x, this.heroKnight.y + this.heroKnight.height);

        // Display NPC dialogue only when character is close
        if (Phaser.Math.Distance.Between(this.heroKnight.x, this.heroKnight.y, this.npc.x, this.npc.y) <= 150) {
            this.dialogue.setVisible(true);
            this.speech.setVisible(false);   
        } else {
            this.dialogue.setVisible(false);
            this.speech.setVisible(true);
        }
    }
}