'use strict';

const sprites = require('../data/sprites.dat');

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

const colors = [
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
    this.appendValueInput("zoom")
        .setCheck("Number")
        .appendField("（拡大: ");
    this.appendDummyInput()
        .appendField("倍）");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_displaysprite'] = {
  init: function() {
    var sprite_names = Object.keys(sprites).map(n => [n, n]);
    var yes_no = [ ['普通', false], ['左右逆', true] ];
    this.appendDummyInput()
        .appendField("スプライト")
        .appendField(new Blockly.FieldDropdown(sprite_names), "name");
    this.appendValueInput("costume")
        .setCheck("Number")
        .appendField("のコスチューム");
    this.appendValueInput("dispx")
        .setCheck("Number")
        .appendField("を表示する X:");
    this.appendValueInput("dispy")
        .setCheck("Number")
        .appendField("Y:");
    this.appendValueInput("zoom")
        .setCheck("Number")
        .appendField("（拡大: ");
    this.appendDummyInput()
        .appendField("倍、")
        .appendField(new Blockly.FieldDropdown(yes_no), "flip");
    this.appendDummyInput()
        .appendField("）");
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

Blockly.Blocks['penguin_drawgrid'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("グリッドを描く");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_setRobotIp'] = {
  init: function() {
    this.appendValueInput("ip")
        .setCheck("String")
        .appendField("ロボットと");
    this.appendDummyInput()
        .appendField("で接続する");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(238);
    this.setTooltip("ロボットに接続するIPアドレスを指定します");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_moveForward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("前へ進む");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(238);
    this.setTooltip("前へ進みます");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_moveBackward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("後ろにさがる");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(238);
    this.setTooltip("後ろにさがります");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_stop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("止まる");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(238);
    this.setTooltip("止まります");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_turnAngle'] = {
  init: function() {
    this.appendValueInput("angle")
        .setCheck("Number")
        .appendField("");
    this.appendDummyInput()
        .appendField("度に曲がる");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(238);
    this.setTooltip("ある角度に曲がります");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['penguin_wait'] = {
  init: function() {
    this.appendValueInput("time_sec")
        .setCheck("Number")
        .appendField("");
    this.appendDummyInput()
        .appendField("秒を待つ");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(238);
    this.setTooltip("ある時間を待つ");
    this.setHelpUrl("");
  }
};

