'use strict';

function load_data(){
    if(frame_counter > core_storage_data['score']){
        core_storage_data['score'] = frame_counter;
        core_storage_update({
          'bests': true,
        });
    }
    core_storage_save({
      'bests': true,
    });

    frame_counter = 0;
    ground = canvas_y * (1 - core_storage_data['level']);
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
