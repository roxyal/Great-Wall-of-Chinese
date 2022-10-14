export class IdiomsWorld extends Phaser.Scene {
    constructor() {
        super("idiomsWorld");
    }

    preload() {
        this.load.image("field", "./assets/field.jpg");
        this.load.image("brownButton", "./assets/buttonLong_brown.png");
        this.load.image("scroll", "./assets/10b-parchmentborder.gif");
        this.load.atlas("martialIdle", "./assets/martial-idle.png", "./assets/martial-idle.json");
        this.load.atlas("martialRun", "./assets/martial-run.png", "./assets/martial-run.json");
        this.load.spritesheet("captain", "./assets/captain.png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("stranger", "assets/stranger.png", {frameWidth: 32, frameHeight: 32});
        this.load.image("rock", "assets/rock.png");
        this.load.spritesheet("sign", "assets/wooden-sign.png", {frameWidth: 65, frameHeight: 64});
        this.load.image("speech", "assets/speechBubble.png");
        this.load.audio("idioms_music", "./assets/field_theme_2.wav");
    }

    create() {
        const {width, height} = this.scale;
        this.add.image(0, 0, "field").setOrigin(0, 0).setDisplaySize(width, height);

        // Create animations for player
        this.anims.create({
            key: "idle",
            frameRate: 8,
            frames: this.anims.generateFrameNames("martialIdle", {
                prefix: "martial00",
                start: 1,
                end: 4,
            }),
            repeat: -1
        })
        this.anims.create({
            key: "running",
            frameRate: 8,
            frames: this.anims.generateFrameNames("martialRun", {
                prefix: "martial",
                start: 5,
                end: 12,
                zeroPad: 3
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

        // Add player character, set physics, and add text that follows character.
        this.martialHero = this.physics.add.sprite(200, 200, "martialHero").setScale(2);
        this.martialHero.body.syncBounds = true;
        this.martialHero.setBounce(1);
        this.martialHero.setCollideWorldBounds(true);
        this.followText = this.add.text(this.martialHero.x, this.martialHero.y, "michael0123", {fill: "white", backgroundColor: "black", fontSize: "12px"}).setOrigin(0.5);

        // Add NPC
        this.npc = this.physics.add.sprite(width * 0.5, height * 0.2, "stranger").setScale(4);
        this.npc.body.immovable = true;
        this.npc.body.syncBounds = true;

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
        
        // Add colliders between player and world objects
        this.physics.add.collider(this.sign, this.martialHero);
        this.physics.add.collider(this.martialHero, this.npc);

        // Create buttons
        const logOutButton = this.add.image(75, 25, "brownButton").setDisplaySize(150, 50);
        this.add.text(logOutButton.x, logOutButton.y, "Log Out", {fill: "white"}).setOrigin(0.5);

        const backButton = this.add.image(logOutButton.x, logOutButton.y * 3, "brownButton").setDisplaySize(150, 50);
        this.add.text(backButton.x, backButton.y, "Back", {fill: "white"}).setOrigin(0.5);

        const assignmentButton = this.add.image(width, 0, "scroll").setDisplaySize(100, 80).setOrigin(1, 0);
        this.add.text(assignmentButton.x - 50, assignmentButton.y + 40, "Assignments", {fill: "black", fontSize: "12px"}).setOrigin(0.5);
        
        // Play music
        this.sound.play("idioms_music", {loop: true, volume: 0.3});
    }

    update() {
        if (this.cursors.right.isDown) {
            this.martialHero.setVelocityX(150);
            this.martialHero.flipX = false;
            this.martialHero.anims.play("running", true);
        } else if (this.cursors.left.isDown) {
            this.martialHero.setVelocityX(-150);
            this.martialHero.flipX = true;
            this.martialHero.anims.play("running", true);
        } else if (this.cursors.up.isDown) {
            this.martialHero.setVelocityY(-150);
            this.martialHero.anims.play("running", true);
        } else if (this.cursors.down.isDown) {
            this.martialHero.setVelocityY(150);
            this.martialHero.anims.play("running", true);
        } else {
            this.martialHero.setVelocity(0);
            this.martialHero.anims.play("idle", true);
        }
        if (this.cursors.up.isUp && this.cursors.down.isUp) {
            this.martialHero.setVelocityY(0);
        }
        if (this.cursors.left.isUp && this.cursors.right.isUp) {
            this.martialHero.setVelocityX(0);
        }

        this.followText.setPosition(this.martialHero.x, this.martialHero.y + this.martialHero.height);

        this.npc.anims.play("npcIdle", true);
    }
}