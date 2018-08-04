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

Blockly.JavaScript['penguin_gettime'] = function(block) {
  var code = '(new Date()).getTime()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['penguin_drawgrid'] = function(block) {
  var i = Blockly.JavaScript.variableDB_.getDistinctName("grid_x", Blockly.Variables.NAME_TYPE);
  var j = Blockly.JavaScript.variableDB_.getDistinctName("grid_y", Blockly.Variables.NAME_TYPE);
  var code = '////// GRID //////\n' +
    'var ' + i + ', ' + j + ';\n' +
    'ctx.fillStyle = "black";\n' +
    'ctx.strokeStyle = "black";\n' +
    'ctx.lineWidth = 1;\n' +
    'ctx.beginPath();\n' +
    'for (' + i + ' = 0; ' + i + ' <= 10; ' + i + '++) {\n' +
    '    ctx.moveTo((' + i + ' * 100), 0);\n' +
    '    ctx.lineTo((' + i + ' * 100), 10);\n' +
    '    ctx.moveTo((' + i + ' * 100), 590);\n' +
    '    ctx.lineTo((' + i + ' * 100), 600);\n' +
    '    ctx.moveTo(0, (' + i + ' * 100));\n' +
    '    ctx.lineTo(10, (' + i + ' * 100));\n' +
    '    ctx.moveTo(790, (' + i + ' * 100));\n' +
    '    ctx.lineTo(800, (' + i + ' * 100));\n' +
    '    for (' + j + ' = 1; ' + j + ' <= 10; ' + j + '++) {\n' +
    '        ctx.moveTo((' + i + ' * 100) - 1, (' + j + ' * 100));\n' +
    '        ctx.lineTo((' + i + ' * 100) + 1, (' + j + ' * 100));\n' +
    '        ctx.moveTo((' + i + ' * 100), (' + j + ' * 100) - 1);\n' +
    '        ctx.lineTo((' + i + ' * 100), (' + j + ' * 100) + 1);\n' +
    '    }\n' +
    '}\n' +
    'ctx.moveTo(395, 300);\n' +
    'ctx.lineTo(405, 300);\n' +
    'ctx.moveTo(400, 295);\n' +
    'ctx.lineTo(400, 305);\n' +
    'ctx.stroke();\n' +
    'ctx.font = "10px Arial";\n' +
    'for (' + i + ' = 1; ' + i + ' <= 9; ' + i + '++) {\n' +
    '    ctx.fillText((' + i + ' * 100), (' + i + ' * 100) + 5, 12);\n' +
    '    if (' + i + ' < 6) {\n' +
    '        ctx.fillText((' + i + ' * 100), 5, (' + i + ' * 100) + 12);\n' +
    '    }\n' +
    '}\n' +
    'ctx.fillText("(0, 0)", 5, 12);\n' +
    'ctx.fillText("(800, 0)", 760, 12);\n' +
    'ctx.fillText("(0, 600)", 5, 595);\n' +
    'ctx.fillText("(800, 600)", 750, 595);\n' +
    'ctx.fillText("(400, 300)", 405, 312);\n' +
    'ctx.beginPath();\n' +
    'ctx.moveTo(40, 30);\n' +
    'ctx.lineTo(140, 30);\n' +
    'ctx.lineTo(135, 25);\n' +
    'ctx.moveTo(140, 30);\n' +
    'ctx.lineTo(135, 35);\n' +
    'ctx.moveTo(30, 40);\n' +
    'ctx.lineTo(30, 140);\n' +
    'ctx.lineTo(25, 135);\n' +
    'ctx.moveTo(30, 140);\n' +
    'ctx.lineTo(35, 135);\n' +
    'ctx.stroke();\n' +
    'ctx.fillText("X", 145, 33);\n' +
    'ctx.fillText("Y", 27, 154);\n' +
    '////// GRID //////\n\n';
  return code;
}
