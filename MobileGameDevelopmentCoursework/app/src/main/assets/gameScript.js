 var canvas;
 var canvasContext;
 var Player;
 var Enemy;
 var Background;
 var friction;
 var clickX;
 var clickY;
 var near;
 var accelerationx;
 var accelerationy;
 var tEst;
 var maxSpeed;
 var score;
 var gameOver;
 var gameStart;
 var pauseTime;
 var enemyTime;
 var soundManager;
 var particles = [];
 //template for all the sprite classes used
 function SpriteTemplate(PNG, Xvalue, Yvalue, XVelocity, YVelocity)
 {
    this.x = Xvalue;
    this.y = Yvalue;
    this.vx = XVelocity;
    this.vy = YVelocity;
    this.Sprite = new Image();
    this.Sprite.src = PNG;

 }
 //draws the sprite to the screen and sets its hitbox
 SpriteTemplate.prototype.draw = function()
 {
    canvasContext.drawImage(this.Sprite,this.x - this.Sprite.width/4, this.y - this.Sprite.height/4, this.Sprite.width/2, this.Sprite.height/2);
    this.hitboxX = this.Sprite.width/4;
    this.hitboxY = this.Sprite.height/4;
 }

 //draws the background sprite to the screen
 SpriteTemplate.prototype.drawBackground = function()
 {
    canvasContext.drawImage(this.Sprite,this.x, this.y, canvas.width, canvas.height);
 }

 //start point of the application, runs all the setup functions and starts the game loop
 function load()
 {
    //set ups the canvas
    canvasSetup();
    //sets up input listeners
    listenerSetup();
    //sets up the variables
    variableSetup();
    //the game loop of the application

    if (soundManager != null)
    {
        soundManager.playMusic(0); //Play main music
    }

    else
    {
        console.log("soundManager is null");
    }


    updateLoop();
 }
 //sets up the canvas
 function canvasSetup()
 {
    canvas = document.getElementById('mainCanvas');
    canvasContext = canvas.getContext('2d');
    reorient();
 }
//sets the canvas to the height and width of the window
 function reorient()
 {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
 }
//sets up all the variables for the game
 function variableSetup()
 {
    //sets the timers for the enemy dash and the game over screen input pause
    enemyTime = 60;
    pauseTime = 120;
    //sets the game start and game over booleans to true so that the application starts on the introduction screen
    gameStart=false;
    gameOver=false;
    //canvasContext.font = "30px Times New Roman";
    score = 0;
    maxSpeed = 2;
    accelerationx = 2;
    accelerationy = 2;
    friction = 0.1;
    //creates all the objects in the game
    Player = new SpriteTemplate("Player.png",canvas.width/2 - 200,canvas.height/2,0,0);
    Enemy = new SpriteTemplate("Enemy.png",canvas.width/2 + 300,canvas.height/2,0,0);
    Point1 = new SpriteTemplate("Point.png", Enemy.x + 40, Enemy.y - 30, 75, -75);
    Point2 = new SpriteTemplate("Point.png", Enemy.x- 20, Enemy.y + 70, -75, 75);
    Point3 = new SpriteTemplate("Point.png", Enemy.x + 30, Enemy.y +30, +75, +75);
    Background = new SpriteTemplate("Background.png",0,0,0,0);
 }
 //sets up the event listeners, these are used to call functions for controlling the character and progress through the intro and game over screens
 function listenerSetup()
 {
    window.addEventListener('resize', reorient, false);
    window.addEventListener('orientationchange', reorient, false);
    canvas.addEventListener("touchstart", touchStart, false);
    canvas.addEventListener("click", touchStart, false);
 }
//the main loop of the application, contains a recursive call to function as an update loop
 function updateLoop()
 {

    if(gameStart == false)
    {
        drawIntro();
    }
    else if(gameOver == false && gameStart == true)
    {
        //runs all ai and decision making for the game
        AI();
        //runs the physics of all physics objects
        Physics();
        //draws the background and sprites to the screen
        drawObjects();
        //saves the score to a cookie if it is a new high score
    }
    else if(gameOver == true)
    {
        drawGameover();
        pauseTime -= 1;
    }
    //returns to the start of the update loop
    requestAnimationFrame(updateLoop);
 }
 //draws the intro screen
 function drawIntro()
 {
    //draws the background
    Background.drawBackground();
    //draws the tutorial text to the screen
    canvasContext.font = "30px Times New Roman";
    canvasContext.fillText("Tap The Screen to blow the ball around,",canvas.width/2 - 300,canvas.height/2);
    canvasContext.fillText("the enemy will chase you and will end",canvas.width/2 - 300,canvas.height/2 +50);
    canvasContext.fillText("the game if it touches you. Collect the",canvas.width/2 - 300,canvas.height/2 +100);
    canvasContext.fillText("the green objects to gain points",canvas.width/2 - 300,canvas.height/2 +150 );
 }

//calls the draw function for all of the objects and draws the score nd particles to the screen
 function drawObjects()
 {
        //draws the background
        Background.drawBackground();
        //draws the particles
        drawParticles();
        //draws the game objects
        Point1.draw();
        Point2.draw();
        Point3.draw();
        Enemy.draw();
        Player.draw();
        //draws the score
        canvasContext.font = "60px Calibri";
        canvasContext.fillText("Score: " + score,10,50);


 }
 //draws the gameover screen when it is called
 function drawGameover()
 {
    Background.drawBackground();
    canvasContext.font = "30px Arial";
    canvasContext.fillText("Score: " + score,canvas.width/2 - 300,canvas.height/2 + 50);
    canvasContext.fillText("Game Over",canvas.width/2 - 300,canvas.height/2 - 50);
    //this ensures that the player does not accidentally skip the game over screen
    if (pauseTime<0)
    {
        canvasContext.fillText("Touch to restart",canvas.width/2 ,canvas.height/2);
    }

 }

 function reStart()
 {
    //resets all the variables in the program for the player to start again
    Player = new SpriteTemplate("Player.png",canvas.width/2 - 200,canvas.height/2,0,0);
    Enemy = new SpriteTemplate("Enemy.png",canvas.width/2 + 300,canvas.height/2,0,0);
    Point1 = new SpriteTemplate("Point.png", Enemy.x + 40, Enemy.y - 30, 75, -75);
    Point2 = new SpriteTemplate("Point.png", Enemy.x- 20, Enemy.y + 70, -75, 75);
    Point3 = new SpriteTemplate("Point.png", Enemy.x + 30, Enemy.y +30, +75, +75);
    Background = new SpriteTemplate("Background.png",0,0,0,0);
    gameStart=false;
    gameOver=false;
    score = 0;
    pauseTime = 120;
 }
 //calculates physics
 function Physics()
 {

    // bounces objects that hit the side of the screen;
    bounce(Player);
    bounce(Enemy);
    bounce(Point1);
    bounce(Point2);
    bounce(Point3);
    //applies friction to all physics objects
    f(Player);
    f(Enemy);
    f(Point1);
    f(Point2);
    f(Point3);
    //caps the speed of physics objects
    speedCap(Player, 2);
    speedCap(Enemy, 2);
    speedCap(Point1, 5);
    speedCap(Point2, 5);
    speedCap(Point3, 5);
    //applies the physics calculations to the Enemy position
    Enemy.y += Enemy.vy;
    Enemy.x += Enemy.vx;
    //applies the physics calculations to the player position
    Player.y += Player.vy;
    Player.x += Player.vx;
    //applies the physics calculations to the points positions
    Point1.x += Point1.vx;
    Point1.y += Point1.vy;
    Point2.x += Point2.vx;
    Point2.y += Point2.vy;
    Point3.x += Point3.vx;
    Point3.y += Point3.vy;
    //console.log("playerPos " + Player.x + " " + Player.y);
 }

//this function applies friction to any object passed into it
 function f(Object)
 {
    //following if statements return velocity of Object to 0 over time
            if(Object.vy > 0)
            {
                if (Object.vy <= friction)
                {
                    Object.vy = 0;
                }
                else
                {
                    Object.vy -= friction;
                }
            }
            else if(Object.vy < 0)
            {
                if (Object.vy >= -friction)
                {
                    Object.vy = 0;
                }
                else
                {
                    Object.vy += friction;
                }
            }
            if(Object.vx > 0)
            {
                if (Object.vx <= friction)
                {
                    Object.vx = 0;
                }
                else
                {
                    Object.vx -= friction;
                }
            }
            else if(Object.vx < 0)
            {
                if (Object.vx >= -friction)
                {
                    Object.vx = 0;
                }
                else
                {
                    Object.vx += friction;
                }
            }
 }
 
 //this function caps the speed of all physics objects to avoid infinite acceleration
 function speedCap(Object, MaxSpeedMultiplier)
 {
        // caps the Objects speed
        if(Object.vx > maxSpeed*MaxSpeedMultiplier)
        {
           Object.vx -= (Object.vx - maxSpeed*MaxSpeedMultiplier)
        }
        if(Object.vx < -maxSpeed*MaxSpeedMultiplier)
        {
           Object.vx -= (Object.vx + maxSpeed*MaxSpeedMultiplier)
        }
        if(Object.vy > maxSpeed*MaxSpeedMultiplier)
        {
           Object.vy -= (Object.vy - maxSpeed*MaxSpeedMultiplier)
        }
        if(Object.vy < -maxSpeed*MaxSpeedMultiplier)
        {
           Object.vy -= (Object.vy + maxSpeed*MaxSpeedMultiplier)
        }
 }

 function AI()
 {
    if(enemyTime <= 0)
    {
        //makes the enemy lunge at the player every second
        seek(Enemy, Player);
        enemyTime = 60;
    }
    //checks if the enemy has collided with the player and ends the game if they have
    if(collision(Player, Enemy)==true)
    {
        gameOver = true;
    }

    //checks if the player has collided with a point, increases score, plays a sound, and moves the point if they have
    if(collision(Player, Point1)==true)
    {
        if(soundManager != null)
        {
            soundManager.playSound(1);
        }
        ChangeLocation(Point1);
        score++;
    }

    if(collision(Player, Point2)==true)
    {
        if(soundManager != null)
        {
            soundManager.playSound(1);
        }
        ChangeLocation(Point2);
        score++;
    }

    if(collision(Player, Point3)==true)
    {
        if(soundManager != null)
        {
            soundManager.playSound(1);
        }
        ChangeLocation(Point3);
        score++;
    }
    //counts down the enemies lunge time
    enemyTime -= 1;
 }
 //triggers when the screen is touched
 function touchStart(event)
 {
    //if the game is on the title screen, moves the game to the game screen
    if (gameStart == false)
    {
        gameStart = true;
    }
    //if the game is running, the player control code is called and particles are created at the users touch point
    else if (gameStart == true && gameOver == false)
    {
        clickX = event.clientX;
        clickY = event.clientY;
        createParticles();
        PlayerControll();
    }
    else if(gameOver == true && pauseTime < 0)
    {
        reStart();
    }

    //console.log("mousePos " + clickX + " " + clickY);
 }

 //this function is responsible for moving the player, it takes the position the user clicks and applies a flee steering behaviour to the player with that position as the target
 function PlayerControll()
 {
        if(distance(Player.x, clickX, Player.y, clickY) <=150)
        {
            //finds the desired x and y components of the needed vector
            var desiredx = Player.x - clickX;
            var desiredy = Player.y - clickY;
            desiredx = (desiredx/(magnitude((Player.x - clickX), (Player.y - clickY))))*accelerationx;
            desiredy = (desiredy/(magnitude((Player.x - clickX), (Player.y - clickY))))*accelerationy;
            //applies the desired vector to the players velocity
            Player.vx += desiredx;
            Player.vy += desiredy;
            //plays the sound effect if the soundManager can be found
            if (soundManager != null)
            {
                soundManager.playSound(0);
            }
        }
 }

 //finds the distance between two points and returns it
 function distance(x1, x2, y1, y2)
 {
    return Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)))
 }

 //code for enemy ai to follow the player, similar to the player control but is reversed so it follows the given position
 function seek(Object1, Object2)
 {
    var desiredx = Object1.x - Object2.x;
    var desiredy = Object1.y - Object2.y;
    desiredx = (desiredx/(magnitude((Object1.x - Object2.x), (Object1.y - Object2.y))))*(-accelerationx*2);
    desiredy = (desiredy/(magnitude((Object1.x - Object2.x), (Object1.y - Object2.y))))*(-accelerationy*2);
    Enemy.vx += desiredx - Enemy.vx;
    Enemy.vy += desiredy - Enemy.vy;
 }
 //returns the magnitude of a vector
 function magnitude(x, y)
 {

    return (Math.sqrt((x*x) + (y*y)));

 }
//checks for collisions between two object using the distance between the x any y values of their hitboxes and returns a true or false result
 function collision(Object1, Object2)
 {
    var colideX;
    var colideY;
    if(Math.sqrt((Object1.x - Object2.x)*(Object1.x - Object2.x)) <= (Object1.hitboxX + Object2.hitboxX))
    {
        colideX = true;
    }
    if(Math.sqrt((Object1.y - Object2.y)*(Object1.y - Object2.y)) <= (Object1.hitboxY + Object2.hitboxY))
    {
        colideY = true;
    }
    if(colideX == true && colideY == true)
    {
        return true;
    }
    else
    {
        return false;
    }

 }

//moves the points when they are collected to the enemies position, then applies a random velocity to the point
 function ChangeLocation(Point)
 {
    Point.x = Enemy.x;
    Point.y = Enemy.y;
    Point.vx = Math.floor(Math.random() * (Math.floor(Enemy.vx +500) - Math.ceil(Enemy.vx - 500))) + Enemy.vx - 50;
    Point.vy = Math.floor(Math.random() * (Math.floor(Enemy.vy +500) - Math.ceil(Enemy.vy - 500))) + Enemy.vy - 50;
 }
 //bounces an object if it hits the edge of the screen by reversing its velocity.
 function bounce(Object)
 {
    if(Object.x <= 10)
    {
        Object.x = 15;
        Object.vx = -Object.vx
    }
    if(Object.x >= canvas.width)
    {
        Object.x = canvas.width - 15;
        Object.vx = -Object.vx
    }
    if(Object.y <= 10)
    {
        Object.y = 15;
        Object.vy = -Object.vy
    }
    if(Object.y >= canvas.height)
    {
        Object.y = canvas.height - 15;
        Object.vy = -Object.vy
    }
 }
 
 //this function is called to create the array of particles
 function createParticles()
 {
    // Adds 10 particles to the array with random positions, colours, velocities and lifespans
    for(var i = 0; i < 10; i++)
    {
        particles.push(new create());
    }
 }

 //this function handles the initialisation of each particle
 function create()
 {
    // sets the position of each particle to where the user has clicked
    this.x = clickX;
    this.y = clickY;
    // Add random velocity to each particle
    this.vx = Math.random()*5-2;
    this.vy = Math.random()*5-2;
 
    //Randomised the RGB values of the colours
    var red = Math.random()*255>>0;
    var green = Math.random()*255>>0;
    var blue = Math.random()*255>>0;
    this.color = "rgba("+red+", "+green+", "+blue+", 0.5)";
 
    //applies a random size to the  radius of the particle
    this.radius = Math.random()*7;
 
    // adds a lifetime value for the particle
    this.lifeSpan = Math.random()*200;

 }
 
 // This function handles the drawing, physics, and lifetime of each particle in the particles array
 function drawParticles()
 {
    // Render each particle in the particle array
    for(var i = 0; i < particles.length; i++)
    {
        var particle = particles[i];
        canvasContext.beginPath();
        //applies the colour to the fillStyle
        canvasContext.fillStyle = particle.color;
        //creates the arc to be drawn as the particle to the screen
        canvasContext.arc(particle.x, particle.y, particle.radius, Math.PI*2, false);
        //draws the particle to the canvas
        canvasContext.fill();
        //resets the canvas fill style to stop the colour from applying to the text
        canvasContext.fillStyle = "rgba(0,0,0,1)";
        //applies physics to the particles
        f(particle);
        bounce(particle);
        speedCap(particle, 1);
        particle.x += particle.vx;
        particle.y += particle.vy;
        //counts down the death timer of each particle and removes it if it goes below 0
        particle.lifeSpan -= 10;
        if(particle.lifeSpan < 0)
        {
            particles.splice(i,1);
        }

    }
  }


