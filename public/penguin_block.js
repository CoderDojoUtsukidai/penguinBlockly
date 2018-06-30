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

Blockly.Blocks['penguin_fillstyle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("色をぬる")
        .appendField(new Blockly.FieldDropdown([["みずいろ","lightblue"], ["みどり","green"], ["ちゃいろ","brown"]]), "color");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
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

Blockly.Blocks['penguin__clearrect'] = {
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