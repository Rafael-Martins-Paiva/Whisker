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

        while (hit === 0) {
            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0;
            } else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1;
            }

            if (mapX < 0 || mapX >= gameMap.length || mapY < 0 || mapY >= gameMap[0].length) {
                hit = 1;
                continue;
            }

            if (gameMap[mapX][mapY] > 0) {
                hit = 1;
            }
        }

        if(side === 0) {
            perpWallDist = (mapX - player.x + (1 - stepX)/2) / rayDir.x;
        } else {
            perpWallDist = (mapY - player.y + (1 - stepY)/2) / rayDir.y;
        }

        const correctedDist = perpWallDist * Math.cos(player.angle - rayAngle);
        const height = (canvas.height / correctedDist) * config.wallHeight;
        const MAX_HEIGHT = canvas.height * 2;
        const clampedHeight = Math.min(height, MAX_HEIGHT);
        const finalYStart = Math.max(0, canvas.height/2 - clampedHeight/2);

        let wallX;
        if(side === 0) {
            wallX = player.y + perpWallDist * rayDir.y;
        } else {
            wallX = player.x + perpWallDist * rayDir.x;
        }
        wallX -= Math.floor(wallX);

        if ((side === 0 && rayDir.x > 0) || (side === 1 && rayDir.y < 0)) {
            wallX = 1 - wallX;
        }

        const texX = Math.floor(wallX * textures[gameMap[mapX][mapY]].width * 0.99);
        const tex = textures[gameMap[mapX][mapY]];

        if(tex.complete) {
            ctx.drawImage(
                tex,
                texX, 0, 1, tex.height,
                ray * (canvas.width/config.resolution), finalYStart,
                canvas.width/config.resolution + 1, clampedHeight
            );
        }

        ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(perpWallDist/12, 0.8)})`;
        ctx.fillRect(
            ray * (canvas.width/config.resolution), finalYStart,
            canvas.width/config.resolution, clampedHeight
        );
    }
}

function drawSprites() {
  const weaponWidth = canvas.width / 4;
  const weaponHeight = canvas.height / 2;
  ctx.drawImage(
    sprites.weapon,
    canvas.width / 2 - weaponWidth / 2,
    canvas.height - weaponHeight,
    weaponWidth,
    weaponHeight
  );
  
  bullets.forEach(bullet => {
    const bulletSize = 10;
    ctx.drawImage(
      sprites.bullet,
      bullet.x * (canvas.width / gameMap.length) - bulletSize / 2,
      bullet.y * (canvas.height / gameMap[0].length) - bulletSize / 2,
      bulletSize,
      bulletSize
    );
  });
  
  const enemySize = 50;
  ctx.drawImage(
    sprites.enemy,
    enemy.x * (canvas.width / gameMap.length) - enemySize / 2,
    enemy.y * (canvas.height / gameMap[0].length) - enemySize / 2,
    enemySize,
    enemySize
  );
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movePlayer();
  handleShooting();
  updateBullets();
  updateEnemy();
  castRays();
  drawSprites();
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
