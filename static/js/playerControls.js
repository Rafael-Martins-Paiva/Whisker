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
    if(keys['w']) {
        const newX = player.x + Math.cos(player.angle) * config.moveSpeed;
        const newY = player.y + Math.sin(player.angle) * config.moveSpeed;
        if(newX >= 0 && newX < gameMap.length &&
           newY >= 0 && newY < gameMap[0].length && 
           gameMap[Math.floor(newX)][Math.floor(newY)] === 0) {                                     
            player.x = newX;                            
            player.y = newY;                        
        }
    }

    if(keys['s']) {                                 
        const [newX, newY] = moveBackward();        
        if(newX >= 0 && newX < gameMap.length &&
           newY >= 0 && newY < gameMap[0].length && 
           gameMap[Math.floor(newX)][Math.floor(newY)] === 0) {                                     
            player.x = newX;                            
            player.y = newY;                        
        }
    }

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
