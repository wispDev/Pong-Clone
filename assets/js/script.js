var canvas, canvas_context, starting_position, ball_x, ball_y;
var ball_speed_x = 5;
var ball_speed_y = 1;

var player_score = 0;
var ai_score = 0;
const win_condition = 3;

var win_screen = false;

var player_paddle_y = 250;
var ai_paddle_y = 250
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

starting_position = 50;
ball_x = starting_position;
ball_y = starting_position;

function end(game_winner){
    var winner = game_winner + "wins!";
    canvas_context.font = '50px serif';
    canvas_context.fillText(winner, (canvas.width/2), 100);
}

function game_reset(){
    player_score = 0;
    ai_score = 0;
    win_screen = false;
    ball_reset();
}

function draw_net(){
    for (var i = 0; i < canvas.height; i += 40){
        color_rect((canvas.width/2 - 1), i, 2, 20, 'white');
    }
}

function draw_everything() {
    // Draw rectangular play area
    color_rect(0, 0, canvas.width, canvas.height, 'black');

    if(win_screen){
        canvas_context.font = '50px serif';
        canvas_context.fillStyle = 'white';
        if (player_score == win_condition){
            canvas_context.fillText("Player Wins!", (canvas.width/2 - 200), 200);
        } else if (ai_score == win_condition){
            canvas_context.fillText("AI Wins!", (canvas.width/2 - 200), 200);
        }
        canvas_context.fillText("Click to continue...", (canvas.width/2 - 200), 250);
        return;
    }

    // Draw net
    draw_net();

    // Draw player paddle
    color_rect(0, player_paddle_y, PADDLE_WIDTH, PADDLE_HEIGHT, "white");

    // Draw AI paddle
    color_rect(canvas.width - 10, ai_paddle_y, PADDLE_WIDTH, PADDLE_HEIGHT, "white")
    
    // Draw the ball
    color_circle('white', ball_x, ball_y, 10);

    canvas_context.font = '50px serif';
    canvas_context.fillText(player_score, 100, 100);
    canvas_context.fillText(ai_score, 700, 100);
}

function ai_movement(){
    var paddle_y_center = ai_paddle_y + (PADDLE_HEIGHT / 2);
    if (paddle_y_center < (ball_y - 25)){
        ai_paddle_y += 5;
    }
    else if(paddle_y_center > (ball_y + 25)){
        ai_paddle_y -= 5;
    }
}

function calculate_mouse_position(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouse_x = evt.clientX - rect.left - root.scrollLeft;
    var mouse_y = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouse_x,
        y:mouse_y
    };
}

function color_circle(color, x, y, radius, starting_angle = 0, ending_angle = Math.PI*2, counter_clockwise = true){
    canvas_context.fillStyle = color;
    canvas_context.beginPath();
    canvas_context.arc(x, y, radius, starting_angle, ending_angle, counter_clockwise);
    canvas_context.fill();
}

function color_rect(x, y, width, height, draw_color){
    canvas_context.fillStyle = draw_color;
    canvas_context.fillRect(x, y, width, height); 
}

function move_everything(){

    if(win_screen){
        return;
    }

    ball_x += ball_speed_x;
    ball_y += ball_speed_y;
    
    if (ball_x > canvas.width){
        if (ball_y > ai_paddle_y && ball_y < ai_paddle_y + PADDLE_HEIGHT){
            ball_speed_x = -ball_speed_x;

            var delta_y = ball_y - (ai_paddle_y + PADDLE_HEIGHT/2);
            ball_speed_y = delta_y * 0.25;
        }
        else {
            player_score++;
            ball_reset();
            if (player_score == win_condition){
                win_screen = true;
            }
        }
    } else if (ball_x < 0){
        if (ball_y > player_paddle_y && ball_y < player_paddle_y + PADDLE_HEIGHT){
            ball_speed_x = -ball_speed_x;
            
            var delta_y = ball_y - (player_paddle_y + PADDLE_HEIGHT/2);
            ball_speed_y = delta_y * 0.25;
        } else {
            ai_score++;
            ball_reset();
            if (ai_score == win_condition){
                win_screen = true;
            }
        }
    }
    
    if (ball_y > canvas.height){
        ball_speed_y = -ball_speed_y;
    } else if (ball_y < 0){
        ball_speed_y = -ball_speed_y;
    }
}

function ball_reset(){
    ball_speed_x = -ball_speed_x;
    ball_x = canvas.width/2;
    ball_y = canvas.height/2;
}

function run(){
    ai_movement();
    draw_everything();
    move_everything();
}

function handle_mouse_click(){
    if(win_screen){
        game_reset();
    }
}

function onload_function(){
    canvas = document.getElementById('game_canvas');
    canvas_context = canvas.getContext('2d');

    setInterval(run, 16.66);
    // setInterval(ai_movement, 16.66);
    
    canvas.addEventListener('mousedown', handle_mouse_click);

    canvas.addEventListener('mousemove',
        function(evt) {
            var mousePos = calculate_mouse_position(evt);
            player_paddle_y = mousePos.y - (PADDLE_HEIGHT/2);
        }
    );

}

window.onload = onload_function();

