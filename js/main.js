'use strict';

function draw_logic(){
    // Draw ground grass.
    canvas_setproperties({
      'properties': {
        'fillStyle': colors[2],
      },
    });
    canvas_buffer.fillRect(
      0,
      ground,
      canvas_properties['width'],
      canvas_properties['height-half']
    );

    canvas_setproperties({
      'properties': {
        'fillStyle': split_state[0]
          ? colors[0]
          : colors[1],
      },
    });

    // Precalculate left wall split position.
    let precalc = splits[0][0] * (1 / splits[0][2]) + canvas_properties['width-half'];

    // Draw left wall extra bit.
    if(player_position > 0){
        canvas_buffer.fillRect(
          0,
          0,
          1 + (player_position >= precalc ? precalc : player_position),
          canvas_properties['height']
        );
    }

    // Draw left wall closer than split.
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
      'properties': {
        'fillStyle': split_state[0]
          ? colors[1]
          : colors[0],
      },
    });

    // Precalculate right wall split position.
    precalc = splits[2][0] * (1 / splits[2][2]) + canvas_properties['width-half'];

    // Draw right wall extra bit.
    if(player_position < 0){
        canvas_buffer.fillRect(
          canvas_properties['width'] + player_position < precalc
            ? precalc - 1
            : canvas_properties['width'] + player_position - 1,
          0,
          -player_position,
          canvas_properties['height']
        );
    }

    // Draw right wall closer than split.
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

function logic(){
    // Get player movement.
    let player_dx = 0;
    if(core_keys[core_storage_data['move-←']]['state']){
        player_dx += player_speed;
    }
    if(core_keys[core_storage_data['move-→']]['state']){
        player_dx -= player_speed;
    }

    // Update player position.
    player_position += player_dx;

    // Make sure player stays in bounds.
    if(player_position > player_bounds){
        player_position = player_bounds;

    }else if(player_position < -player_bounds){
        player_position = -player_bounds;
    }

    // Move player forward by moving splits closer.
    for(let id in splits){
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

        score += 1;
    }

    core_ui_update({
      'ids': {
        'score': score,
      },
    });
}

function repo_init(){
    core_repo_init({
      'events': {
        'start': {
          'onclick': function(){
              canvas_setmode({
                'newgame': true,
              });
          },
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
        'splits': [],
      },
      'info': '<input id=start type=button value="Start New Run">',
      'keybinds': {
        72: {
          'todo': canvas_setmode,
        },
      },
      'menu': true,
      'storage': {
        'level': 0,
      },
      'storage-menu': '<table><tr><td><select id=level><option value=0>0 - Walled Corridor</option><option value=1>1 - Cling to the Ground</option></select><td>Level</table>',
      'title': 'FractalRunner-2D3D.htm',
      'ui': 'Score: <span id=ui-score></span>',
    });
    canvas_init();
}

function resize_logic(){
    player_bounds = canvas_properties['width-half'] / 1.5;
    player_speed = canvas_properties['width-half'] / 20;
}
