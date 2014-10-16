function draw(){
    buffer.clearRect(
      0,
      0,
      width,
      height
    );

    // get player movement
    player_dx = 0;
    if(key_left){
        player_dx += x / 20;
    }
    if(key_right){
        player_dx -= x / 20;
    }

    // update player position
    player_position += player_dx;

    // make sure player stays in bounds
    if(player_position > x / 1.5){
        player_position = x / 1.5;

    }else if(player_position < -x / 1.5){
        player_position = -x / 1.5;
    }

    // draw ground grass
    buffer.fillStyle = '#131';
    buffer.fillRect(
      0,
      floor_position,
      width,
      y
    );

    // move player forward by moving splits closer
    var loop_counter = splits.length - 1;
    do{
        splits[loop_counter][2] -= .05;

        // if splits reach player, reset splits
        if(splits[loop_counter][2] < 0){
            splits[loop_counter][2] = 25;
            split_state[1] = 1;
        }
    }while(loop_counter--);

    // if it is time to reset split
    if(split_state[1]){
        // reset player position to start of new section
        player_position = 0;

        // switch split
        split_state[1] = 0;
        split_state[0] = !split_state[0];
    }

    buffer.fillStyle = split_state[0]
      ? '#323232'
      : '#646464';

    // precalculate left wall split position
    var precalc = (splits[0][0] * (1 / splits[0][2])) + x;

    // draw left wall extra bit
    if(player_position > 0){
        buffer.fillRect(
          0,
          0,
          1 + (player_position >= precalc ? precalc : player_position),
          height
        );
    }

    // draw left wall closer than split
    if(player_position < precalc){
        buffer.beginPath();
        buffer.moveTo(
          player_position,
          y - x
        );
        buffer.lineTo(
          precalc,
          (splits[0][1] * (1 / splits[0][2])) + y
        );
        buffer.lineTo(
          precalc,
          (splits[1][1] * (1 / splits[1][2])) + y
        );
        buffer.lineTo(
          player_position,
          y + x
        );
        buffer.closePath();
        buffer.fill();
    }

    // draw left wall further than split
    buffer.fillStyle = split_state[0]
      ? '#646464'
      : '#323232';
    buffer.beginPath();
    buffer.moveTo(
      precalc,
      (splits[0][1] * (1 / splits[0][2])) + y
    );
    buffer.lineTo(
      x,
      y
    );
    buffer.lineTo(
      precalc,
      (splits[1][1] * (1 / splits[1][2])) + y
    );
    buffer.closePath();
    buffer.fill();

    buffer.fillStyle = split_state[0]
      ? '#646464'
      : '#323232';

    // precalculate right wall split position
    precalc = (splits[2][0] * (1 / splits[2][2])) + x;

    // draw right wall extra bit
    if(player_position < 0){
        buffer.fillRect(
          width + player_position < precalc ? precalc - 1 : width + player_position - 1,
          0,
          -player_position,
          height
        );
    }

    // draw right wall closer than split
    if(width + player_position > precalc){
        buffer.beginPath();
        buffer.moveTo(
          width + player_position,
          y - x
        );
        buffer.lineTo(
          precalc,
          (splits[2][1] * (1 / splits[2][2])) + y
        );
        buffer.lineTo(
          precalc,
          (splits[3][1] * (1 / splits[3][2])) + y
        );
        buffer.lineTo(
          width + player_position,
          y + x
        );
        buffer.closePath();
        buffer.fill();
    }


    // draw right wall further than split
    buffer.fillStyle = split_state[0]
      ? '#323232'
      : '#646464';

    buffer.beginPath();
    buffer.moveTo(
      precalc,
      (splits[2][1] * (1 / splits[2][2])) + y
    );
    buffer.lineTo(
      x,
      y
    );
    buffer.lineTo(
      precalc,
      (splits[3][1] * (1 / splits[3][2])) + y
    );
    buffer.closePath();
    buffer.fill();

    // if frame counter is enabled, draw current frame count
    if(settings['frame-counter']){
        frame_counter += 1;
        buffer.fillStyle = '#fff';
        buffer.font = '23pt sans-serif';
        buffer.textAlign = 'left';
        buffer.textBaseline = 'top';
        buffer.fillText(
          frame_counter,
          5,
          5
        );
    }

    canvas.clearRect(
      0,
      0,
      width,
      height
    );
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );
}

function reset(){
    if(confirm('Reset settings?')){
        document.getElementById('audio-volume').value = 1;
        document.getElementById('frame-counter').checked = true;
        document.getElementById('movement-keys').value = 'AD';
        document.getElementById('ms-per-frame').value = 25;
        document.getElementById('restart-key').value = 'H';
        save();
    }
}

function resize(){
    if(mode > 0){
        height = window.innerHeight;
        document.getElementById('buffer').height = height;
        document.getElementById('canvas').height = height;
        y = height / 2;

        width = window.innerWidth;
        document.getElementById('buffer').width = width;
        document.getElementById('canvas').width = width;
        x = width / 2;
    }
}

function save(){
    // Save audio-volume setting.
    if(document.getElementById('audio-volume').value === 1){
        window.localStorage.removeItem('FractalRunner-2D3D.htm-audio-volume');
        settings['audio-volume'] = 1;

    }else{
        settings['audio-volume'] = parseFloat(document.getElementById('audio-volume').value);
        window.localStorage.setItem(
          'FractalRunner-2D3D.htm-audio-volume',
          settings['audio-volume']
        );
    }

    // Save frame-counter setting.
    if(document.getElementById('frame-counter').checked){
        window.localStorage.removeItem('FractalRunner-2D3D.htm-frame-counter');
        settings['frame-counter'] = false;

    }else{
        settings['frame-counter'] = true;
        window.localStorage.setItem(
          'FractalRunner-2D3D.htm-frame-counter',
          1
        );
    }

    // Save movement-keys setting.
    if(document.getElementById('movement-keys').value == 'AD'){
        window.localStorage.removeItem('FractalRunner-2D3D.htm-movement-keys');
        settings['movement-keys'] = 'AD';

    }else{
        settings['movement-keys'] = document.getElementById('movement-keys').value;
        window.localStorage.setItem(
          'FractalRunner-2D3D.htm-movement-keys',
          settings['movement-keys']
        );
    }

    // Save ms-per-frame setting.
    if(document.getElementById('ms-per-frame').value == 25
      || isNaN(document.getElementById('ms-per-frame').value)
      || document.getElementById('ms-per-frame').value < 1){
        window.localStorage.removeItem('FractalRunner-2D3D.htm-ms-per-frame');
        document.getElementById('ms-per-frame').value = 25;
        settings['ms-per-frame'] = 25;

    }else{
        settings['ms-per-frame'] = parseInt(document.getElementById('ms-per-frame').value);
        window.localStorage.setItem(
          'FractalRunner-2D3D.htm-ms-per-frame',
          settings['ms-per-frame']
        );
    }

    // Save restart-key setting.
    if(document.getElementById('restart-key').value == 'AD'){
        window.localStorage.removeItem('FractalRunner-2D3D.htm-restart-key');
        settings['restart-key'] = 'H';

    }else{
        settings['restart-key'] = document.getElementById('restart-key').value;
        window.localStorage.setItem(
          'FractalRunner-2D3D.htm-restart-key',
          settings['restart-key']
        );
    }
}

function setmode(newmode, newgame){
    clearInterval(interval);

    split_state = [0, 0];

    mode = newmode;

    // new game mode
    if(mode > 0){
        splits = [
          [-50, -50, 25],
          [-50,  50, 25],
          [ 50, -50, 25],
          [ 50,  50, 25]
        ];

        frame_counter = 0;    
        player_dx = 0;
        player_position = 0;

        if(newgame){
            save();

            document.getElementById('page').innerHTML = '<canvas id=canvas></canvas>';

            buffer = document.getElementById('buffer').getContext('2d');
            canvas = document.getElementById('canvas').getContext('2d');

            resize();
        }

        floor_position = y * (mode - 1);

        interval = setInterval(
          'draw()',
          settings['ms-per-frame']
        );

    // main menu mode
    }else{
        buffer = 0;
        canvas = 0;

        document.getElementById('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><b>FractalRunner-2D3D.htm</b></div><hr><div class=c><ul><li><a onclick=setmode(1,1)>Cling to the Ground</a><li><a onclick=setmode(2,1)>Walled Corridor</a></ul></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input disabled style=border:0 value=ESC>Main Menu<br><input id=movement-keys maxlength=2 value='
          + settings['movement-keys'] + '>Move ←→<br><input id=restart-key maxlength=1 value='
          + settings['restart-key'] + '>Restart</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='
          + settings['audio-volume'] + '>Audio<br><input id=ms-per-frame value='
          + settings['ms-per-frame'] + '>ms/Frame<br><label><input '
          + (settings['frame-counter'] ? 'checked ' : '') + 'id=frame-counter type=checkbox>Frame Counter</label><br><a onclick=reset()>Reset Settings</a></div></div>';
    }
}

var buffer = 0;
var canvas = 0;
var floor_position = 0;
var frame_counter = 0;
var height = 0;
var interval = 0;
var j = 0;
var key_left = 0;
var key_right = 0;
var player_dx = 0;
var player_position = 0;
var mode = 0;
var split_state = [];
var splits = [];
var settings = {
  'audio-volume': window.localStorage.getItem('FractalRunner-2D3D.htm-audio-volume') === null
    ? 1
    : parseFloat(window.localStorage.getItem('FractalRunner-2D3D.htm-audio-volume')),
  'frame-counter': window.localStorage.getItem('FractalRunner-2D3D.htm-frame-counter') === null,
  'movement-keys': window.localStorage.getItem('FractalRunner-2D3D.htm-movement-keys') === null
    ? 'AD'
    : window.localStorage.getItem('FractalRunner-2D3D.htm-movement-keys'),
  'ms-per-frame': window.localStorage.getItem('FractalRunner-2D3D.htm-ms-per-frame') === null
    ? 25
    : parseFloat(window.localStorage.getItem('FractalRunner-2D3D.htm-ms-per-frame')),
  'restart-key': window.localStorage.getItem('FractalRunner-2D3D.htm-restart-key') === null
    ? 'H'
    : window.localStorage.getItem('FractalRunner-2D3D.htm-restart-key'),
};
var width = 0;
var x = 0;
var y = 0;

setmode(0, 1); // main menu

window.onkeydown = function(e){
    if(mode > 0){
        var key = window.event ? event : e;
        key = key.charCode ? key.charCode : key.keyCode;

        if(key === 27){// ESC
            setmode(0, 1); // main menu

        }else{
            key = String.fromCharCode(key);

            if(key === settings['movement-keys'][0]){
                key_left = 1;

            }else if(key === settings['movement-keys'][1]){
                key_right = 1;

            }else if(key === settings['restart-key']){
                setmode(mode, 0); // new game

            }
        }
    }
};

window.onkeyup = function(e){
    var key = window.event ? event : e;
    key = String.fromCharCode(key.charCode ? key.charCode : key.keyCode);

    if(key === settings['movement-keys'][0]){
        key_left = 0;

    }else if(key === settings['movement-keys'][1]){
        key_right = 0;
    }
};

window.onresize = resize;
