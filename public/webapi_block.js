Blockly.Blocks['webapi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("url");
    this.appendValueInput("url")
        .setCheck("String")
        .appendField("");
    this.appendDummyInput()
        .appendField("API Key");
    this.appendValueInput("apikey")
        .setCheck("String")
        .appendField("");
    this.appendDummyInput()
        .appendField("Method");
    this.appendValueInput("method")
        .setCheck("String")
        .appendField("");
    this.appendDummyInput()
        .appendField("param");
    this.appendValueInput("param")
        .setCheck("String")
        .appendField("");
    this.setInputsInline(false);
    this.setOutput(true, "String");
    this.setColour(20);
 this.setTooltip("Open API Interface");
 this.setHelpUrl("");
  }
};