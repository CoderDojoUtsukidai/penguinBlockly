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

