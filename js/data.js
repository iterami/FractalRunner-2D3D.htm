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
