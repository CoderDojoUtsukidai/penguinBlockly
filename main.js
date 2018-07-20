const toolbox = require('./toolbox.xml')

const workspace = Blockly.inject(
    'blocklyPanel', {
        toolbox: toolbox,
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

const createPseudoContext = function(interpreter, context) {
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

const createPseudoCanvas = function(interpreter, canvas) {
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

const initDocument = function(interpreter, scope) {
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

const initConsole = function(interpreter, scope) {
    var myConsole = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
    interpreter.setProperty(scope, 'console', myConsole);
    var consoleFunctions = ['log'];
    for (var i = 0; i < consoleFunctions.length; i++) {
        interpreter.setProperty(myConsole, consoleFunctions[i],
            interpreter.createNativeFunction(console[consoleFunctions[i]], false),
            Interpreter.NONENUMERABLE_DESCRIPTOR);
    }
};

const initWindow = function(interpreter, scope) {
    function requestAnimationFrameWrapper(animationCallback, callback) {
        function callbackWrapper() {
            const stack = interpreter.stateStack;
            const currentState = stack.pop();
            const fnName = currentState.node.arguments[0].name;
            console.log('Looking for ' + fnName + ' in call stack.');
            var found = false;
            var i = stack.length - 1;
            for (; i > 0; i --) {
                var s = stack[i];
                if (s.node.type === 'CallExpression' &&
                    s.node.callee.name === fnName) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                throw EvalError('Could not find ' + fnName + ' in call stack.');
            }
            for (var j = stack.length - 1; j > i; j --) {
                stack.pop();
            }
            var state = stack[stack.length - 1];
            state.doneCallee_ = 0;
            state.doneExec_ = false;
            state.doneArgs_ = false;
            console.log(state);
            stack.push(currentState);
            console.log(stack[stack.length - 1]);
            // debugger;
            callback();
        }
        return interpreter.createPrimitive(window.requestAnimationFrame(callbackWrapper));
    }
    interpreter.setProperty(scope, 'requestAnimationFrame',
        interpreter.createAsyncFunction(requestAnimationFrameWrapper),
        Interpreter.NONENUMERABLE_DESCRIPTOR);
};

const initHighlight = function(interpreter, scope) {
    var highlightBlockWrapper = function(id, callback) {
        var ret = workspace.highlightBlock(id);
        setTimeout(callback, 1000);
        return ret;
    };
    interpreter.setProperty(scope, 'highlightBlock',
        interpreter.createAsyncFunction(highlightBlockWrapper));

    var highlightLineWrapper = function(lineNum, callback) {
        if (-1 === lineNum) {
            editor.selection.clearSelection();
        }
        else {
            editor.selection.moveCursorToPosition({row: lineNum, column: 0});
            editor.selection.selectLine();
            setTimeout(callback, 1000);
        }
        return true;
    };
    interpreter.setProperty(scope, 'highlightLine',
        interpreter.createAsyncFunction(highlightLineWrapper));

    function alertWrapper(text) {
        const msg = text ? text.toString() : '';
        return interpreter.createPrimitive(window.alert(msg));
    }
    interpreter.setProperty(scope, 'alert',
        interpreter.createNativeFunction(alertWrapper));
};

function createInterpreter(code) {
    function initialize(interpreter, scope) {
        initDocument(interpreter, scope);
        initConsole(interpreter, scope);
        initWindow(interpreter, scope);
        initHighlight(interpreter, scope);
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

var running = false;
var mustStop = false;
setRunning(false);

function annotateCodeForStopping(code) {
    const lines = code.split("\n");
    var annotatedLines = [];
    lines.forEach((l, i) => {
        annotatedLines[2*i] = l;
        annotatedLines[2*i+1] = 'if (mustStop) { setRunning(false); throw EvalError("Stopped."); }';
    });
    var annotatedCode = annotatedLines.join("\n");
    if (annotatedCode.indexOf('requestAnimationFrame') === -1 &&
        annotatedCode.indexOf('setTimeout') === -1) {
        annotatedCode += '\nsetRunning(false);\n';
    }
    return annotatedCode;
}

function runBlocks() {
    setRunning(true);
    const code = annotateCodeForStopping(generateCode(workspace, false));
    eval(code);
}

function debugBlocks() {
    setRunning(true);
    const code = generateCode(workspace, true);
    const jsInterpreter = createInterpreter(code);
    var runOnce = function() {
        if (jsInterpreter.run() && !mustStop) {
            setTimeout(runOnce, 1000);
        }
        else {
            if (mustStop) {
                workspace.highlightBlock(null);
            }
            setRunning(false);
        }
    };
    runOnce();
}

function runCode() {
    setRunning(true);
    const code = annotateCodeForStopping(editor.getSession().getValue());
    eval(code);
}

function annotateCodeForHighlight(code) {
    const lines = code.split("\n");
    var annotatedLines = [];
    lines.forEach((l, i) => {
        annotatedLines[2*i] = 'highlightLine(' + i + ');';
        annotatedLines[2*i+1] = l;
    });
    return annotatedLines.join("\n") + 'highlightLine(-1);';
}

function debugCode() {
    setRunning(true);
    const code = annotateCodeForHighlight(editor.getSession().getValue());
    console.log(code);
    const jsInterpreter = createInterpreter(code);
    var runOnce = function() {
        if (jsInterpreter.run() && !mustStop) {
            setTimeout(runOnce, 1000);
        }
        else {
            if (mustStop) {
                editor.selection.clearSelection();
            }
            setRunning(false);
        }
    };
    runOnce();
}

function isBlocklyVisible() {
    return document.getElementById('blockly').classList.contains('active');
}

function runProgram() {
    if (running) {
        return;
    }
    if (isBlocklyVisible()) {
        runBlocks();
    }
    else {
        runCode();
    }
}

function debugProgram() {
    if (running) {
        return;
    }
    if (isBlocklyVisible()) {
        debugBlocks();
    }
    else {
        debugCode();
    }
}

function stopProgram() {
    if (!running) {
        return;
    }
    mustStop = true;
}

function setRunning(value) {
    running = value;
    mustStop = false;
    if (running) {
        $('#runBtn').addClass('disabled');
        $('#debugBtn').addClass('disabled');
        $('#saveDropdownLink').addClass('disabled');
        $('#loadDropdownLink').addClass('disabled');
        $('#stopBtn').removeClass('disabled');
        $('.nav-link').addClass('disabled');
    }
    else {
        $('#runBtn').removeClass('disabled');
        $('#debugBtn').removeClass('disabled');
        $('#saveDropdownLink').removeClass('disabled');
        $('#loadDropdownLink').removeClass('disabled');
        $('#stopBtn').addClass('disabled');
        $('.nav-link').removeClass('disabled');
    }
}

function saveBlocks() {
    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xml_text = Blockly.Xml.domToText(xml);
    const filename = document.getElementById('saveFilename').value;
    var link = document.getElementById('saveBtn');
    link.download = filename;
    link.href = 'data:text/xml;charset=utf-8,' +
        encodeURIComponent(xml_text);
}

function saveCode() {
    const code = editor.getSession().getValue();
    const filename = document.getElementById('saveFilename').value;
    var link = document.getElementById('saveBtn');
    link.download = filename;
    link.href = 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(code);
    codeUpdated = false;
}

function saveProgram(e) {
    if (isBlocklyVisible()) {
        saveBlocks();
    }
    else {
        saveCode();
    }
    $('#saveDropdownLink').dropdown('toggle');
}

function loadBlocks() {
    const fileSelector = document.getElementById('loadFilename');
    const loadFilename = fileSelector.files[0];
    var reader = new FileReader();
    reader.readAsText(loadFilename);
    reader.onload = function(ev) {
        const xml = Blockly.Xml.textToDom(reader.result);
        Blockly.Xml.domToWorkspace(xml, workspace);
    }
    $('#loadDropdownLink').dropdown('toggle');
}

function loadCode() {
    const fileSelector = document.getElementById('loadFilename');
    const loadFilename = fileSelector.files[0];
    var reader = new FileReader();
    reader.readAsText(loadFilename);
    reader.onload = function(ev) {
        editor.getSession().setValue(reader.result);
    }
    $('#loadDropdownLink').dropdown('toggle');
}

function loadProgram() {
    if (isBlocklyVisible()) {
        loadBlocks();
    }
    else {
        loadCode();
    }
}

document.getElementById('runBtn').addEventListener('click', runProgram, false);
document.getElementById('debugBtn').addEventListener('click', debugProgram, false);
document.getElementById('stopBtn').addEventListener('click', stopProgram, false);
document.getElementById('saveBtn').addEventListener('click', saveProgram, false);
document.getElementById('loadBtn').addEventListener('click', loadProgram, false);

// Initialize ACE Javascript editor
var codeUpdated = false;
var editor = ace.edit("jsCode");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setOptions({
    // fontFamily: "tahoma",
    fontSize: "12pt"
});
editor.getSession().on('change', function() {
    codeUpdated = true;
});

$('a[data-toggle="tab"]').on('hide.bs.tab', function (e) {
    if (e.target.id === 'code-tab') {
        if (codeUpdated) {
            $('#switch-blockly-confirmation').modal('show');
            e.preventDefault();
        }
    }
});

function confirmSwitchTab() {
    codeUpdated = false;  // ignore code updates
    $('#blockly-tab').tab('show');
    $('#switch-blockly-confirmation').modal('hide');
}

document.getElementById('confirmSwitchTabBtn').addEventListener('click', confirmSwitchTab, false);

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if (e.target.id === 'code-tab') {
        const code = generateCode(workspace, false);
        editor.getSession().setValue(code);

        var xml = Blockly.Xml.workspaceToDom(workspace);
        var xml_text = Blockly.Xml.domToText(xml);
        console.log(xml_text);
        codeUpdated = false;
    }
});

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
