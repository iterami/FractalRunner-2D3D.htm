'use strict';

function draw_logic(){
    // Draw ground grass.
    canvas_buffer.fillStyle = colors[2];
    canvas_buffer.fillRect(
      0,
      ground,
      canvas_width,
      canvas_y
    );

    canvas_buffer.fillStyle = split_state[0]
      ? colors[0]
      : colors[1];

    // Precalculate left wall split position.
    var precalc = splits[0][0] * (1 / splits[0][2]) + canvas_x;

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
        canvas_draw_path({
          'vertices': [
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
        });
    }

    // Draw left wall further than split.
    canvas_draw_path({
      'properties': {
        'fillStyle': split_state[0]
          ? colors[1]
          : colors[0],
      },
      'vertices': [
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
    });

    canvas_buffer.fillStyle = split_state[0]
      ? colors[1]
      : colors[0];

    // Precalculate right wall split position.
    precalc = splits[2][0] * (1 / splits[2][2]) + canvas_x;

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
        canvas_draw_path({
          'vertices': [
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
        });
    }

    // Draw right wall further than split.
    canvas_draw_path({
      'properties': {
        'fillStyle': split_state[0]
          ? colors[0]
          : colors[1],
      },
      'vertices': [
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
    });

    // Draw current frame count.
    canvas_buffer.fillStyle = '#fff';
    canvas_buffer.fillText(
      frame_counter,
      5,
      25
    );
    canvas_buffer.fillText(
      core_storage_data['score'],
      5,
      50
    );
}

function logic(){
    frame_counter += 1;

    // Get player movement.
    var player_dx = 0;
    if(core_keys[65]['state']){
        player_dx += canvas_x / 20;
    }
    if(core_keys[68]['state']){
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

function repo_init(){
    core_repo_init({
      'info': '<a onclick=canvas_setmode({mode:1,newgame:true})>Cling to the Ground</a><br><a onclick=canvas_setmode({mode:0,newgame:true})>Walled Corridor</a><br>Best: <span id=score></span>',
      'keybinds': {
        65: {},
        68: {},
        72: {
          'todo': function(){
              core_storage_save({
                'bests': true,
              });
              canvas_setmode({
                'mode': canvas_mode,
              });
          },
        },
      },
      'menu': true,
      'storage': {
        'audio-volume':  1,
        'ms-per-frame': 25,
        'score': {
          'default': 0,
          'type': 1,
        },
      },
      'storage-menu': '<input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br><input id=ms-per-frame>ms/Frame',
      'title': 'FractalRunner-2D3D.htm',
    });
    canvas_init();
}

var colors = [
  '#333',
  '#666',
  '#131',
];
var frame_counter = 0;
var ground = 0;
var player_position = 0;
var split_state = [];
var splits = [];
