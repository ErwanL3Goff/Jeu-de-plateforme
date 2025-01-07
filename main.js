// Sélection du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables globales
const cameraOffset = { x: 0 };
const keys = {}; // Suivi des touches appuyées
const player = {
    x: 100,
    y: 450,
    width: 50,
    height: 50,
    dx: 0,
    dy: 0,
    speed: 5,
    gravity: 0.8,
    jumpForce: -15,
    grounded: false,
    direction: 'right', // left or right
    state: 'static', // static, walking, jumping
    frameIndex: 0,
    frameDelay: 0,
};
const groundTiles = [];
const groundHeight = 32;

// Chargement des images
const loadedImages = {
    static_right: new Image(),
    static_left: new Image(),
    walk_right: [new Image(), new Image(), new Image()],
    walk_left: [new Image(), new Image(), new Image()],
    jump_right: new Image(),
    jump_left: new Image(),
    ground: new Image(),
};
loadedImages.static_right.src = 'assets/Player/Static_right.png';
loadedImages.static_left.src = 'assets/Player/Static_left.png';
loadedImages.walk_right[0].src = 'assets/Player/Walk1_right.png';
loadedImages.walk_right[1].src = 'assets/Player/Walk2_right.png';
loadedImages.walk_right[2].src = 'assets/Player/Walk3_right.png';
loadedImages.walk_left[0].src = 'assets/Player/Walk1_left.png';
loadedImages.walk_left[1].src = 'assets/Player/Walk2_left.png';
loadedImages.walk_left[2].src = 'assets/Player/Walk3_left.png';
loadedImages.jump_right.src = 'assets/Player/Jump_right.png';
loadedImages.jump_left.src = 'assets/Player/Jump_left.png';
loadedImages.ground.src = 'assets/Ground/Ground.png';

// Chargement des sons
const jumpSound = document.getElementById('jumpSound'); // Son du saut
const backgroundMusic = document.getElementById('backgroundMusic'); // Musique de fond

// Suivi des touches clavier
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Génération initiale des tuiles de sol
function generateInitialGround() {
    for (let i = 0; i < canvas.width / 64 + 2; i++) {
        groundTiles.push({ x: i * 64, y: canvas.height - groundHeight });
    }
}

// Génération de nouvelles tuiles si nécessaire
function generateGroundIfNeeded() {
    const rightmostTile = groundTiles[groundTiles.length - 1];
    if (rightmostTile && rightmostTile.x - cameraOffset.x < canvas.width) {
        groundTiles.push({
            x: rightmostTile.x + 64,
            y: canvas.height - groundHeight,
        });
    }
    while (groundTiles[0] && groundTiles[0].x - cameraOffset.x < -64) {
        groundTiles.shift();
    }
}

// Dessin du sol
function drawGround() {
    groundTiles.forEach((tile) => {
        ctx.drawImage(loadedImages.ground, tile.x - cameraOffset.x, tile.y, 64, groundHeight);
    });
}

// Mise à jour du joueur
function updatePlayer() {
    // Gravité
    if (!player.grounded) {
        player.dy += player.gravity;
    }

    // Déplacement horizontal
    if (keys['ArrowLeft']) {
        player.dx = -player.speed;
        player.direction = 'left';
        player.state = 'walking';
    } else if (keys['ArrowRight']) {
        player.dx = player.speed;
        player.direction = 'right';
        player.state = 'walking';
    } else {
        player.dx = 0;
        player.state = 'static';
    }

    // Saut
    if (keys['ArrowUp'] && player.grounded) {
        player.dy = player.jumpForce;
        player.grounded = false;
        player.state = 'jumping';
        jumpSound.play(); // Jouer le son du saut
    }

    // Mise à jour des positions
    player.x += player.dx;
    player.y += player.dy;

    // Collision avec le sol
    if (player.y + player.height >= canvas.height - groundHeight) {
        player.y = canvas.height - groundHeight - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    // Limiter aux bordures gauche (pour ne pas reculer hors du champ visible)
    if (player.x < 0) {
        player.x = 0;
    }

    // Mise à jour de la caméra
    cameraOffset.x = player.x - canvas.width / 2 + player.width / 2;
}

// Dessin du joueur
function drawPlayer() {
    let sprite;
    if (player.state === 'static') {
        sprite = player.direction === 'right' ? loadedImages.static_right : loadedImages.static_left;
    } else if (player.state === 'walking') {
        const frames = player.direction === 'right' ? loadedImages.walk_right : loadedImages.walk_left;
        sprite = frames[player.frameIndex];
        if (player.frameDelay === 0) {
            player.frameIndex = (player.frameIndex + 1) % frames.length;
            player.frameDelay = 10;
        } else {
            player.frameDelay--;
        }
    } else if (player.state === 'jumping') {
        sprite = player.direction === 'right' ? loadedImages.jump_right : loadedImages.jump_left;
    }

    if (sprite) {
        ctx.drawImage(sprite, player.x - cameraOffset.x, player.y, player.width, player.height);
    }
}

// Boucle du jeu
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generateGroundIfNeeded();
    drawGround();
    drawPlayer();
    updatePlayer();
    requestAnimationFrame(gameLoop);
}

// Initialisation du jeu
generateInitialGround();
gameLoop();
