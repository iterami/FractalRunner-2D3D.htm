'use strict';

function load_data(){
    ground = canvas_properties['height-half'] * (1 - core_storage_data['level']);
    player_position = 0;
    score = 0;
    split_state = [
      false,
      false,
    ];
}
