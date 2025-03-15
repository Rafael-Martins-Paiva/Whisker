const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const config = {
    resolution: isMobile ? 80 : 120,
    fov: Math.PI / (isMobile ? 2.2 : 2.5),
    moveSpeed: isMobile ? 0.06 : 0.08,
    rotSpeed: isMobile ? 0.03 : 0.04,
    wallHeight: 1.0,
    touchSensitivity: 0.02,
    backwardSpeedMultiplier: 0.7
};

canvas.width = isMobile ? window.innerWidth : 800;
canvas.height = isMobile ? window.innerHeight : 600;

const gameMap = [
    [1,1,1,1,1,1,1,1],
    [1,0,0,2,0,0,0,1],
    [1,0,1,1,0,0,0,1],
    [1,0,0,0,0,0,3,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1]
];

const player = {
    x: 1.5,
    y: 1.5,
    angle: 0
};

const textures = {
    1: new Image(),
    2: new Image(),
    3: new Image()
};

textures[1].src = '/static/textures/wall1.jpg';
textures[2].src = '/static/textures/wall2.jpg';
textures[3].src = '/static/textures/wall3.jpg';

const keys = {};
let touchControls = {
    up: false,
    left: false,
    down: false,
    right: false
};

let touchStartX = 0, touchStartY = 0, touchMoveX = 0, touchMoveY = 0;

function setupControls() {
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);

    if(isMobile) {
        const controlButtons = {
            up: document.getElementById('up'),
            left: document.getElementById('left'),
	    down: document.getElementById('down'),
            right: document.getElementById('right')
        };

        const handleTouch = (control, state) => (e) => {
            e.preventDefault();
            touchControls[control] = state;
            controlButtons[control].style.backgroundColor = state ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)';
        };

        controlButtons.up.addEventListener('touchstart', handleTouch('up', true));
        controlButtons.up.addEventListener('touchend', handleTouch('up', false));
        controlButtons.up.addEventListener('touchcancel', handleTouch('up', false));

        controlButtons.left.addEventListener('touchstart', handleTouch('left', true));
        controlButtons.left.addEventListener('touchend', handleTouch('left', false));
        controlButtons.left.addEventListener('touchcancel', handleTouch('left', false));


	    controlButtons.down.addEventListener('touchstart', handleTouch('down', true));
            controlButtons.down.addEventListener('touchend', handleTouch('down', false));
            controlButtons.down.addEventListener('touchcancel', handleTouch('down', false));

	controlButtons.right.addEventListener('touchstart', handleTouch('right', true));                                                    controlButtons.right.addEventListener('touchend', handleTouch('right', false));
        controlButtons.right.addEventListener('touchcancel', handleTouch('right', false));

        canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        canvas.addEventListener('touchmove', (e) => {
            if(e.touches.length === 1) {
                touchMoveX = e.touches[0].clientX - touchStartX;
                touchMoveY = e.touches[0].clientY - touchStartY;
            }
            e.preventDefault();
        }, { passive: false });

        canvas.addEventListener('touchend', () => {
            touchMoveX = 0;
            touchMoveY = 0;
        });
    }
}

if(isMobile) {
    if(touchControls.up) {
        const newX = player.x + Math.cos(player.angle) * config.moveSpeed;
        const newY = player.y + Math.sin(player.angle) * config.moveSpeed;
        if(gameMap[Math.floor(newX)][Math.floor(newY)] === 0) {
            player.x = newX;
            player.y = newY;
        }
    }
    
    if(touchMoveY < -40) {
        const newX = player.x + Math.cos(player.angle) * config.moveSpeed * 1.5;
        const newY = player.y + Math.sin(player.angle) * config.moveSpeed * 1.5;
        if(gameMap[Math.floor(newX)][Math.floor(newY)] === 0) {
            player.x = newX;
            player.y = newY;
        }
    }

    if(touchControls.left || touchMoveX < -40) {
        player.angle -= config.rotSpeed;
    }
    if(touchControls.right || touchMoveX > 40) {
        player.angle += config.rotSpeed;
    }
}	

function moveBackward() {
    const newX = player.x - Math.cos(player.angle) * config.moveSpeed * config.backwardSpeedMultiplier;
    const newY = player.y - Math.sin(player.angle) * config.moveSpeed * config.backwardSpeedMultiplier;
    return [newX, newY];
}

function movePlayer() {
    if(keys['w']) {
        const newX = player.x + Math.cos(player.angle) * config.moveSpeed;
        const newY = player.y + Math.sin(player.angle) * config.moveSpeed;
        if(newX >= 0 && newX < gameMap.length &&
           newY >= 0 && newY < gameMap[0].length &&                                                gameMap[Math.floor(newX)][Math.floor(newY)] === 0) {                                     player.x = newX;                            player.y = newY;                        }                                       }
    
    if(keys['s']) {                                 const [newX, newY] = moveBackward();        if(newX >= 0 && newX < gameMap.length &&
           newY >= 0 && newY < gameMap[0].length &&                                                gameMap[Math.floor(newX)][Math.floor(newY)] === 0) {                                     player.x = newX;                            player.y = newY;                        }                                       }                                       

    if(keys['a']) player.angle -= config.rotSpeed;
    if(keys['d']) player.angle += config.rotSpeed;

    if(isMobile) {
        if(touchControls.up || touchMoveY < -20) {
            const newX = player.x + Math.cos(player.angle) * config.moveSpeed;
            const newY = player.y + Math.sin(player.angle) * config.moveSpeed;
            if(gameMap[Math.floor(newX)][Math.floor(newY)] === 0) {
                player.x = newX;
                player.y = newY;
            }
        }



	if(touchMoveY > 20) {                           const [newX, newY] = moveBackward();
	    if(newX >= 0 && newX < gameMap.length &&
           newY >= 0 && newY < gameMap[0].length &&                                                gameMap[Math.floor(newX)][Math.floor(newY)] === 0) {                                     player.x = newX;                            player.y = newY;                        }                                       }                                      

        if(touchControls.left || touchMoveX < -30) {
            player.angle -= config.rotSpeed;
        }
        if(touchControls.right || touchMoveX > 30) {
            player.angle += config.rotSpeed;
        }
    }
}
        

// Substitua a função castRays por esta versão corrigida
function castRays() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height/2);

    const startAngle = player.angle - config.fov/2;
    const angleStep = config.fov/config.resolution;

    for(let ray = 0; ray < config.resolution; ray++) {
        const rayAngle = startAngle + ray * angleStep;
        const rayDir = {
            x: Math.cos(rayAngle),
            y: Math.sin(rayAngle)
        };

        let mapX = Math.floor(player.x);
        let mapY = Math.floor(player.y);

        let sideDistX, sideDistY;
        const deltaDistX = Math.abs(1 / rayDir.x);
        const deltaDistY = Math.abs(1 / rayDir.y);
        let perpWallDist;
        let stepX, stepY;
        let hit = 0;
        let side;

        // Cálculo inicial das distâncias laterais
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

            // Verifica limites do mapa
            if(mapX < 0 || mapX >= gameMap.length || mapY < 0 || mapY >= gameMap[0].length) {
                hit = 1; // Considera como parede se ultrapassar os limites do mapa
                continue;
            }

            if(gameMap[mapX][mapY] > 0) hit = 1;
        }

        // Cálculo da distância perpendicular CORRETA
        if(side === 0) {
            perpWallDist = (mapX - player.x + (1 - stepX) / 2) / rayDir.x;
        } else {
            perpWallDist = (mapY - player.y + (1 - stepY) / 2) / rayDir.y;
        }

        // Aplica correção de distorção (fish-eye)
        const correctedDist = perpWallDist;

        const height = (canvas.height / correctedDist) * config.wallHeight;
        const yStart = Math.max(0, canvas.height/2 - height/2);
        const yEnd = Math.min(canvas.height, canvas.height/2 + height/2);

        // Cálculo da coordenada de textura
        let wallX;
        if(side === 0) {
            wallX = player.y + perpWallDist * rayDir.y;
        } else {
            wallX = player.x + perpWallDist * rayDir.x;
        }
        wallX -= Math.floor(wallX);

        const texX = Math.floor(wallX * textures[gameMap[mapX][mapY]].width);
        if(texX < 0) texX = 0;
        if(texX > textures[gameMap[mapX][mapY]].width) texX = textures[gameMap[mapX][mapY]].width - 1;

        // Renderização
        if(textures[gameMap[mapX][mapY]].complete) {
            ctx.drawImage(
                textures[gameMap[mapX][mapY]],
                texX, 0, 1, textures[gameMap[mapX][mapY]].height,
                ray * (canvas.width/config.resolution), yStart,
                canvas.width/config.resolution + 1, height
            );
        }

        // Sombra baseada na distância
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(perpWallDist/12, 0.8)})`;
        ctx.fillRect(
            ray * (canvas.width/config.resolution), yStart,
            canvas.width/config.resolution, height
        );
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    castRays();
    requestAnimationFrame(gameLoop);
}

function init() {
    setupControls();

    if(isMobile) {
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        document.body.addEventListener('touchstart', (e) => {
            if(e.target === canvas) e.preventDefault();
        }, { passive: false });

        document.body.addEventListener('touchmove', (e) => {
            if(e.target === canvas) e.preventDefault();
        }, { passive: false });
    }

    Promise.all(Object.values(textures).map(img => {
        return img.complete ? Promise.resolve() : new Promise(resolve => {
            img.onload = resolve;
        });
    })).then(() => {
        gameLoop();
    });
}

init();
