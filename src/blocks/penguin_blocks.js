Blockly.Blocks['penguin_getcontext2d'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("絵を描く準備をする");
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

var colors = [
    ["赤","red"],
    ["オレンジ","orange"],
    ["黄色","yellow"],
    ["みどり","green"],
    ["きみどり","lightgreen"],
    ["みずいろ","lightblue"],
    ["青","blue"],
    ["シアン","cyan"],
    ["ピンク","pink"],
    ["むらさき","purple"],
    ["マジェンタ","magenta"],
    ["ちゃいろ","brown"],
    ["黒","black"],
    ["白","white"]
];

Blockly.Blocks['penguin_fillstyle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("塗りつぶしの色を")
        .appendField(new Blockly.FieldDropdown(colors), "color")
        .appendField("にする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_strokestyle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("筆の色を")
        .appendField(new Blockly.FieldDropdown(colors), "color")
        .appendField("にする");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_linewidth'] = {
  init: function() {
    this.appendValueInput("width")
        .setCheck("Number")
        .appendField("筆の太さを");
    this.appendDummyInput()
        .appendField("にする");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("筆の太さを指定します");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_fillrect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("四角くぬる");
    this.appendValueInput("x")
        .setCheck("Number")
        .appendField("　X：");
    this.appendValueInput("y")
        .setCheck("Number")
        .appendField("　Y：");
    this.appendValueInput("width")
        .setCheck("Number")
        .appendField("幅：");
    this.appendValueInput("height")
        .setCheck("Number")
        .appendField("高さ：");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("開始横、縦、幅、高さを指定します");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_strokerect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("四角を描く");
    this.appendValueInput("x")
        .setCheck("Number")
        .appendField("　X：");
    this.appendValueInput("y")
        .setCheck("Number")
        .appendField("　Y：");
    this.appendValueInput("width")
        .setCheck("Number")
        .appendField("幅：");
    this.appendValueInput("height")
        .setCheck("Number")
        .appendField("高さ：");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("開始横、縦、幅、高さを指定します");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_clearrect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("四角く消す");
    this.appendValueInput("x")
        .setCheck("Number")
        .appendField("　X：");
    this.appendValueInput("y")
        .setCheck("Number")
        .appendField("　Y：");
    this.appendValueInput("width")
        .setCheck("Number")
        .appendField("幅：");
    this.appendValueInput("height")
        .setCheck("Number")
        .appendField("高さ：");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("開始横、縦、幅、高さを指定します");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_circle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("円形を描く");
    this.appendValueInput("x")
        .setCheck("Number")
        .appendField("　X：");
    this.appendValueInput("y")
        .setCheck("Number")
        .appendField("　Y：");
    this.appendValueInput("radius")
        .setCheck("Number")
        .appendField("半径：");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("円形を描きます");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_strokepath'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("形を描く");
    this.appendStatementInput("path_block")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("形を描きます");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_fillpath'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("形を塗りつぶす");
    this.appendStatementInput("path_block")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("形を塗りつぶします");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_moveto'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ペンを");
    this.appendValueInput("x")
        .setCheck("Number")
        .appendField("　X：");
    this.appendValueInput("y")
        .setCheck("Number")
        .appendField("　Y：");
    this.appendDummyInput()
        .appendField("まで動かす");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("ペンを動かします");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_lineto'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("線を");
    this.appendValueInput("x")
        .setCheck("Number")
        .appendField("　X：");
    this.appendValueInput("y")
        .setCheck("Number")
        .appendField("　Y：");
    this.appendDummyInput()
        .appendField("まで描く");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("線を描きます");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_animation'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ずっと繰り返す");
    this.appendStatementInput("animation_block")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("繰り返します");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_displayimage'] = {
  init: function() {
    this.appendValueInput("image")
        .setCheck("String")
        .appendField("画像");
    this.appendValueInput("x")
        .setCheck("Number")
        .appendField("の一部（X:");
    this.appendValueInput("y")
        .setCheck("Number")
        .appendField("Y:");
    this.appendValueInput("width")
        .setCheck("Number")
        .appendField("幅:");
    this.appendValueInput("height")
        .setCheck("Number")
        .appendField("高さ:");
    this.appendValueInput("dispx")
        .setCheck("Number")
        .appendField("）を表示する X:");
    this.appendValueInput("dispy")
        .setCheck("Number")
        .appendField("Y:");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_gettime'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("現在の時刻");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

