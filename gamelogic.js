window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
var cvs_width = 400, cvs_height = 500;
var ball = {x:cvs_width / 2, y:cvs_height / 2 , radius:20, dir_x:1, dir_y:1, speed:5};
var obs_1 = {
    x:      100,
    y:      150,
    left:   0, // update later
    right:  0, // update later
    top:    0, // update later
    bottom: 0, // update later
    width:  105,
    height: 30,
    dir:    1, // up down direction
    speed:  2
    };
var obs_2 = {
    x:      300,
    y:      350,
    left:   0, // update later
    right:  0, // update later
    top:    0, // update later
    bottom: 0, // update later
    width:  105,
    height: 30,
    dir:    -1, // up down direction
    speed:  2
    };
var obstacles = [obs_1, obs_2];
var keeper_1 = {
    x:      cvs_width/2,
    y:      15,
    left:   0, // update later
    right:  0, // update later
    top:    0, // update later
    bottom: 0, // update later
    width:  105,
    height: 30,
    dir:    0, // left right direction
    speed:  8
    };
var keeper_2 = {
    x:      cvs_width / 2,
    y:      cvs_height - 15,
    left:   0, // update later
    right:  0, // update later
    top:    0, // update later
    bottom: 0, // update later
    width:  105,
    height: 30,
    dir:    0, // left right direction
    speed:  8
    };
var keepers = [keeper_1, keeper_2];
var score = [0, 0];
var delay = 100;
var ws = 1;
var ctx = null;
function init()
{
    var width = window.innerWidth;
    var height = window.innerHeight;
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
function collision_detect(object)
{
    var dist_x = Math.abs(ball.x - object.x);
    var dist_y = Math.abs(ball.y - object.y);
    var TOUCH_DIST_X = ball.radius + object.width / 2;
    var TOUCH_DIST_Y = ball.radius + object.height / 2;
    if(ball.x >= object.left && ball.x <= object.right)
    {
        if(dist_y <= TOUCH_DIST_Y)
        {
            ball.dir_y *= -1;
            if(ball.y < object.top)
                ball.y = object.top - ball.radius;
            else if(ball.y > object.bottom)
                ball.y = object.bottom + ball.radius;
            return true;
        }
        return false;
    }
    if(ball.y >= object.top && ball.y <= object.bottom)
    {
        if(dist_x <= TOUCH_DIST_X)
        {
            ball.dir_x *= -1;
            if(ball.x < object.left)
                ball.x = object.left - ball.radius;
            else if(ball.x > object.right)
                ball.x = object.right + ball.radius;
            return true;
        }
        return false;
    }
    if(dist_x < TOUCH_DIST_X && dist_y < TOUCH_DIST_Y)
    {
        dist_x -= object.width / 2; //distance to corner
        dist_y -= object.height / 2; //distance to corner
        if(dist_x == dist_y)
        {
            ball.dir_x *= -1;
            ball.dir_y *= -1;
        }
        else if(dist_x > dist_y)
            ball.dir_x *= -1;
        else
            ball.dir_y *= -1;
        return true;
    }
}
function check_edges()
{
    if((ball.x + ball.radius) >= cvs_width || (ball.x - ball.radius) <= 0)
        ball.dir_x *= -1;
    if((ball.y - ball.radius) >= cvs_height || (ball.y + ball.radius) <= 0)
    {
        if((ball.y - ball.radius) >= cvs_height)
            score[0] += 1;
        else
            score[1] += 1;
        ball.dir_y *= -1;
        ball.x = cvs_width / 2;
        ball.y = cvs_height / 2;
        delay = 100;
    }
}
function check_keepers()
{
    for( var i = 0; i < keepers.length; i++)
    {
        var obs = keepers[i];
        collision_detect(obs);
    }
}
function check_obstacles()
{
    for( var i = 0; i < obstacles.length; i++)
    {
        var obs = obstacles[i];
        collision_detect(obs);
    }
}
function move_ball()
{
    ball.x += ball.dir_x * ball.speed;
    ball.y += ball.dir_y * ball.speed;
}
function move_obstacles()
{
    var AMPLITUDE = 8*ball.radius;
    for( var i = 0; i < obstacles.length; i++)
    {
        obstacles[i].y += obstacles[i].dir * obstacles[i].speed;
        if(obstacles[i].dir == 1 && obstacles[i].y > (cvs_height - AMPLITUDE))
            obstacles[i].dir = -1;
        else if(obstacles[i].dir == -1 && obstacles[i].y < (AMPLITUDE))
            obstacles[i].dir = 1;
        obstacles[i].top = obstacles[i].y - obstacles[i].height / 2;
        obstacles[i].bottom = obstacles[i].y + obstacles[i].height / 2;
    }
}
function move_keepers()
{
    for( var i = 0; i < keepers.length; i++)
    {
        keepers[i].x += keepers[i].dir*keepers[i].speed;
        if(keepers[i].right > cvs_width && keepers[i].dir == 1)
        {
            keepers[i].dir *= 0;
            keepers[i].x = cvs_width - keepers[i].width / 2
        }
        if(keepers[i].left < 0 && keepers[i].dir == -1)
        {
            keepers[i].dir = 0;
            keepers[i].x = keepers[i].width / 2
        }
        keepers[i].left = keepers[i].x - keepers[i].width / 2;
        keepers[i].right = keepers[i].x + keepers[i].width / 2;
    }
}
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
// infinitely recursive method that is called to animate the game's visuals
function animate(ctx)
{
  document.onkeydown = setKey;
  document.onkeyup = clearKey;
  keyboardInput();
  // checks if delay is NOT zero
  if(!delay)
  {
      move_ball();
      move_obstacles();
      move_keepers();
      check_edges();
      check_keepers();
      check_obstacles();
  }
  else
    // decreases delay, which is the time before the game starts
      delay--;
  update_view(ctx);
  // request new frame
  requestAnimFrame(function() {
      animate(ctx);
  });
}
setTimeout(function() {
    animate(ctx);
}, 100);
window.onload = init;