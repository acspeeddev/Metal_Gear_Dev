var gameArea;
var canvasContext;

var ballX = 0;
var ballSpeedX = 10;

var ballY = 0;
var ballSpeedY = 10;

//Player paddle
var paddleLeftY = 230;
var pLHeight = 120;

//Computer paddle
var paddleRightY = 230;
var pRHeight = 120;


var paddleWidth = 15;

//score
var humanPlayerScore = 0;
var computerScore = 0;
var winningScore = 5;

//after win
var showWinScreen = false;

function calculateMousePos(evt){
    var rect = gameArea.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY,
    }
}

function handleMouseClick(evt){
    if(showWinScreen){
        humanPlayerScore = 0;
        computerScore = 0;
        showWinScreen = false;
    }
}

window.onload = function() {
    gameArea = document.getElementById('gameCanvas');
    canvasContext = gameArea.getContext('2d');
    
    var framesPerSecond = 30;
    setInterval(function(){
        ballPhysics();
        gameAssets();
        drawNet();
        gameBall('white', ballX, ballY, 10, 0);
    }, 500/framesPerSecond);
    
    gameArea.addEventListener('mousedown', handleMouseClick);
    
    gameArea.addEventListener('mousemove', 
        function(evt){
            var mousePos = calculateMousePos(evt);
            paddleLeftY = mousePos.y-(paddleLeftY/3);
    })
};

//Ballreset
function ballReset(){
    if (humanPlayerScore >= winningScore ||
        computerScore >= winningScore){
        showWinScreen = true;
    }
    
    ballSpeedX = -ballSpeedX;
    ballX = gameArea.width/2;
    ballY = gameArea.height/2;
}

//computer paddle motion
function computerPaddle() {
        if (showWinScreen){
        return;
    }
    var compPaddleCenter = paddleRightY + (pRHeight/3);
    if (compPaddleCenter < ballY) {
        paddleRightY = paddleRightY +=6;
    } else {
        paddleRightY = paddleRightY -=6;
    }
}

//ball motion, player score, ballReset
function ballPhysics(){
    if (showWinScreen){
        return;
    }
    computerPaddle();
    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;
 
//If ball hits left paddle reverse motion or call ballReset_function
    if(ballX < 25 + paddleWidth){
        if(ballY > paddleLeftY && 
           ballY < paddleLeftY + pLHeight){
           ballSpeedX = -ballSpeedX;
            
                var deltaY = ballY -(paddleLeftY+pLHeight/2);
                ballSpeedY = deltaY * 0.20;
            
        } else if (ballX < 0 - 20){ 
            computerScore++; //Must be before ballReset
            ballReset();
         
        }
    };
//If ball hits Right paddle reverse motion or call ballReset_function     
    if(ballX > 775 + -paddleWidth){
        if(ballY > paddleRightY && 
           ballY < paddleRightY + pRHeight){
           ballSpeedX = -ballSpeedX;
            
                var deltaY = ballY -(paddleRightY+pRHeight/2);
                ballSpeedY = deltaY * 0.20;
            
        } else if (ballX > 820){
            humanPlayerScore++; //Must be before ballReset
            ballReset();
         
        }
    };

//Y-Axis will not call ballReset_function//
    if(ballY < 10){
       ballSpeedY = -ballSpeedY;
    };
    if(ballY > 585){
        ballSpeedY = -ballSpeedY;
    };

};

function gameBall(bC, bX, bY, bRAD, bB){
    if (showWinScreen){
    return;
    }
//ball 
    canvasContext.fillStyle = bC;
    canvasContext.beginPath();
    canvasContext.arc(bX, bY, bRAD, bB, Math.PI*2, true);
    canvasContext.fill();
}

//Game assets for canvas

function drawNet(){
    if(showWinScreen){
        return;
    }
    for(var i=8; i < gameArea.height; i+=40){
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(400,i,2,20,20);
    }
}

function gameAssets() {
//game area    
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0,0,gameArea.width,gameArea.height);
//Win screen and final score display    
    if(showWinScreen){
    if(humanPlayerScore >= winningScore){
    canvasContext.fillStyle = 'white';    
    canvasContext.fillText("Well done human!", 250, 200);
    } else if(computerScore >= winningScore){
    canvasContext.font= '25px';
    canvasContext.fillStyle = 'white';    
    canvasContext.fillText("You lose...Computers are taking over!!!", 250, 200);
    }
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Click to continue", 250, 450);
    return;
    }
    
//left player paddle    
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(20,paddleLeftY,paddleWidth,pLHeight);
//right computer paddle 
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(770,paddleRightY,paddleWidth,pRHeight);
//score tab
    canvasContext.font = '15pt Impact';
    canvasContext.fillText("Player  " + humanPlayerScore, 230, 40);
    canvasContext.fillText("Computer  " + computerScore, 480, 40);
};




