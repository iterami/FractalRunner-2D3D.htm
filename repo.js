'use strict';

function repo_drawlogic(){
    canvas_setproperties({
      'fillStyle': colors[2],
    });
    canvas.fillRect(
      0,
      ground,
      canvas_properties.width,
      canvas_properties.height_half
    );

    const left = splits[0][0] * (1 / splits[0][2]) + canvas_properties.width_half;
    const right = splits[2][0] * (1 / splits[2][2]) + canvas_properties.width_half;

    canvas_setproperties({
      'fillStyle': split_state[0]
        ? colors[0]
        : colors[1],
    });
    canvas_draw_path({
      'vertices': [
        [
          'moveTo',
          player_position,
          Math.min(
            canvas_properties.height_half - canvas_properties.width_half,
            0
          )
        ],
        [
          'lineTo',
          left,
          (splits[0][1] * (1 / splits[0][2])) + canvas_properties.height_half,
        ],
        [
          'lineTo',
          left,
          (splits[1][1] * (1 / splits[1][2])) + canvas_properties.height_half,
        ],
        [
          'lineTo',
          player_position,
          Math.max(
            canvas_properties.height_half + canvas_properties.width_half,
            canvas_properties.height
          )
        ],
        [
          'lineTo',
          0,
          canvas_properties.height,
        ],
        [
          'lineTo',
          0,
          0,
        ],
      ],
    });
    canvas_draw_path({
      'vertices': [
        [
          'moveTo',
          right,
          (splits[2][1] * (1 / splits[2][2])) + canvas_properties.height_half,
        ],
        [
          'lineTo',
          canvas_properties.width_half,
          canvas_properties.height_half,
        ],
        [
          'lineTo',
          right,
          (splits[3][1] * (1 / splits[3][2])) + canvas_properties.height_half,
        ],
      ],
    });

    canvas_setproperties({
      'fillStyle': split_state[0]
        ? colors[1]
        : colors[0],
    });
    canvas_draw_path({
      'vertices': [
        [
          'moveTo',
          canvas_properties.width + player_position,
          Math.min(
            canvas_properties.height_half - canvas_properties.width_half,
            0
          )
        ],
        [
          'lineTo',
          right,
          (splits[2][1] * (1 / splits[2][2])) + canvas_properties.height_half,
        ],
        [
          'lineTo',
          right,
          (splits[3][1] * (1 / splits[3][2])) + canvas_properties.height_half,
        ],
        [
          'lineTo',
          canvas_properties.width + player_position,
          Math.max(
            canvas_properties.height_half + canvas_properties.width_half,
            canvas_properties.height
          )
        ],
        [
          'lineTo',
          canvas_properties.width,
          canvas_properties.height,
        ],
        [
          'lineTo',
          canvas_properties.width,
          0,
        ],
      ],
    });
    canvas_draw_path({
      'vertices': [
        [
          'moveTo',
          left,
          (splits[0][1] * (1 / splits[0][2])) + canvas_properties.height_half,
        ],
        [
          'lineTo',
          canvas_properties.width_half,
          canvas_properties.height_half,
        ],
        [
          'lineTo',
          left,
          (splits[1][1] * (1 / splits[1][2])) + canvas_properties.height_half,
        ],
      ],
    });
}

function repo_escape(){
    if(split_state.length === 0
      && !core_menu_open){
        start();
    }
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(event){
            if(score !== 0){
                core_escape(true);
                event.preventDefault();
            }
        },
      },
      'events': {
        'start': {
          'onclick': start,
        },
      },
      'globals': {
        'colors': [
          '#333',
          '#666',
          '#131',
        ],
        'ground': 0,
        'player_bounds': 0,
        'player_position': 0,
        'player_speed': 0,
        'score': 0,
        'split_state': [],
        'splits': [
          [-50, -50, 25],
          [-50, 50, 25],
          [50, -50, 25],
          [50, 50, 25],
        ],
      },
      'info': '<button class=medium id=start type=button>Start New Run</button><br>'
        + '<select id=level><option value=0>0 - Walled Corridor<option value=1>1 - Cling to the Ground</select>',
      'menu': true,
      'pointerbinds': {},
      'storage': {
        'level': 0,
      },
      'storage_controls': true,
      'title': 'FractalRunner-2D3D.htm',
      'ui': 'Score: <span id=score></span>',
    });
    canvas_init({
      'cursor': 'pointer',
    });
}

function repo_load(){
    ground = canvas_properties.height_half * (1 - core_storage_data.level);
    player_position = 0;
    score = 0;
    split_state = [
      false,
      false,
    ];
    splits[0][2] = 25;
    splits[1][2] = 25;
    splits[2][2] = 25;
    splits[3][2] = 25;

    core_ui_update({
      'ids': {
        'score': score,
      },
    });
}

function repo_logic(){
    let move_left = core_keys[core_storage_data.move_left].state;
    let move_right = core_keys[core_storage_data.move_right].state;
    if(core_pointer.down_0){
        if(core_pointer.x > canvas_properties.width_half){
            move_right = true;

        }else{
            move_left = true;
        }
    }

    let player_dx = 0;
    if(move_left){
        player_dx += player_speed;
    }
    if(move_right){
        player_dx -= player_speed;
    }

    player_position += player_dx;

    if(player_position > player_bounds){
        player_position = player_bounds;

    }else if(player_position < -player_bounds){
        player_position = -player_bounds;
    }

    for(const id in splits){
        splits[id][2] -= .05;

        if(splits[id][2] < 0){
            splits[id][2] = 25;
            split_state[1] = true;
        }
    }

    if(split_state[1]){
        player_position = 0;

        split_state[1] = false;
        split_state[0] = !split_state[0];

        score += 1;
        audio_start('boop');

        core_ui_update({
          'ids': {
            'score': score,
          },
        });
    }
}

function repo_resizelogic(){
    ground = canvas_properties.height_half * (1 - core_storage_data.level);
    player_bounds = canvas_properties.width_half / 1.5;
    player_speed = canvas_properties.width_half / 20;
}

function start(){
    if(score !== 0
      && !globalThis.confirm('Start new run?')){
        return;
    }
    canvas_setmode();
}
