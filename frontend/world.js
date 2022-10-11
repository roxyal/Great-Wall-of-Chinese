// set configuration of the game
let config = {
	type: Phaser.AUTO, // use webgl if available, if not use canvas
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }, // gravity 0
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var player;

// create a new game, pass the configuration
let game = new Phaser.Game(config);

function preload ()
{
	this.load.image('map', 'images/sky.png');
	this.load.spritesheet('dude', 'images/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
	this.add.image(0,0, 'map').setOrigin(0,0);

	// The player and its settings
    player = this.physics.add.sprite(400, 600, 'dude');

	//player.setBounce(0);
    player.setCollideWorldBounds(true);

	// Animations for turning left and right, and turning back when no movement
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input keyboard Events
    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
	if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
	else if (cursors.down.isDown)
    {
        player.setVelocityY(160);
    }
	else if (cursors.up.isDown)
    {
        player.setVelocityY(-160);
    }
    else
    {
        player.setVelocityX(0);
		player.setVelocityY(0);

        player.anims.play('turn');
    }

}