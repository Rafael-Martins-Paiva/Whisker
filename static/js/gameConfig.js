const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const config = {
    resolution: isMobile ? 80 : 120,
    fov: Math.PI / (isMobile ? 2.2 : 2.5),
    moveSpeed: isMobile ? 0.10 : 0.12,
    rotSpeed: isMobile ? 0.06 : 0.07,
    wallHeight: 1.0,
    touchSensitivity: 0.04,
    backwardSpeedMultiplier: 0.8
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

const enemy = {
  x: 2.5, 
  y: 2.5, 
  health: 100 
};

const textures = {
    1: new Image(),
    2: new Image(),
    3: new Image()
};

textures[1].src = '/static/textures/wall1.jpg';
textures[2].src = '/static/textures/wall2.jpg';
textures[3].src = '/static/textures/wall3.jpg';

const sprites = {
  weapon: new Image(),
  bullet: new Image(),
  enemy: new Image()
};

sprites.weapon.src = '/static/sprites/Weapon.jpg'; 
sprites.bullet.src = '/static/sprites/Bullet.jpg'; 
sprites.enemy.src = '/static/sprites/Enemy.jpg'; 

const keys = {};
let touchControls = {
    up: false,
    left: false,
    down: false,
    right: false
};

let touchStartX = 0, touchStartY = 0, touchMoveX = 0, touchMoveY = 0;
