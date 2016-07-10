'use strict';

function draw_logic(){
    // Draw ground grass.
    buffer.fillStyle = '#131';
    buffer.fillRect(
      0,
      floor_position,
      width,
      y
    );

    buffer.fillStyle = split_state[0]
      ? '#323232'
      : '#646464';

    // Precalculate left wall split position.
    var precalc = (splits[0][0] * (1 / splits[0][2])) + x;

    // Draw left wall extra bit.
    if(player_position > 0){
        buffer.fillRect(
          0,
          0,
          1 + (player_position >= precalc ? precalc : player_position),
          height
        );
    }

    // Draw left wall closer than split.
    if(player_position < precalc){
        buffer.beginPath();
        buffer.moveTo(
          player_position,
          y - x
        );
        buffer.lineTo(
          precalc,
          (splits[0][1] * (1 / splits[0][2])) + y
        );
        buffer.lineTo(
          precalc,
          (splits[1][1] * (1 / splits[1][2])) + y
        );
        buffer.lineTo(
          player_position,
          y + x
        );
        buffer.closePath();
        buffer.fill();
    }

    // Draw left wall further than split.
    buffer.fillStyle = split_state[0]
      ? '#646464'
      : '#323232';
    buffer.beginPath();
    buffer.moveTo(
      precalc,
      (splits[0][1] * (1 / splits[0][2])) + y
    );
    buffer.lineTo(
      x,
      y
    );
    buffer.lineTo(
      precalc,
      (splits[1][1] * (1 / splits[1][2])) + y
    );
    buffer.closePath();
    buffer.fill();

    buffer.fillStyle = split_state[0]
      ? '#646464'
      : '#323232';

    // Precalculate right wall split position.
    precalc = (splits[2][0] * (1 / splits[2][2])) + x;

    // Draw right wall extra bit.
    if(player_position < 0){
        buffer.fillRect(
          width + player_position < precalc
            ? precalc - 1
            : width + player_position - 1,
          0,
          -player_position,
          height
        );
    }

    // Draw right wall closer than split.
    if(width + player_position > precalc){
        buffer.beginPath();
        buffer.moveTo(
          width + player_position,
          y - x
        );
        buffer.lineTo(
          precalc,
          (splits[2][1] * (1 / splits[2][2])) + y
        );
        buffer.lineTo(
          precalc,
          (splits[3][1] * (1 / splits[3][2])) + y
        );
        buffer.lineTo(
          width + player_position,
          y + x
        );
        buffer.closePath();
        buffer.fill();
    }

    // Draw right wall further than split.
    buffer.fillStyle = split_state[0]
      ? '#323232'
      : '#646464';

    buffer.beginPath();
    buffer.moveTo(
      precalc,
      (splits[2][1] * (1 / splits[2][2])) + y
    );
    buffer.lineTo(
      x,
      y
    );
    buffer.lineTo(
      precalc,
      (splits[3][1] * (1 / splits[3][2])) + y
    );
    buffer.closePath();
    buffer.fill();

    // Draw current frame count.
    buffer.fillStyle = '#fff';
    buffer.fillText(
      frame_counter,
      5,
      25
    );
    buffer.fillText(
      bests_bests['score'],
      5,
      50
    );
}

function logic(){
    frame_counter += 1;

    // Get player movement.
    var player_dx = 0;
    if(key_left){
        player_dx += x / 20;
    }
    if(key_right){
        player_dx -= x / 20;
    }

    // Update player position.
    player_position += player_dx;

    // Make sure player stays in bounds.
    if(player_position > x / 1.5){
        player_position = x / 1.5;

    }else if(player_position < -x / 1.5){
        player_position = -x / 1.5;
    }

    // Move player forward by moving splits closer.
    for(var id in splits){
        splits[id][2] -= .05;

        // If splits reach player, reset splits.
        if(splits[id][2] < 0){
            splits[id][2] = 25;
            split_state[1] = true;
        }
    }

    // If it is time to reset split.
    if(split_state[1]){
        // Reset player position to start of new section.
        player_position = 0;

        // Switch split.
        split_state[1] = false;
        split_state[0] = !split_state[0];
    }
}

function resize_logic(){
    floor_position = y * (mode - 1);
}

function setmode_logic(newgame){
    split_state = [
      false,
      false,
    ];

    // Main menu mode.
    if(mode === 0){
        document.body.innerHTML = '<div><div><ul><li><a onclick="setmode(1, true)">Cling to the Ground</a>'
          + '<li><a onclick="setmode(2, true)">Walled Corridor</a></ul></div><hr>'
          + '<div>Best: ' + bests_bests['score'] + '<br>'
          + '<a onclick=bests_reset();setmode(0)>Reset Best</a></div></div>'
          + '<div class=right><div><input disabled value=ESC>Main Menu<br>'
          + '<input id=movement-keys maxlength=2>Move ←→<br>'
          + '<input id=restart-key maxlength=1>Restart</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<a onclick=settings_reset()>Reset Settings</a></div></div>';
        settings_update();

    // New game mode.
    }else{
        if(newgame){
            settings_save();
        }

        splits = [
          [-50, -50, 25],
          [-50, 50, 25],
          [50, -50, 25],
          [50, 50, 25],
        ];

        frame_counter = 0;
        player_position = 0;
    }
}

var floor_position = 0;
var frame_counter = 0;
var key_left = false;
var key_right = false;
var player_position = 0;
var split_state = [];
var splits = [];

window.onkeydown = function(e){
    if(mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // ESC: return to main menu.
    if(key === 27){
        bests_update(
          'score',
          frame_counter
        );
        setmode(
          0,
          true
        );
        return;
    }

    key = String.fromCharCode(key);

    if(key === settings_settings['movement-keys'][0]){
        key_left = true;

    }else if(key === settings_settings['movement-keys'][1]){
        key_right = true;

    }else if(key === settings_settings['restart-key']){
        bests_update(
          'score',
          frame_counter
        );
        setmode(mode);
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings_settings['movement-keys'][0]){
        key_left = false;

    }else if(key === settings_settings['movement-keys'][1]){
        key_right = false;
    }
};

window.onload = function(){
    bests_init(
      'FractalRunner-2D3D.htm-',
      {
        'score': 0,
      }
    );
    settings_init(
      'FractalRunner-2D3D.htm-',
      {
        'audio-volume':  1,
        'movement-keys': 'AD',
        'ms-per-frame': 25,
        'restart-key': 'H',
      }
    );
    init_canvas();
};
