'use strict';

function draw_logic(){
    // Draw ground grass.
    canvas_buffer.fillStyle = colors[2];
    canvas_buffer.fillRect(
      0,
      floor_position,
      canvas_width,
      canvas_y
    );

    canvas_buffer.fillStyle = split_state[0]
      ? colors[0]
      : colors[1];

    // Precalculate left wall split position.
    var precalc = (splits[0][0] * (1 / splits[0][2])) + canvas_x;

    // Draw left wall extra bit.
    if(player_position > 0){
        canvas_buffer.fillRect(
          0,
          0,
          1 + (player_position >= precalc ? precalc : player_position),
          canvas_height
        );
    }

    // Draw left wall closer than split.
    if(player_position < precalc){
        canvas_draw_path(
          [
            {
              'type': 'moveTo',
              'x': player_position,
              'y': canvas_y - canvas_x,
            },
            {
              'x': precalc,
              'y': (splits[0][1] * (1 / splits[0][2])) + canvas_y,
            },
            {
              'x': precalc,
              'y': (splits[1][1] * (1 / splits[1][2])) + canvas_y,
            },
            {
              'x': player_position,
              'y': canvas_y + canvas_x,
            },
          ],
          {}
        );
    }

    // Draw left wall further than split.
    canvas_draw_path(
      [
        {
          'type': 'moveTo',
          'x': precalc,
          'y': (splits[0][1] * (1 / splits[0][2])) + canvas_y,
        },
        {
          'x': canvas_x,
          'y': canvas_y,
        },
        {
          'x': precalc,
          'y': (splits[1][1] * (1 / splits[1][2])) + canvas_y,
        },
      ],
      {
        'fillStyle': split_state[0]
          ? colors[1]
          : colors[0],
      }
    );

    canvas_buffer.fillStyle = split_state[0]
      ? colors[1]
      : colors[0];

    // Precalculate right wall split position.
    precalc = (splits[2][0] * (1 / splits[2][2])) + canvas_x;

    // Draw right wall extra bit.
    if(player_position < 0){
        canvas_buffer.fillRect(
          canvas_width + player_position < precalc
            ? precalc - 1
            : canvas_width + player_position - 1,
          0,
          -player_position,
          canvas_height
        );
    }

    // Draw right wall closer than split.
    if(canvas_width + player_position > precalc){
        canvas_draw_path(
          [
            {
              'type': 'moveTo',
              'x': canvas_width + player_position,
              'y': canvas_y - canvas_x,
            },
            {
              'x': precalc,
              'y': (splits[2][1] * (1 / splits[2][2])) + canvas_y,
            },
            {
              'x': precalc,
              'y': (splits[3][1] * (1 / splits[3][2])) + canvas_y,
            },
            {
              'x': canvas_width + player_position,
              'y': canvas_y + canvas_x,
            },
          ],
          {}
        );
    }

    // Draw right wall further than split.
    canvas_draw_path(
      [
        {
          'type': 'moveTo',
          'x': precalc,
          'y': (splits[2][1] * (1 / splits[2][2])) + canvas_y,
        },
        {
          'x': canvas_x,
          'y': canvas_y,
        },
        {
          'x': precalc,
          'y': (splits[3][1] * (1 / splits[3][2])) + canvas_y,
        },
      ],
      {
        'fillStyle': split_state[0]
          ? colors[0]
          : colors[1],
      }
    );

    // Draw current frame count.
    canvas_buffer.fillStyle = '#fff';
    canvas_buffer.fillText(
      frame_counter,
      5,
      25
    );
    canvas_buffer.fillText(
      bests_bests['score'],
      5,
      50
    );
}

function logic(){
    if(canvas_menu){
        return;
    }

    frame_counter += 1;

    // Get player movement.
    var player_dx = 0;
    if(key_left){
        player_dx += canvas_x / 20;
    }
    if(key_right){
        player_dx -= canvas_x / 20;
    }

    // Update player position.
    player_position += player_dx;

    // Make sure player stays in bounds.
    if(player_position > canvas_x / 1.5){
        player_position = canvas_x / 1.5;

    }else if(player_position < -canvas_x / 1.5){
        player_position = -canvas_x / 1.5;
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
    floor_position = canvas_y * (canvas_mode - 1);
}

function setmode_logic(newgame){
    split_state = [
      false,
      false,
    ];

    // Main menu mode.
    if(canvas_mode === 0){
        bests_update({
          'key': 'score',
          'value': frame_counter,
        });
        document.body.innerHTML = '<div><div><ul><li><a onclick="canvas_setmode(1, true)">Cling to the Ground</a>'
          + '<li><a onclick="canvas_setmode(2, true)">Walled Corridor</a></ul></div><hr>'
          + '<div>Best: ' + bests_bests['score'] + '<br>'
          + '<a onclick=bests_reset();canvas_setmode(0)>Reset Best</a></div></div>'
          + '<div class=right><div><input disabled value=ESC>Menu<br>'
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

var colors = [
  '#333',
  '#666',
  '#131',
];
var floor_position = 0;
var frame_counter = 0;
var key_left = false;
var key_right = false;
var player_position = 0;
var split_state = [];
var splits = [];

window.onkeydown = function(e){
    if(canvas_mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // ESC: menu.
    if(key === 27){
        canvas_menu_toggle();
        return;
    }

    key = String.fromCharCode(key);

    if(key === settings_settings['movement-keys'][0]){
        key_left = true;

    }else if(key === settings_settings['movement-keys'][1]){
        key_right = true;

    }else if(key === settings_settings['restart-key']){
        bests_update({
          'key': 'score',
          'value': frame_counter,
        });
        canvas_setmode(mode);

    }else if(key === 'Q'){
        canvas_menu_quit();
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
    bests_init({
      'bests': {
        'score': {
          'default': 0,
        },
      },
      'prefix': 'FractalRunner-2D3D.htm-',
    });
    settings_init({
      'prefix': 'FractalRunner-2D3D.htm-',
      'settings': {
        'audio-volume':  1,
        'movement-keys': 'AD',
        'ms-per-frame': 25,
        'restart-key': 'H',
      },
    });
    canvas_init();
};
