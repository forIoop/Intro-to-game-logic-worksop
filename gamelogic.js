window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

// width/height of the whole canvas
var cvs_width = 400, cvs_height = 500;

// dctionary representing the properties of the ball
var ball = {
  x:cvs_width / 2, // center of the ball
  y:cvs_height / 2 , // center of the ball
  radius:20,
  dir_x:1,
  dir_y:1,
  speed:3 // we can increase this value for it to go faster
};

var obs_1 = {
    x:      100, // represents x-coord center of the obstacle
    y:      150, // represents y-coord center of the obstacle
    left:   0, // updated in the init function
    right:  0, // updated in the init function
    top:    0, // updated in the init function
    bottom: 0, // updated in the init function
    width:  105,
    height: 30,
    dir:    1, // up/down direction
    speed:  2 // we can increase this for the obstacles to move faster
    };

var obs_2 = {
    x:      300,  // represents x-coord center of the obstacle
    y:      350, // represents y-coord center of the obstacle
    left:   0, // updated in the init function
    right:  0, // updated in the init function
    top:    0, // updated in the init function
    bottom: 0, // updated in the init function
    width:  105,
    height: 30,
    dir:    -1, // up down direction
    speed:  2 // we can increase this for the obstacles to move faster
    };

// array of obstacles
var obstacles = [obs_1, obs_2];


var keeper_1 = {
    x:      cvs_width/2, //x-coord center
    y:      15, // y-coord center
    left:   0, // update later in init
    right:  0, // update later in init
    top:    0, // update later in init
    bottom: 0, // update later in init
    width:  105,
    height: 30,
    dir:    0, // left-right direction
    speed:  8 // we can increase this to move faster
    };
var keeper_2 = {
    x:      cvs_width / 2, //x-coord center
    y:      cvs_height - 15, gamelogic//y-coord center
    left:   0, // update later in init
    right:  0, // update later in init
    top:    0, // update later in init
    bottom: 0, // update later in init
    width:  105,
    height: 30,
    dir:    0, // left right direction
    speed:  8 // we can increase this to move faster
    };

// array of keepers
var keepers = [keeper_1, keeper_2];

// array representing the score of both players
var score = [0, 0];

// how long we must wait before the game starts
var delay = 100;

var ws = 1;
var ctx = null;

// called once when the page is loaded
function init()
{
    var width = window.innerWidth;
    var height = window.innerHeight;

    // determines a ratio multiplier based on the size of the browser windwo
    var ratio_x = (width - 105) / (cvs_width);
    var ratio_y = (height - 200) / cvs_height;
    var ratio = (ratio_x < ratio_y) ? ratio_x : ratio_y;

    cvs_width *= ratio;
    cvs_height *= ratio;

    var canvas = document.getElementById("remote");
    canvas.width = cvs_width + 105;
    canvas.height = cvs_height;

    ctx = canvas.getContext("2d");
    ctx.translate(105, 0);
    ctx.lineWidth = 4;

    // scales the size of all objects based on the ration found previously

    for( var i = 0; i < obstacles.length; i++)
    {
        obstacles[i].x *= ratio;
        obstacles[i].y *= ratio;
        obstacles[i].width *= ratio;
        obstacles[i].height *= ratio;
        obstacles[i].speed *= ratio;
        obstacles[i].left = obstacles[i].x - obstacles[i].width / 2;
        obstacles[i].right = obstacles[i].x + obstacles[i].width / 2;
        obstacles[i].top = obstacles[i].y - obstacles[i].height / 2;
        obstacles[i].bottom = obstacles[i].y + obstacles[i].height / 2;
    }

    for( var i = 0; i < keepers.length; i++)
    {
        keepers[i].x *= ratio;
        keepers[i].y *= ratio;
        keepers[i].width *= ratio;
        keepers[i].height *= ratio;
        keepers[i].speed *= ratio;
        keepers[i].left = keepers[i].x - keepers[i].width / 2;
        keepers[i].right = keepers[i].x + keepers[i].width / 2;
        keepers[i].top = keepers[i].y - keepers[i].height / 2;
        keepers[i].bottom = keepers[i].y + keepers[i].height / 2;
    }

    ball.x *= ratio;
    ball.y *= ratio;
    ball.radius *= ratio;
    ball.speed *= ratio;

    update_view(ctx);
}

// shows the actual visuals
function update_view(ctx)
{

    ctx.clearRect(-105, 0, cvs_width, cvs_height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cvs_width, cvs_height);

    ctx.beginPath();
    ctx.moveTo(-105, cvs_height / 2);
    ctx.lineTo(0, cvs_height / 2);
    ctx.stroke();
    ctx.font = "120px Georgia";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    var team_1 = score[0];
    var team_2 = score[1];
    ctx.fillStyle = "#00FF00";
    ctx.fillText(team_1.toString(), -50, cvs_height / 2 - 70);
    ctx.fillStyle = "#0000FF";
    ctx.fillText(team_2.toString(), -50, cvs_height / 2 + 50);

    ctx.fillStyle="#FF0000";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI);
    ctx.fill();

    for( var i = 0; i < obstacles.length; i++)
        ctx.fillRect(obstacles[i].left, obstacles[i].top, obstacles[i].width, obstacles[i].height);

    ctx.fillStyle="#00FF00";
    ctx.fillRect(keeper_1.left, keeper_1.top, keeper_1.width, keeper_1.height);

    ctx.fillStyle="#0000FF";
    ctx.fillRect(keeper_2.left, keeper_2.top, keeper_2.width, keeper_2.height);
}

/*
  This function is called continuously to move t he ball based on its
  dir_x, dir_y, and speed property.
  In order to move the ball, we must alter ball.x and ball.y
 */
function move_ball()
{
  //# TODO:
}

/*
  This function is used to move the keepers based on its dir value.
  These keepers will be controlled by the keyboard (for now).
  The keyboardEvents are already done. The purpose of this method is only
  to get the keepers to actually move. Consider what will happen if the
  kepper touches either edge.
*/
function move_keepers()
{
  // TODO:
}

/*
   This function runs through the obstacle objects, making them
   move up and down continously. We have the array, obstacles, which
   is the list containing the two obstacles in our game.
 */
function move_obstacles()
{
  // this constant represents how close from the top and bottom edge
  // the obstacle is allowed to go until it needs to switch direction
  var AMPLITUDE = 8*ball.radius;

  //# TODO:
}

/*
  This function is used to determine whether the ball is touching the object
  and what to do if the ball and object are "touching".
  The param, object, will represent either an individual keeper or obstacle.
 */
function collision_detect(object)
{
    // distance between center of the ball and center of the object
    var dist_x = Math.abs(ball.x - object.x);
    var dist_y = Math.abs(ball.y - object.y);

    // distance between center of the ball and object that determines the two are "touching"
    var TOUCH_DIST_X = ball.radius + object.width / 2;
    var TOUCH_DIST_Y = ball.radius + object.height / 2;

    // TODO:
}

/*
  This function is used to check whether the ball is touching the keepers and What
  to do if it is. Remember, we have already done the logic to this in collision_detect,
  so we can use that method on all of the keepers.
 */
function check_keepers()
{
    // TODO:
}


/*
  This function is used to check whether the ball is touching the obstacles and what
  to do if it is. Remember, we have already done the logic to this in collision_detect,
  so we can use that method on all of the obstacles.
*/
function check_obstacles()
{
    // TODO:
}

/*
  This function is used to check whether the ball is touching the edges of the
  canvas, and what to do if it is. Think about what should happen when the ball
  is touching the sides and what should happen when the ball touches the top or
  bottom.
 */
function check_edges()
{
    // TODO:
}



// deals with keyboard events

var tickX = 10;
var tickY = 10;

var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;


function setKey(e) {
  e = e || window.event;
  switch (e.keyCode) {
    case 68: //d
      keyD = true;
      break;
    case 37: //leftArrow
      keyS = true;
      break;
    case 65: //a
      keyA = true;
      break;
    case 39: //rightArrow
      keyW = true;
      break;
    }
}

function clearKey(e) {
  e = e || window.event;
  switch (e.keyCode) {
    case 68: //d
      keyD = false;
      break;
    case 37: //s
      keyS = false;
      break;
    case 65: //a
      keyA = false;
      break;
    case 39: //w
      keyW = false;
      break;
    }
}
function keyboardInput() {

    keepers[0].dir = keyD ? 1
                    : keyA ? -1
                    : 0;
    keepers[1].dir = keyW ? 1
                    : keyS ? -1
                    : 0;
}


// animates the graphics for the game
function animate(ctx)
{
    if(ws != null)
    {
        document.onkeydown = setKey;
        document.onkeyup = clearKey;

        keyboardInput();
        move_keepers();




        if(!delay)
        {
            move_ball();
            move_obstacles();
            check_edges();
            check_keepers();
            check_obstacles();

        }
        else
            delay--;

        update_view(ctx);
    }

    // request new frame
    requestAnimFrame(function() {
        animate(ctx);
    });
}

// used to allow 100 miliseconds for the graphics to load for the game, then starts animating
setTimeout(functi);on() {
    animate(ctx);
}, 100);

window.onload = init;
