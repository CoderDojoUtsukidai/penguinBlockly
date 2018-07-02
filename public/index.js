const workspace = Blockly.inject(
    'blocklyDiv',
    {
        toolbox: document.getElementById('toolbox'),
        maxBlocks: 24,
        grid: {
            spacing: 18,
            length: 3,
            colour: '#ccc',
            snap: true,
        },
        trashcan: true,
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2,
        },
    },
);
function showCode() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    var codeElement = document.getElementById('jsCode');
    codeElement.value = code;
    console.log('code:' + code);
}
function runCode() {
    var val1 = document.getElementById("jsCode").value;
    eval(val1);
}

function runCode_Version() {
    let maxSteps = 10000;
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    function initialize(interpreter, scope) {
        function alertWrapper(text) {
            const msg = text ? text.toString() : '';
            return interpreter.createPrimitive(window.alert(msg));
        }
        interpreter.setProperty(scope, 'alert', interpreter.createNativeFunction(alertWrapper));
    }
    const jsInterpreter = new Interpreter(code, initialize);
    while (jsInterpreter.step() && maxSteps) {
        maxSteps -= 1;
    }
    if (!maxSteps) {
        throw EvalError('Infinite loop.');
    }
    jsInterpreter.run();
}

function sampleCode() {
    var code = function () {/*
var game = document.getElementById("game");
var ctx = game.getContext("2d");
ctx.fillStyle = "lightblue";
ctx.fillRect(0,0,800,600);
ctx.fillStyle = "green";
ctx.fillRect(0,500,800,100);
ctx.strokeStyle = "brown";
ctx.beginPath();
ctx.lineWidth = 10;
ctx.moveTo(200,500);
ctx.lineTo(200,400);
ctx.stroke();
ctx.lineWidth = 5;
ctx.lineTo(150,350);
ctx.moveTo(200,400);
ctx.lineTo(220,380);
ctx.stroke();
    */}.toString().split("\n").slice(1, -1).join("\n")
    var codeElement = document.getElementById('jsCode').value = code;
}
function clearCode() {
    var codeElement = document.getElementById('jsCode').value = "";
}


document.getElementById('showCode').addEventListener('click', showCode, false);
document.getElementById('runCode').addEventListener('click', runCode, false);


document.getElementById('sampleCode').addEventListener('click', sampleCode, false);
document.getElementById('clearCode').addEventListener('click', clearCode, false);

//Web Apiをコールするテスト
// 
function runAPI() {
    alert('before send');
    var url = "http://weather.livedoor.com/forecast/webservice/json/v1?city=130010";
    var xhr = new XMLHttpRequest();
    // url = location.href;
    xhr.open("GET", url);
    xhr.onreadystatechange = function () {
        alert('readyState:' + xhr.readyState);
        alert('status:' + xhr.status);
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert('responseText:' + xhr.responseText);
            console.log(xhr.responseText);
            var res = JSON.parse(xhr.responseText)
            alert('RES:' + res);
            console.log(res);
        }
        if (xhr.readyState === 4 && xhr.status === 0) {
            alert('responseText:' + xhr.responseText);
        }
    }
    xhr.send();
    alert('after send');
}
document.getElementById('runAPI').addEventListener('click', runAPI, false);
