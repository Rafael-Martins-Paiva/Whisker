const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Configurações melhoradas
const config = {
    resolution: 120,
    fov: Math.PI / 2.5,
    moveSpeed: 0.08,
    rotSpeed: 0.04,
    wallHeight: 1.0
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajusta tamanho para mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const screenWidth = isMobile ? window.innerWidth : 800;
const screenHeight = isMobile ? window.innerHeight : 600;

canvas.width = screenWidth;
canvas.height = screenHeight;

// Configurações otimizadas para mobile
const config = {
    resolution: isMobile ? 80 : 120,
    fov: Math.PI / 2.2,
    moveSpeed: 0.06,
    rotSpeed: 0.03,
    wallHeight: 1.0,
    touchSensitivity: 0.02
};

// Mapa e texturas (mesmo código anterior)
// ...

// Controles touch
let touchStartX = 0;
let touchStartY = 0;
let touchMoveX = 0;
let touchMoveY = 0;

const touchControls = {
    up: false,
    left: false,
    right: false
};

// Configura controles touch
function setupTouchControls() {
    const upBtn = document.getElementById('up');
    const leftBtn = document.getElementById('left');
    const rightBtn = document.getElementById('right');

    const handleTouchStart = (btn) => (e) => {
        e.preventDefault();
        touchControls[btn] = true;
    };

    const handleTouchEnd = (btn) => (e) => {
        e.preventDefault();
        touchControls[btn] = false;
    };

    upBtn.addEventListener('touchstart', handleTouchStart('up'));
    upBtn.addEventListener('touchend', handleTouchEnd('up'));
    upBtn.addEventListener('touchcancel', handleTouchEnd('up'));

    leftBtn.addEventListener('touchstart', handleTouchStart('left'));
    leftBtn.addEventListener('touchend', handleTouchEnd('left'));
    leftBtn.addEventListener('touchcancel', handleTouchEnd('left'));

    rightBtn.addEventListener('touchstart', handleTouchStart('right'));
    rightBtn.addEventListener('touchend', handleTouchEnd('right'));
    rightBtn.addEventListener('touchcancel', handleTouchEnd('right'));

    // Controle de movimento por gestos
    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    canvas.addEventListener('touchmove', (e) => {
        touchMoveX = e.touches[0].clientX - touchStartX;
        touchMoveY = e.touches[0].clientY - touchStartY;
        e.preventDefault();
    });

    canvas.addEventListener('touchend', () => {
        touchMoveX = 0;
        touchMoveY = 0;
    });
}

// Movimentação adaptada para mobile
function movePlayer() {
    // Movimento para frente/trás
    if(touchControls.up || touchMoveY < -30) {
        const newX = player.x + Math.cos(player.angle) * config.moveSpeed;
        const newY = player.y + Math.sin(player.angle) * config.moveSpeed;
        
        if(gameMap[Math.floor(newX)][Math.floor(player.y)] === 0) player.x = newX;
        if(gameMap[Math.floor(player.x)][Math.floor(newY)] === 0) player.y = newY;
    }

    // Rotação
    if(touchControls.left || touchMoveX < -30) {
        player.angle -= config.rotSpeed;
    }
    if(touchControls.right || touchMoveX > 30) {
        player.angle += config.rotSpeed;
    }
}

// Otimizações para mobile
function optimizeForMobile() {
    // Reduz qualidade gráfica
    config.resolution = Math.min(config.resolution, 100);
    config.fov = Math.PI / 2.5;
    
    // Ajusta tamanho do canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Previne comportamento padrão do touch
    document.body.addEventListener('touchstart', (e) => {
        if(e.target === canvas) e.preventDefault();
    }, { passive: false });
    
    document.body.addEventListener('touchmove', (e) => {
        if(e.target === canvas) e.preventDefault();
    }, { passive: false });
}


function init() {
    if(isMobile) {
        optimizeForMobile();
        setupTouchControls();
    }
    
    // Carrega texturas e inicia o jogo
    Promise.all(Object.values(textures).map(img => {
        if(!img.complete) return new Promise(resolve => {
            img.onload = resolve;
        });
    }).then(gameLoop);
}

// Mapa mais complexo
const gameMap = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 3, 1],
    [1, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];

// Jogador
const player = {
    x: 2.5,
    y: 2.5,
    angle: 0
};

// Sistema de texturas
const textures = {
    1: loadTexture('wall1.jpg'),
    2: loadTexture('wall2.jpg'),
    3: loadTexture('wall3.jpg')
};

function loadTexture(filename) {
    const img = new Image();
    img.src = `static/textures/${filename}`;
    return img;
}

// Controles
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Função de raycasting corrigida
function castRays() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2); // Chão
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height/2); // Céu

    const startAngle = player.angle - config.fov / 2;
    const angleStep = config.fov / config.resolution;

    for(let ray = 0; ray < config.resolution; ray++) {
        const rayAngle = startAngle + ray * angleStep;
        const rayDir = {
            x: Math.cos(rayAngle),
            y: Math.sin(rayAngle)
        };

        let mapX = Math.floor(player.x);
        let mapY = Math.floor(player.y);
        
        let sideDistX, sideDistY;
        let deltaDistX = Math.abs(1 / rayDir.x);
        let deltaDistY = Math.abs(1 / rayDir.y);
        let stepX, stepY;
        let hit = 0;
        let side;

        // Calcula passos iniciais
        if(rayDir.x < 0) {
            stepX = -1;
            sideDistX = (player.x - mapX) * deltaDistX;
        } else {
            stepX = 1;
            sideDistX = (mapX + 1 - player.x) * deltaDistX;
        }
        
        if(rayDir.y < 0) {
            stepY = -1;
            sideDistY = (player.y - mapY) * deltaDistY;
        } else {
            stepY = 1;
            sideDistY = (mapY + 1 - player.y) * deltaDistY;
        }

        // DDA 
        while(hit === 0) {
            if(sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0;
            } else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1;
            }
            
            if(gameMap[mapX][mapY] > 0) hit = 1;
        }

        // Calcula distância
        let dist = side === 0 
            ? (mapX - player.x + (1 - stepX)/2) / rayDir.x
            : (mapY - player.y + (1 - stepY)/2) / rayDir.y;

        // Altura da parede
        const height = (canvas.height / dist) * config.wallHeight;
        const yStart = Math.max(0, canvas.height/2 - height/2);
        const yEnd = Math.min(canvas.height, canvas.height/2 + height/2);

        // Coordenadas da textura
        const wallX = side === 0 
            ? player.y + dist * rayDir.y 
            : player.x + dist * rayDir.x;
        const texX = Math.floor((wallX - Math.floor(wallX)) * textures[gameMap[mapX][mapY]].width);

        // Desenha a parede
        if(textures[gameMap[mapX][mapY]].complete) {
            ctx.drawImage(
                textures[gameMap[mapX][mapY]],
                texX, 0, 1, textures[gameMap[mapX][mapY]].height,
                ray * (canvas.width/config.resolution), yStart,
                canvas.width/config.resolution + 1, height
            );
        }

        // Efeito de sombra
        ctx.fillStyle = `rgba(0, 0, 0, ${dist/12})`;
        ctx.fillRect(
            ray * (canvas.width/config.resolution), yStart,
            canvas.width/config.resolution, height
        );
    }
}

// Movimentação com colisão
function movePlayer() {
    const moveStep = keys['w'] ? config.moveSpeed : keys['s'] ? -config.moveSpeed : 0;
    const newX = player.x + Math.cos(player.angle) * moveStep;
    const newY = player.y + Math.sin(player.angle) * moveStep;

    if(gameMap[Math.floor(newX)][Math.floor(player.y)] === 0) player.x = newX;
    if(gameMap[Math.floor(player.x)][Math.floor(newY)] === 0) player.y = newY;

    player.angle += (keys['d'] ? config.rotSpeed : 0) + (keys['a'] ? -config.rotSpeed : 0);
}

// Loop principal
function gameLoop() {
    movePlayer();
    castRays();
    requestAnimationFrame(gameLoop);
}

// Inicia quando as texturas carregarem
Promise.all(Object.values(textures).map(img => {
    if(!img.complete) return new Promise(resolve => {
        img.onload = resolve;
    });
})).then(gameLoop);


init();
