Blockly.JavaScript['webapi'] = function (block) {
  var value_url = Blockly.JavaScript.valueToCode(block, 'url', Blockly.JavaScript.ORDER_ATOMIC);
  var value_apikey = Blockly.JavaScript.valueToCode(block, 'apikey', Blockly.JavaScript.ORDER_ATOMIC);
  var value_method = Blockly.JavaScript.valueToCode(block, 'method', Blockly.JavaScript.ORDER_ATOMIC);
  var value_param = Blockly.JavaScript.valueToCode(block, 'param', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var url = value_url;
  var token = ''
  url = 'https://api-tokyochallenge.odpt.org/api/v4/odpt:TrainInformation?odpt:operator=odpt.Operator:Tokyu&acl:consumerKey=9a3f010d43185ae92b2c198431dc9aa41e189fc3c750c778b31935cec3e335ff'
  var xmlHttp = "var xhr = new XMLHttpRequest();";
  var xmlopen = "xhr.open( '" + value_method + "', '" + url + "', false );";
  var xmltry = "xhr.send( null );" + '\n' + "alert(xmlHttp.responseText)";
  var code = xmlHttp + '\n' + xmlopen + '\n' + xmltry;

  // var array = [];
  var array = ["Banana", "Orange", "Apple", "Mango"];
  var str = array.toString();
  var join = array.join('\n');
  array.push("give");
  array.push("gave");
  array.push("given");
  array.forEach(function(element) {
    console.log(element);
  });
  // var url = "https://api.github.com/search/repositories?q=javascript";
  // var xhr = new XMLHttpRequest();
  // xhr.open('GET', url);
  // xhr.send();
  // xhr.onreadystatechange = function() {
  //   if(xhr.readyState === 4 && xhr.status === 200) {
  //     console.log( JSON.parse(xhr.responseText) );
  //   }
  // }


  //npm run http-server



  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// アプリケーション名
// DefaultApplication
// アクセストークン
// 9a3f010d43185ae92b2c198431dc9aa41e189fc3c750c778b31935cec3e335ff



// Blockly.JavaScript['connection'] = function(block) {
//   var code;
//   var value_slave = Blockly.JavaScript.valueToCode(this, 'slave', Blockly.JavaScript.ORDER_ATOMIC);
//   var value_script = Blockly.JavaScript.valueToCode(this, 'script', Blockly.JavaScript.ORDER_ATOMIC);

//   var url_prefix =  "http://";
//   var slave      = "8888";
//   var scriptname_prefix = "132.162.2.136:";
//   var url = url_prefix + scriptname_prefix + value_script + slave;
//   var xmlHttp = "var xmlHttp = new XMLHttpRequest();";
//   var xmlopen = "xmlHttp.open( 'GET', " + url + ", false );";
//   var xmltry = "xmlHttp.send( null );" + '\n' + "alert(xmlHttp.responseText)";
//   code = xmlHttp + '\n' + xmlopen + '\n' + xmltry;

//   return code;
// };
