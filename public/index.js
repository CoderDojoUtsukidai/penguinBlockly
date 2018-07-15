const workspace = Blockly.inject(
    'blocklyPanel', {
        toolbox: document.getElementById('toolbox'),
        grid: {
            spacing: 18,
            length: 3,
            colour: '#ccc',
            snap: true,
        },
        trashcan: true,
        zoom: {
            controls: true,
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

createPseudoContext = function(interpreter, context) {
    var myContext = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
    var contextFunctions = ['beginPath', 'stroke', 'fill',
        'moveTo', 'lineTo', 'fillRect', 'strokeRect', 'clearRect', 'arc'
    ];
    for (var i = 0; i < contextFunctions.length; i++) {
        const fn = contextFunctions[i];
        var wrapper;
        switch (context[fn].length) { // Check arity
            case 0:
                wrapper = function() {
                    return interpreter.createPrimitive(context[fn].call(context));
                };
                break;
            case 2:
                wrapper = function(arg0, arg1) {
                    return interpreter.createPrimitive(context[fn].call(context, arg0, arg1));
                };
                break;
            case 4:
                wrapper = function(arg0, arg1, arg2, arg3) {
                    return interpreter.createPrimitive(context[fn].call(context, arg0, arg1, arg2, arg3));
                };
                break;
            case 5:
                wrapper = function(arg0, arg1, arg2, arg3, arg4) {
                    return interpreter.createPrimitive(context[fn].call(context, arg0, arg1, arg2, arg3, arg4));
                };
                break;
        }
        interpreter.setProperty(myContext, fn,
            interpreter.createNativeFunction(wrapper, false),
            Interpreter.NONENUMERABLE_DESCRIPTOR);
    }
    const contextProperties = ['fillStyle', 'strokeStyle', 'lineWidth'];
    for (var i = 0; i < contextProperties.length; i++) {
        const prop = contextProperties[i];
        var getProp = function() {
            return interpreter.createPrimitive(context[prop]);
        };
        var setProp = function(value) {
            context[prop] = value;
        };
        var descriptor = {
            configurable: true,
            enumerable: true,
            get: interpreter.createNativeFunction(getProp, false),
            set: interpreter.createNativeFunction(setProp, false)
        };
        interpreter.setProperty(myContext, prop, Interpreter.VALUE_IN_DESCRIPTOR, descriptor);
    }
    return myContext;
};

createPseudoCanvas = function(interpreter, canvas) {
    var myCanvas = interpreter.createObjectProto(interpreter.OBJECT_PROTO);

    function getContextWrapper(type) {
        if (type !== '2d') {
            throw IllegalArgument('Only 2d context is supported (got ' + type + ')');
        }
        var nativeContext = interpreter.createPrimitive(canvas.getContext(type));
        return createPseudoContext(interpreter, nativeContext);
    }
    interpreter.setProperty(myCanvas, 'getContext',
        interpreter.createNativeFunction(getContextWrapper, false),
        Interpreter.NONENUMERABLE_DESCRIPTOR);
    return myCanvas;
};

initDocument = function(interpreter, scope) {
    var myDocument = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
    interpreter.setProperty(scope, 'document', myDocument);

    function getElementWrapper(id) {
        var nativeElement = interpreter.createPrimitive(document.getElementById(id));
        if (nativeElement.tagName !== 'CANVAS') {
            throw TypeError('Only Canvas DOM element is supported (got ' + typeof(nativeElement) + ')');
        }
        return createPseudoCanvas(interpreter, nativeElement);
    }
    interpreter.setProperty(myDocument, 'getElementById',
        interpreter.createNativeFunction(getElementWrapper, false),
        Interpreter.NONENUMERABLE_DESCRIPTOR);
};

initConsole = function(interpreter, scope) {
    var myConsole = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
    interpreter.setProperty(scope, 'console', myConsole);
    var consoleFunctions = ['log'];
    for (var i = 0; i < consoleFunctions.length; i++) {
        interpreter.setProperty(myConsole, consoleFunctions[i],
            interpreter.createNativeFunction(console[consoleFunctions[i]], false),
            Interpreter.NONENUMERABLE_DESCRIPTOR);
    }
};

initHighlight = function(interpreter, scope) {
    var highlightWrapper = function(id, callback) {
        var ret = workspace.highlightBlock(id);
        setTimeout(callback, 1000);
        return ret;
    };
    interpreter.setProperty(scope, 'highlightBlock',
        interpreter.createAsyncFunction(highlightWrapper));

    function alertWrapper(text) {
        const msg = text ? text.toString() : '';
        return interpreter.createPrimitive(window.alert(msg));
    }
    interpreter.setProperty(scope, 'alert',
        interpreter.createNativeFunction(alertWrapper));
};

function createInterpreter(code) {
    function initialize(interpreter, scope) {
        initHighlight(interpreter, scope);
        initDocument(interpreter, scope);
        initConsole(interpreter, scope);
    }
    return new Interpreter(code, initialize);
}

function generateCode(workspace, highlightBlocks = false) {
    if (highlightBlocks) {
        Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    }
    else {
        Blockly.JavaScript.STATEMENT_PREFIX = '';
    }
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    if (highlightBlocks) {
        code += "highlightBlock(null);\n";
    }
    console.log(code);
    return code;
}

function runBlocks() {
    let maxSteps = 10000;
    const code = generateCode(workspace, false);
    const jsInterpreter = createInterpreter(code);
    while (jsInterpreter.step() && maxSteps) {
        maxSteps -= 1;
    }
    if (!maxSteps) {
        throw EvalError('Infinite loop.');
    }
}

function debugBlocks() {
    const code = generateCode(workspace, true);
    const jsInterpreter = createInterpreter(code);
    var runOnce = function() {
        if (jsInterpreter.run()) {
            setTimeout(runOnce, 1000);
        }
    };
    runOnce();
}

function runCode() {
    runBlocks();
}

function debugCode() {
    debugBlocks();
}

function sampleCode() {
    var code = function() {
        /*
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
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(200,400);
        ctx.lineTo(150,350);
        ctx.moveTo(200,400);
        ctx.lineTo(220,380);
        ctx.stroke();
            */
    }.toString().split("\n").slice(1, -1).join("\n")
    var codeElement = document.getElementById('jsCode').value = code;
}

document.getElementById('runBtn').addEventListener('click', runCode, false);
document.getElementById('debugBtn').addEventListener('click', debugCode, false);

// Initialize ACE Javascript editor
var editor = ace.edit("jsCode");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setOptions({
    // fontFamily: "tahoma",
    fontSize: "12pt"
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if (e.target.id === 'code-tab') {
        const code = generateCode(workspace, false);
        editor.getSession().setValue(code);
    }
})

// document.getElementById('sampleCode').addEventListener('click', sampleCode, false);


//Web Apiをコールするテスト
// 
function runAPI() {
    alert('before send');
    var url = "http://weather.livedoor.com/forecast/webservice/json/v1?city=130010";
    var xhr = new XMLHttpRequest();
    // url = location.href;
    xhr.open("GET", url);
    xhr.onreadystatechange = function() {
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

// document.getElementById('runAPI').addEventListener('click', runAPI, false);

function resize() {
    console.log("resize");
    var w = window.innerWidth - 850;
    var h = document.getElementById("game").clientHeight;
    var p = document.getElementById("tabNavContent");
    if (p.clientWidth != w) {
        p.setAttribute("style", "width: " + w + "px; height: " + h + "px;");
        // This is a hack to force resize after selecting another
        setTimeout(() => {
            var e = new CustomEvent("resize");
            window.dispatchEvent(e);
        }, 1);
    }
}

resize();

window.onresize = resize;

//ファイルを保存する
document.querySelector('#DLlink').onclick = function() {
    // var text = document.querySelector('#jsCode').value;
    var text = document.getElementById("jsCode").value;
    // debugger
    // console.log(text);
    // alert(text);
    this.download = "penguin.txt";
    this.href = 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(text);
};

var obj1 = document.getElementById("selfile");

//ダイアログでファイルが選択された時
obj1.addEventListener("change", function(evt) {
    var file = evt.target.files;
    var reader = new FileReader();
    reader.readAsText(file[0]);
    reader.onload = function(ev) {
        document.getElementById("jsCode").value = reader.result;
    }
}, false);
