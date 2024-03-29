'use strict';

function load_data(){
    ground = canvas_properties['height-half'] * (1 - core_storage_data['level']);
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

function repo_drawlogic(){
    canvas_setproperties({
      'fillStyle': colors[2],
    });
    canvas.fillRect(
      0,
      ground,
      canvas_properties['width'],
      canvas_properties['height-half']
    );

    canvas_setproperties({
      'fillStyle': split_state[0]
        ? colors[0]
        : colors[1],
    });

    let precalc = splits[0][0] * (1 / splits[0][2]) + canvas_properties['width-half'];
    if(player_position > 0){
        canvas.fillRect(
          0,
          0,
          1 + (player_position >= precalc ? precalc : player_position),
          canvas_properties['height']
        );
    }

    if(player_position < precalc){
        canvas_draw_path({
          'vertices': [
            {
              'type': 'moveTo',
              'x': player_position,
              'y': canvas_properties['height-half'] - canvas_properties['width-half'],
            },
            {
              'x': precalc,
              'y': (splits[0][1] * (1 / splits[0][2])) + canvas_properties['height-half'],
            },
            {
              'x': precalc,
              'y': (splits[1][1] * (1 / splits[1][2])) + canvas_properties['height-half'],
            },
            {
              'x': player_position,
              'y': canvas_properties['height-half'] + canvas_properties['width-half'],
            },
          ],
        });
    }

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
          'y': (splits[0][1] * (1 / splits[0][2])) + canvas_properties['height-half'],
        },
        {
          'x': canvas_properties['width-half'],
          'y': canvas_properties['height-half'],
        },
        {
          'x': precalc,
          'y': (splits[1][1] * (1 / splits[1][2])) + canvas_properties['height-half'],
        },
      ],
    });

    canvas_setproperties({
      'fillStyle': split_state[0]
        ? colors[1]
        : colors[0],
    });

    precalc = splits[2][0] * (1 / splits[2][2]) + canvas_properties['width-half'];
    if(player_position < 0){
        canvas.fillRect(
          canvas_properties['width'] + player_position < precalc
            ? precalc - 1
            : canvas_properties['width'] + player_position - 1,
          0,
          -player_position,
          canvas_properties['height']
        );
    }

    if(canvas_properties['width'] + player_position > precalc){
        canvas_draw_path({
          'vertices': [
            {
              'type': 'moveTo',
              'x': canvas_properties['width'] + player_position,
              'y': canvas_properties['height-half'] - canvas_properties['width-half'],
            },
            {
              'x': precalc,
              'y': (splits[2][1] * (1 / splits[2][2])) + canvas_properties['height-half'],
            },
            {
              'x': precalc,
              'y': (splits[3][1] * (1 / splits[3][2])) + canvas_properties['height-half'],
            },
            {
              'x': canvas_properties['width'] + player_position,
              'y': canvas_properties['height-half'] + canvas_properties['width-half'],
            },
          ],
        });
    }

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
          'y': (splits[2][1] * (1 / splits[2][2])) + canvas_properties['height-half'],
        },
        {
          'x': canvas_properties['width-half'],
          'y': canvas_properties['height-half'],
        },
        {
          'x': precalc,
          'y': (splits[3][1] * (1 / splits[3][2])) + canvas_properties['height-half'],
        },
      ],
    });
}

function repo_logic(){
    let player_dx = 0;
    if(core_keys[core_storage_data['move-←']]['state']){
        player_dx += player_speed;
    }
    if(core_keys[core_storage_data['move-→']]['state']){
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

function repo_escape(){
    if(split_state.length === 0
      && !core_menu_open){
        core_repo_reset();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'start': {
          'onclick': core_repo_reset,
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
      'info': '<select id=level><option value=0>0 - Walled Corridor<option value=1>1 - Cling to the Ground</select><button id=start type=button>Start New Run</button>',
      'menu': true,
      'reset': canvas_setmode,
      'storage': {
        'level': 0,
      },
      'title': 'FractalRunner-2D3D.htm',
      'ui': 'Score: <span id=score></span>',
    });
    canvas_init();

    ground = canvas_properties['height-half'];
}

function repo_resizelogic(){
    player_bounds = canvas_properties['width-half'] / 1.5;
    player_speed = canvas_properties['width-half'] / 20;
}
