function draw(){
    if(settings[2]){// clear?
        buffer.clearRect(
            0,
            0,
            width,
            height
        );
    }

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
        y,
        width,
        y
    );

    // move player forward by moving splits closer
    i = splits.length - 1;
    do{
        splits[i][2] -= .05;

        // if splits reach player, reset splits
        if(splits[i][2] < 0){
            splits[i][2] = 25;
            split_state[1] = 1;
        }
    }while(i--);

    // if it is time to reset split
    if(split_state[1]){
        // reset player position to start of new section
        player_position = 0;

        // switch split
        split_state[1] = 0;
        split_state[0] = !split_state[0];
    }

    buffer.fillStyle = split_state[0] ? '#323232' : '#646464';

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
    buffer.fillStyle = split_state[0] ? '#646464' : '#323232';
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

    buffer.fillStyle = split_state[0] ? '#646464' : '#323232';

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
    buffer.fillStyle = split_state[0] ? '#323232' : '#646464';

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

    if(settings[2]){// clear?
        canvas.clearRect(
            0,
            0,
            width,
            height
        );
    }
    canvas.drawImage(
        get('buffer'),
        0,
        0
    );
}

function get(i){
    return document.getElementById(i);
}

function resize(){
    if(mode > 0){
        width = window.innerWidth;
        get('buffer').width = width;
        get('canvas').width = width;

        height = window.innerHeight;
        get('buffer').height = height;
        get('canvas').height = height;

        x = width / 2;
        y = height / 2;
    }
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function save(){
    i = 1;
    do{
        j = [
            'audio-volume',
            'ms-per-frame'
        ][i];
        if(isNaN(get(j).value) || get(j).value === [1, 25][i]){
            ls.removeItem('fractalrunner-' + i);
            settings[i] = [1, 25][i];
            get(j).value = settings[i];

        }else{
            settings[i] = parseFloat(get(j).value);
            ls.setItem(
                'fractalrunner-' + i,
                settings[i]
            );
        }
    }while(i--);

    settings[2] = get('clear').checked;
    if(settings[2]){
        ls.removeItem('fractalrunner-2');

    }else{
        ls.setItem(
            'fractalrunner-2',
            0
        );
    }

    i = 1;
    do{
        if(get(['movement-keys', 'restart-key'][i]).value === ['AD', 'H'][i]){
            ls.removeItem('fractalrunner-' + (i + 3));
            settings[i + 3] = ['AD', 'H'][i];

        }else{
            settings[i + 3] = get(['movement-keys', 'restart-key'][i]).value;
            ls.setItem(
                'fractalrunner-' + (i + 3),
                settings[i + 3]
            );
        }
    }while(i--);
}

function setmode(newmode, newgame){
    clearInterval(interval);

    split_state = [0, 0];

    mode = newmode;

    // new game mode
    if(mode > 0){
        if(newgame){
            save();
        }

        splits = [
            [-50, -50, 25],
            [-50,  50, 25],
            [ 50, -50, 25],
            [ 50,  50, 25]
        ];

        if(newgame){
            get('page').innerHTML = '<canvas id=canvas></canvas>';

            buffer = get('buffer').getContext('2d');
            canvas = get('canvas').getContext('2d');

            resize();
        }

        interval = setInterval('draw()', settings[1]);// milliseconds per frame

    // main menu mode
    }else{
        buffer = 0;
        canvas = 0;

        get('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><a href=/><b>FractalRunner</b></a></div><hr><div class=c><a onclick=setmode(1,1)>Walled Corridor</a></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input disabled size=3 style=border:0 value=ESC>Main Menu<br><input id=movement-keys maxlength=2 size=3 value='
            + settings[3] + '>Move ←→<br><input id=restart-key maxlength=1 size=3 value='
            + settings[4] + '>Restart</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='
            + settings[0] + '>Audio<br><label><input '
            + (settings[2] ? 'checked ' : '') + 'id=clear type=checkbox>Clear</label><br><a onclick="if(confirm(\'Reset settings?\')){get(\'clear\').checked=get(\'audio-volume\').value=1;get(\'movement-keys\').value=\'AD\';get(\'restart-key\').value=\'H\';get(\'ms-per-frame\').value=25;save();setmode(0,1)}">Reset Settings</a><br><a onclick="get(\'hz\').style.display=get(\'hz\').style.display===\'none\'?\'inline\':\'none\'">Hack</a><span id=hz style=display:none><br><br><input id=ms-per-frame size=1 value='
            + settings[1] + '>ms/Frame</span></div></div>';
    }
}

var buffer = 0;
var canvas = 0;
var height = 0;
var i = 0;
var interval = 0;
var j = 0;
var key_left = 0;
var key_right = 0;
var ls = window.localStorage;
var player_dx = 0;
var player_position = 0;
var mode = 0;
var split_state = [];
var splits = [];
var settings = [
    ls.getItem('fractalrunner-0') === null ?    1 : parseFloat(ls.getItem('fractalrunner-0')),// audio volume
    ls.getItem('fractalrunner-1') === null ?   25 : parseFloat(ls.getItem('fractalrunner-1')),// milliseconds per frame
    ls.getItem('fractalrunner-2') === null,// clear?
    ls.getItem('fractalrunner-3') === null ? 'AD' : ls.getItem('fractalrunner-3'),// movement keys
    ls.getItem('fractalrunner-4') === null ?  'H' : ls.getItem('fractalrunner-4')// restart key
];
var width = 0;
var x = 0;
var y = 0;

setmode(0, 1);

window.onkeydown = function(e){
    if(mode > 0){
        i = window.event ? event : e;
        i = i.charCode ? i.charCode : i.keyCode;
        if(String.fromCharCode(i) === settings[3][0]){
            key_left = 1;

        }else if(String.fromCharCode(i) === settings[3][1]){
            key_right = 1;

        // new game
        }else if(String.fromCharCode(i) === settings[4]){
            setmode(mode, 0);

        // return to main menu
        }else if(i===27){// ESC
            setmode(0, 1);

        }
    }
};

window.onkeyup = function(e){
    i = window.event ? event : e;
    i = i.charCode ? i.charCode : i.keyCode;
    if(String.fromCharCode(i) === settings[3][0]){
        key_left = 0;

    }else if(String.fromCharCode(i) === settings[3][1]){
        key_right = 0;
    }
};

window.onresize = resize;
