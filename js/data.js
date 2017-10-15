'use strict';

function load_data(){
    if(score > core_storage_data['score']){
        core_storage_data['score'] = score;
        core_storage_update({
          'bests': true,
        });
    }
    core_storage_save({
      'bests': true,
    });

    score = 0;
    ground = canvas_properties['height-half'] * (1 - core_storage_data['level']);
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

var colors = [
  '#333',
  '#666',
  '#131',
];
var ground = 0;
var player_bounds = 0;
var player_position = 0;
var player_speed = 0;
var score = 0;
var split_state = [];
var splits = [];
