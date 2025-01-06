const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Charger les sprites du personnage
    this.load.image('static_right', 'assets/Player/Static_right.png');
    this.load.image('static_left', 'assets/Player/Static_left.png');
    this.load.image('down_right', 'assets/Player/Down_right.png');
    this.load.image('down_left', 'assets/Player/Down_left.png');
    
    this.load.image('walk1_right', 'assets/Player/Walk1_right.png');
    this.load.image('walk2_right', 'assets/Player/Walk2_right.png');
    this.load.image('walk3_right', 'assets/Player/Walk3_right.png');
    this.load.image('walk1_left', 'assets/Player/Walk1_left.png');
    this.load.image('walk2_left', 'assets/Player/Walk2_left.png');
    this.load.image('walk3_left', 'assets/Player/Walk3_left.png');
    
    this.load.image('jump_right', 'assets/Player/Jump_right.png');
    this.load.image('jump_left', 'assets/Player/Jump_left.png');

    // Charger les images de sol
    this.load.image('ground', 'assets/Ground/Ground.png');
}

function create() {
    // Créer le personnage avec le sprite initial
    this.player = this.physics.add.sprite(100, 450, 'static_right');
    
    // Animer le personnage
    this.anims.create({
        key: 'walk_right',
        frames: [
            { key: 'walk1_right' },
            { key: 'walk2_right' },
            { key: 'walk3_right' }
        ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walk_left',
        frames: [
            { key: 'walk1_left' },
            { key: 'walk2_left' },
            { key: 'walk3_left' }
        ],
        frameRate: 10,
        repeat: -1
    });

    // Ajouter le sol
    this.ground = this.physics.add.staticGroup();
    for (let i = 0; i < 20; i++) {
        this.ground.create(i * 64, 550, 'ground');
    }
    
    // Faire sauter le personnage
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.ground);
}

function update() {
    // Déplacer à gauche
    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.LEFT)) {
        this.player.setVelocityX(-160); // Déplacer à gauche
        this.player.anims.play('walk_left', true);
    } else if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT)) {
        // Déplacer à droite
        this.player.setVelocityX(160);
        this.player.anims.play('walk_right', true);
    } else {
        this.player.setVelocityX(0); // Arrêter le mouvement
        // Réinitialiser l'animation en fonction de la direction
        if (this.player.flipX) {
            this.player.setTexture('static_left');
        } else {
            this.player.setTexture('static_right');
        }
    }

    // Sauter
    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.UP)) {
        if (this.player.body.touching.down) {
            this.player.setVelocityY(-330); // Sauter
            if (this.player.flipX) {
                this.player.setTexture('jump_left');
            } else {
                this.player.setTexture('jump_right');
            }
        }
    }

    // S'accroupir
    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.DOWN)) {
        if (this.player.flipX) {
            this.player.setTexture('down_left');
        } else {
            this.player.setTexture('down_right');
        }
    }
}
