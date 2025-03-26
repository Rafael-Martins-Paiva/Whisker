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

        controlButtons.right.addEventListener('touchstart', handleTouch('right', true));
        controlButtons.right.addEventListener('touchend', handleTouch('right', false));
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

function moveBackward() {
    const newX = player.x - Math.cos(player.angle) * config.moveSpeed * config.backwardSpeedMultiplier;
    const newY = player.y - Math.sin(player.angle) * config.moveSpeed * config.backwardSpeedMultiplier;
    return [newX, newY];
}

function movePlayer() {
    if(keys['w', 'ArrowUp']) {
        const newX = player.x + Math.cos(player.angle) * config.moveSpeed;
        const newY = player.y + Math.sin(player.angle) * config.moveSpeed;
        if(newX >= 0 && newX < gameMap.length &&
           newY >= 0 && newY < gameMap[0].length &&
           gameMap[Math.floor(newX)][Math.floor(newY)] === 0) {
            player.x = newX;
            player.y = newY;
        }
    }

    if(keys['s', 'ArrowDown']) {
        const [newX, newY] = moveBackward();
        if(newX >= 0 && newX < gameMap.length &&
           newY >= 0 && newY < gameMap[0].length &&
           gameMap[Math.floor(newX)][Math.floor(newY)] === 0) {
            player.x = newX;
            player.y = newY;
        }
    }

    if(keys['a', 'ArrowLeft']) player.angle -= config.rotSpeed;
    if(keys['d', 'ArrowRight']) player.angle += config.rotSpeed;

    if(isMobile) {
        if(touchControls.up || touchMoveY < -20) {
            const newX = player.x + Math.cos(player.angle) * config.moveSpeed;
            const newY = player.y + Math.sin(player.angle) * config.moveSpeed;
            if(gameMap[Math.floor(newX)][Math.floor(newY)] === 0) {
                player.x = newX;
                player.y = newY;
            }
        }

        if(touchMoveY > 20) {
            const [newX, newY] = moveBackward();
            if(newX >= 0 && newX < gameMap.length &&
            newY >= 0 && newY < gameMap[0].length && 
            gameMap[Math.floor(newX)][Math.floor(newY)] === 0) {
                player.x = newX;
                player.y = newY;
            }
        }

        if(touchControls.left || touchMoveX < -30) {
            player.angle -= config.rotSpeed;
        }
        if(touchControls.right || touchMoveX > 30) {
            player.angle += config.rotSpeed;
        }
    }
}

const bullets = [];
const bulletSpeed = 0.2;

function shoot() {
  bullets.push({
    x: player.x,
    y: player.y,
    angle: player.angle,
    distance: 0 
  });
}

function handleShooting() {
  if (keys[' ']) {
    shoot();
    keys[' '] = false;
  }
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.x += Math.cos(bullet.angle) * bulletSpeed;
    bullet.y += Math.sin(bullet.angle) * bulletSpeed;
    bullet.distance += bulletSpeed;
    
    if (bullet.distance > 10) {
      bullets.splice(i, 1);
    }
    
    if (checkBulletCollision(bullet)) {
      bullets.splice(i, 1);
      enemy.health -= 10;
    }
  }
}

function checkBulletCollision(bullet) {
  const enemyCol = Math.floor(enemy.x);
  const enemyRow = Math.floor(enemy.y);
  const bulletCol = Math.floor(bullet.x);
  const bulletRow = Math.floor(bullet.y);
  
  return (bulletCol === enemyCol && bulletRow === enemyRow);
}

function updateEnemy() {
  if (enemy.health <= 0) {
    gameMap[Math.floor(enemy.x)][Math.floor(enemy.y)] = 0;
  }
}