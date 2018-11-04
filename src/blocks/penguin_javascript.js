'use strict';

const sprites = require('../data/sprites.dat');

Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
Blockly.JavaScript.addReservedWords('highlightBlock');
Blockly.JavaScript.addReservedWords('highlightLine');

Blockly.JavaScript['penguin_getcontext2d'] = function(block) {
  var code = 'var game = document.getElementById("game");\nvar ctx = game.getContext("2d");\n';
  return code;
};

Blockly.JavaScript['penguin_fillstyle'] = function(block) {
  var dropdown_color = block.getFieldValue('color');
  var code = 'ctx.fillStyle = "' + dropdown_color + '";\n';
  return code;
};

Blockly.JavaScript['penguin_strokestyle'] = function(block) {
  var dropdown_color = block.getFieldValue('color');
  var code = 'ctx.strokeStyle = "' + dropdown_color + '";\n';
  return code;
};

Blockly.JavaScript['penguin_linewidth'] = function(block) {
  var line_width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'ctx.lineWidth = ' + line_width + ';\n';
  return code;
};

Blockly.JavaScript['penguin_fillrect'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var value_width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var value_height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'ctx.fillRect(' + value_x + ',' + value_y + ','+value_width+','+value_height+');\n';
  return code;
};

Blockly.JavaScript['penguin_strokerect'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var value_width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var value_height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'ctx.strokeRect(' + value_x + ',' + value_y + ','+value_width+','+value_height+');\n';
  return code;
};

Blockly.JavaScript['penguin_clearrect'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var value_width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var value_height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'ctx.clearRect(' + value_x + ',' + value_y + ','+value_width+','+value_height+');\n';
  return code;
};

Blockly.JavaScript['penguin_circle'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var value_radius = Blockly.JavaScript.valueToCode(block, 'radius', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'ctx.arc(' + value_x + ',' + value_y + ',' + value_radius + ',0,2*Math.PI);\n';
  return code;
};

Blockly.JavaScript['penguin_strokepath'] = function(block) {
  var statements_path_block = Blockly.JavaScript.statementToCode(block, 'path_block');
  var code = 'ctx.beginPath();\n' + statements_path_block + 'ctx.stroke();\n';
  return code;
};

Blockly.JavaScript['penguin_fillpath'] = function(block) {
  var statements_path_block = Blockly.JavaScript.statementToCode(block, 'path_block');
  var code = 'ctx.beginPath();\n' + statements_path_block + 'ctx.fill();\n';
  return code;
};

Blockly.JavaScript['penguin_moveto'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'ctx.moveTo(' + value_x + ',' + value_y + ');\n';
  return code;
};

Blockly.JavaScript['penguin_lineto'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'ctx.lineTo(' + value_x + ',' + value_y + ');\n';
  return code;
};

Blockly.JavaScript['penguin_animation'] = function(block) {
  var statements_path_block = Blockly.JavaScript.statementToCode(block, 'animation_block');
  var code = 'var animation = function () {\n' + statements_path_block + '  window.requestAnimationFrame(animation);\n};\nanimation();\n';
  return code;
};

Blockly.JavaScript['penguin_displayimage'] = function(block) {
  var value_image = Blockly.JavaScript.valueToCode(block, 'image', Blockly.JavaScript.ORDER_ATOMIC);
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var value_width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var value_height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);
  var value_dispx = Blockly.JavaScript.valueToCode(block, 'dispx', Blockly.JavaScript.ORDER_ATOMIC);
  var value_dispy = Blockly.JavaScript.valueToCode(block, 'dispy', Blockly.JavaScript.ORDER_ATOMIC);
  var value_zoom = Blockly.JavaScript.valueToCode(block, 'zoom', Blockly.JavaScript.ORDER_ATOMIC);
  var sprite_var = Blockly.JavaScript.variableDB_.getDistinctName("sprite", Blockly.Variables.NAME_TYPE);
  var code = 'var ' + sprite_var + ' = document.getElementById(' + value_image + ');\n' +
        'ctx.drawImage(' + sprite_var + ', ' + value_x + ', ' + value_y + ', ' + value_width + ', ' + value_height + ', ' +
        value_dispx + ', ' + value_dispy + ', ' + (1.0 * value_zoom * value_width) + ', ' +
        (1.0 * value_zoom * value_height) + ');\n';
  return code;
};

Blockly.JavaScript['penguin_displaysprite'] = function(block) {
  var sprite_name = block.getFieldValue('name');
  var sprite_costume_index = Number(Blockly.JavaScript.valueToCode(block, 'costume', Blockly.JavaScript.ORDER_ATOMIC));
  var sprite = sprites[sprite_name];
  if (!sprite) {
    return 'alert("スプライト' + sprite_name + 'は存在しません！");';
  }
  var value_image = sprite["image"];
  var costume = sprite["costumes"][sprite_costume_index];
  if (!costume) {
    return 'alert("スプライト' + sprite_name + 'にコスチューム' + sprite_costume_index + 'は存在しません！");';
  }
  var value_x = costume["x"];
  var value_y = costume["y"];
  var value_width = costume["width"];
  var value_height = costume["height"];
  var value_dispx = Blockly.JavaScript.valueToCode(block, 'dispx', Blockly.JavaScript.ORDER_ATOMIC);
  var value_dispy = Blockly.JavaScript.valueToCode(block, 'dispy', Blockly.JavaScript.ORDER_ATOMIC);
  var value_flip = block.getFieldValue('flip');
  var value_zoom = Blockly.JavaScript.valueToCode(block, 'zoom', Blockly.JavaScript.ORDER_ATOMIC);
  var sprite_var = Blockly.JavaScript.variableDB_.getDistinctName("sprite", Blockly.Variables.NAME_TYPE);
  var disp_width = 1.0 * value_zoom * value_width;
  var disp_height = 1.0 * value_zoom * value_height;
  var code = 'var ' + sprite_var + ' = document.getElementById("' + value_image + '");\n' +
        'ctx.save();\n' +
        'ctx.translate(' + value_dispx + (value_flip ? (' + ' + disp_width) : '') + ', 0);\n';
  if (value_flip) {
    code += 'ctx.scale(-1, 1);\n';
  }
  code += 'ctx.drawImage(' + sprite_var + ', ' + value_x + ', ' + value_y + ', ' +
        value_width + ', ' + value_height + ', 0, ' + value_dispy + ', ' +
        disp_width + ', ' + disp_height + ');\n' +
        'ctx.restore();\n';
  return code;
};

Blockly.JavaScript['penguin_gettime'] = function(block) {
  var code = '(new Date()).getTime()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['penguin_drawgrid'] = function(block) {
  var code = 'window.penguin_drawgrid();';
  return code;
}

window.penguin_drawgrid = function () {
    var grid_x, grid_y;
    var saved_fillstyle, saved_strokestyle, saved_font;
    var game = document.getElementById("game");
    var ctx = game.getContext("2d");
    saved_fillstyle = ctx.fillStyle;
    saved_strokestyle = ctx.strokeStyle;
    saved_font = ctx.font;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (grid_x = 0; grid_x <= 10; grid_x++) {
        ctx.moveTo((grid_x * 100), 0);
        ctx.lineTo((grid_x * 100), 10);
        ctx.moveTo((grid_x * 100), 590);
        ctx.lineTo((grid_x * 100), 600);
        ctx.moveTo(0, (grid_x * 100));
        ctx.lineTo(10, (grid_x * 100));
        ctx.moveTo(790, (grid_x * 100));
        ctx.lineTo(800, (grid_x * 100));
        for (grid_y = 1; grid_y <= 10; grid_y++) {
            ctx.moveTo((grid_x * 100) - 1, (grid_y * 100));
            ctx.lineTo((grid_x * 100) + 1, (grid_y * 100));
            ctx.moveTo((grid_x * 100), (grid_y * 100) - 1);
            ctx.lineTo((grid_x * 100), (grid_y * 100) + 1);
        }
    }
    ctx.moveTo(395, 300);
    ctx.lineTo(405, 300);
    ctx.moveTo(400, 295);
    ctx.lineTo(400, 305);
    ctx.stroke();
    ctx.font = "12px Arial";
    for (grid_x = 1; grid_x <= 9; grid_x++) {
        ctx.fillText((grid_x * 100), (grid_x * 100) + 5, 12);
        if (grid_x < 6) {
            ctx.fillText((grid_x * 100), 5, (grid_x * 100) + 12);
        }
    }
    ctx.fillText("(0, 0)", 5, 12);
    ctx.fillText("(800, 0)", 750, 12);
    ctx.fillText("(0, 600)", 5, 595);
    ctx.fillText("(800, 600)", 740, 595);
    ctx.fillText("(400, 300)", 405, 312);
    ctx.beginPath();
    ctx.moveTo(40, 30);
    ctx.lineTo(140, 30);
    ctx.lineTo(135, 25);
    ctx.moveTo(140, 30);
    ctx.lineTo(135, 35);
    ctx.moveTo(30, 40);
    ctx.lineTo(30, 140);
    ctx.lineTo(25, 135);
    ctx.moveTo(30, 140);
    ctx.lineTo(35, 135);
    ctx.stroke();
    ctx.fillText("X", 145, 33);
    ctx.fillText("Y", 27, 154);
    ctx.fillStyle = saved_fillstyle;
    ctx.strokeStyle = saved_strokestyle;
    ctx.font = saved_font;
};

var penguin_robotIp = '172.24.1.2';

window.penguin_setRobotIp = function (ip) {
  penguin_robotIp = ip;
};

window.penguin_sendCommandToRobot = function (cmd) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://" + penguin_robotIp + "/" + cmd, true);
  xhr.send();
};

Blockly.JavaScript['penguin_setRobotIp'] = function(block) {
  var value_ip = Blockly.JavaScript.valueToCode(block, 'ip', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'penguin_setRobotIp(' + value_ip + ');\n';
  return code;
}

Blockly.JavaScript['penguin_moveForward'] = function(block) {
  var code = 'penguin_sendCommandToRobot("FD");\n';
  return code;
}

Blockly.JavaScript['penguin_moveBackward'] = function(block) {
  var code = 'penguin_sendCommandToRobot("BK");\n';
  return code;
}

Blockly.JavaScript['penguin_stop'] = function(block) {
  var code = 'penguin_sendCommandToRobot("ST");\n';
  return code;
}

Blockly.JavaScript['penguin_turnAngle'] = function(block) {
  var value_angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'penguin_sendCommandToRobot("ang?val=' + value_angle + '");\n';
  return code;
}

window.penguin_wait = function (time_sec) {
  var time_ms = time_sec * 1000;
  var start = new Date().getTime();
  var end = start;
  while(end < start + time_ms) {
    end = new Date().getTime();
  }
};

Blockly.JavaScript['penguin_wait'] = function(block) {
  var value_time_sec = Blockly.JavaScript.valueToCode(block, 'time_sec', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'penguin_wait(' + value_time_sec + ');\n';
  return code;
}

