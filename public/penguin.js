Blockly.JavaScript['penguin_getcontext2d'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'var game = document.getElementById("game");\nvar ctx = game.getContext("2d");\n';
  return code;
};

Blockly.JavaScript['penguin_fillstyle'] = function(block) {
  var dropdown_color = block.getFieldValue('color');
  // TODO: Assemble JavaScript into code variable.
  var code = 'ctx.fillStyle = "' + dropdown_color + '";\n';
  return code;
};

Blockly.JavaScript['penguin_fillrect'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var value_width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var value_height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'ctx.fillRect(' + value_x + ',' + value_y + ','+value_width+','+value_height+');\n';
  return code;
};

Blockly.JavaScript['penguin_strokerect'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var value_width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var value_height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'ctx.strokeRect(' + value_x + ',' + value_y + ','+value_width+','+value_height+');\n';
  return code;
};

Blockly.JavaScript['penguin_clearrect'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var value_width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var value_height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'ctx.clearRect(' + value_x + ',' + value_y + ','+value_width+','+value_height+');\n';
  return code;
};