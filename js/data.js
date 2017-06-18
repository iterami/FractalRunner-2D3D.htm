'use strict';

function load_data(id){
    if(frame_counter > core_storage_data['score']){
        core_storage_data['score'] = frame_counter;
    }
    core_storage_save({
      'bests': true,
    });

    frame_counter = 0;
    ground = canvas_y * (1 - id);
    player_position = 0;
    split_state = [
      false,
      false,
    ];
    splits = [
      [-50, -50, 25],
      [-50, 50, 25],
      [50, -50, 25],
      [50, 50, 25],
    ];
}
