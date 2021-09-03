var bg, bgImg
var bottomGround
var topGround
var balloon, balloonImg
var building,building1,building2,building3;
var bird,birdImg;
var buildingGroup,birdGroup;

var blast;
var coin,coinImg,coinGroup;

var heart,heart1,heart2,heart3;

var gameOver,gameOverImg;
var restart,restartImg;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var score = 0;
var life = 3;

var dieSound,jumpSound,coinSound;

function preload()
{
bgImg = loadImage("assets/bg.png")
balloonImg = loadAnimation("assets/balloon1.png","assets/balloon2.png","assets/balloon3.png")
building1 = loadImage("assets/obsBottom1.png");
building2 = loadImage("assets/obsBottom2.png");
building3 = loadImage("assets/obsBottom3.png");
birdImg1 = loadImage("assets/obsTop2.png");
birdImg2 = loadImage("assets/obsTop3.png");
blastImg = loadAnimation("assets/blast.png");
gameOverImg = loadImage("assets/gameOver.png");
restartImg = loadImage("assets/restart.png");
coinImg = loadImage("assets/goldCoin.png");
heart1 = loadAnimation("assets/heart-1.png");
heart2 = loadAnimation("assets/heart-2.png");
heart3 = loadAnimation("assets/heart-3.png");

dieSound = loadSound("assets/die.mp3");
jumpSound = loadSound("assets/jump.mp3");
}

function setup()
{
createCanvas(800,500);

//background image
bg = createSprite(300,370,1,1);
bg.addImage(bgImg);
bg.scale = 1;
bg.velocityX = -3;

//creating top and bottom grounds
bottomGround = createSprite(400,500,800,10);
bottomGround.visible = false;

topGround = createSprite(400,0,800,10);
topGround.visible = false;
      
//creating balloon     
balloon = createSprite(100,200,20,50);
balloon.addAnimation("balloon",balloonImg);
balloon.scale = 0.2;
//balloon.debug = true;
balloon.setCollider("circle",0,-125,150)

balloon.frameDelay = 15;

buildingGroup = createGroup();
birdGroup = createGroup();
coinGroup = createGroup();

gameOver = createSprite(400,200);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.6;
gameOver.visible = false;

restart = createSprite(400,250);
restart.addImage(restartImg);
restart.scale = 0.6;
restart.visible = false;

heart = createSprite(50,20);
heart.addAnimation("3",heart3);
heart.scale = 0.15;

dieSound.setVolume(4);
}

function draw() 
{
  background("black");
        
if(gameState === PLAY){
  //making the hot air balloon jump
if(keyDown("space")) {
  balloon.velocityY = -7;
}

//adding gravity
 balloon.velocityY = balloon.velocityY + 0.8;

 balloon.collide(bottomGround);
 balloon.collide(topGround);
 
if(bg.position.x < 200)
 {
   bg.position.x = 300;
 }

if(balloon.isTouching(buildingGroup) || balloon.isTouching(birdGroup)){
  //balloon.addAnimation("blast",blastImg);
  //balloon.changeAnimation("blast");
  life = life - 1;
  birdGroup.destroyEach(0);
  buildingGroup.destroyEach(0);
}

if(life === 2){
  heart.addAnimation("2",heart2);
  heart.changeAnimation("2");
}

if(life === 1){
  heart.addAnimation("1",heart1);
  heart.changeAnimation("1");
}

if(life === 0){
  heart.visible = false;
  gameState = END;
  dieSound.play();
}

if(balloon.isTouching(coinGroup)){
  coinGroup.destroyEach(0);
  jumpSound.play();
  score = score + 1;
  balloon.scale = balloon.scale + 0.01;

  if(score % 3 === 0 && life < 3){
    life = life + 1
  }
}



//calling the functions
 spawnObstacles();
 spawnBirds();
 spawnCoins();

} else if (gameState === END){
  
  bg.velocityX = 0;
  balloon.velocityY = 0;
  birdGroup.setVelocityXEach(0);
  buildingGroup.setVelocityXEach(0);
  coinGroup.setVelocityXEach(0);

  birdGroup.setLifetimeEach(-1);
  buildingGroup.setLifetimeEach(-1);
  coinGroup.setLifetimeEach(-1);

  gameOver.visible = true;
  restart.visible = true;

  balloon.addAnimation("blast",blastImg);
  balloon.changeAnimation("blast");
  
  if(mousePressedOver(restart)){
    reset();
  }
}

 drawSprites();
 fill("white");
 textSize(15);
 text("Score: "+score,720,20);
}

function spawnObstacles()
{
  if(frameCount % 150 === 0){
    building = createSprite(800,420);
    building.velocityX = -(3 + score/2);
    building.scale = 0.1;
    //building.debug = true;
    
    var rand = Math.round(random(1,3))
    switch(rand){
      case 1 : building.addImage(building1);
        break;
      case 2 : building.addImage(building2);
        break;
      case 3 : building.addImage(building3);
        break;
      default: break;
    }
    buildingGroup.add(building);
    building.lifetime = 266;
  }
}

function spawnBirds()
{
  if(frameCount % 100 === 0){
    bird = createSprite(800,Math.round(random(50,250)));
    bird.scale = 0.1;
    bird.velocityX = -(4 + score/2);
    //bird.debug = true;
    
    var rand = Math.round(random(1,2))
    switch(rand){
      case 1 : bird.addImage(birdImg1);
        break;
      case 2 : bird.addImage(birdImg2);
        break;
      default: break;
    }

    birdGroup.add(bird);
    bird.lifetime = 200;
  }
}

function reset()
{
  gameState = PLAY;
  balloon.changeAnimation("balloon");
  birdGroup.destroyEach();
  buildingGroup.destroyEach();
  coinGroup.destroyEach();
  gameOver.visible = false;
  restart.visible = false;
  bg.velocityX = -3;
  score = 0;
  life = 3;
  heart.changeAnimation("3");
  heart.visible = true;
}

function spawnCoins()
{
  if(frameCount % 120 === 0){
    coin = createSprite(800,Math.round(random(20,480)));
    coin.addImage(coinImg);
    coin.scale = 0.1;
    coin.velocityX = -(5 + score/2);
    
    coinGroup.add(coin);
    coin.lifetime = 150;
  }
}