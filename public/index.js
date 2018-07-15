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

var running = false;
var mustStop = false;
setRunning(false);

function runBlocks() {
    setRunning(true);
    let maxSteps = 10000;
    const code = generateCode(workspace, false);
    const jsInterpreter = createInterpreter(code);
    while (maxSteps && !mustStop) {
        if (!jsInterpreter.step()) {
            break;
        }
        maxSteps -= 1;
    }
    if (!maxSteps) {
        throw EvalError('Infinite loop.');
    }
    setRunning(false);
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
    let maxSteps = 10000;
    const code = editor.getSession().getValue();
    console.log(code);
    const jsInterpreter = createInterpreter(code);
    while (maxSteps && !mustStop) {
        if (!jsInterpreter.step()) {
            break;
        }
        maxSteps -= 1;
    }
    if (!maxSteps) {
        throw EvalError('Infinite loop.');
    }
    setRunning(false);
}

function annotateCode(code) {
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
    const code = annotateCode(editor.getSession().getValue());
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
        $('#sampleBtn').addClass('disabled');
        $('#stopBtn').removeClass('disabled');
        $('.nav-link').addClass('disabled');
    }
    else {
        $('#runBtn').removeClass('disabled');
        $('#debugBtn').removeClass('disabled');
        $('#sampleBtn').removeClass('disabled');
        $('#stopBtn').addClass('disabled');
        $('.nav-link').removeClass('disabled');
    }
}

function sampleBlocks() {
    var blocks = function() {
/*
<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="penguin_getcontext2d" id="{?{S(h!qLu~9+8|sqqUf" x="28" y="23"><next>
    <block type="penguin_clearrect" id="`iP._71rw=#z+j{ewM11"><value name="x"><block type="math_number" id="h.f[IdL#]4=r,|ZrO[dn"><field name="NUM">0</field></block></value><value name="y"><block type="math_number" id="h=!koJS~M|`G[1c=wDH9"><field name="NUM">0</field></block></value><value name="width"><block type="math_number" id="2_(`GESem?3N@~J%i+y]"><field name="NUM">800</field></block></value><value name="height"><block type="math_number" id="nl+Ne2/Skxdb[Zkw2Dpl"><field name="NUM">600</field></block></value><next>
    <block type="penguin_fillstyle" id="%l(|m.irwrl#}iDdr6+1"><field name="color">lightblue</field><next>
    <block type="penguin_fillrect" id="o#fO{oo0DJ6D79uj{(;d"><value name="x"><block type="math_number" id="U+!J3HC245a@jYg!e)ij"><field name="NUM">0</field></block></value><value name="y"><block type="math_number" id="fL3PZP,9B6b5$nRFW7G)"><field name="NUM">0</field></block></value><value name="width"><block type="math_number" id="L8?d{E/.34mT,yj8@-+4"><field name="NUM">800</field></block></value><value name="height"><block type="math_number" id="0[UQDZ$:q]|5X]$ULl/f"><field name="NUM">600</field></block></value><next>
    <block type="penguin_fillstyle" id="W]_oflp$K{1MymA.CK?."><field name="color">green</field><next>
    <block type="penguin_fillrect" id="og2zth*[L.S?L]$b8Bj_"><value name="x"><block type="math_number" id="H6Wao:,_|uTlsJK(Pid)"><field name="NUM">0</field></block></value><value name="y"><block type="math_number" id="8^F#x]Hi|a2dU+#H:QW:"><field name="NUM">500</field></block></value><value name="width"><block type="math_number" id="FLi8FP3%;U.8O)~.O[?a"><field name="NUM">800</field></block></value><value name="height"><block type="math_number" id="V{E80CiHYlXj$;/}W~%d"><field name="NUM">100</field></block></value><next>
    <block type="penguin_strokestyle" id="o;q*FMlnW]Ok[qX@[vd="><field name="color">brown</field><next>
    <block type="penguin_strokepath" id="sXkeG^Y2lrzV-$v_3V]*"><statement name="path_block"><block type="penguin_linewidth" id="C%aaRJ.uM`K3C25mGY4z"><value name="width"><block type="math_number" id="_iw_G}]62Cl~}g]UwnDN"><field name="NUM">10</field></block></value><next>
    <block type="penguin_moveto" id="2;|7quaR99DY%DtQTZF-"><value name="x"><block type="math_number" id="gV5-8T:(?UITI(iOMJS`"><field name="NUM">200</field></block></value><value name="y"><block type="math_number" id="M5|*{y|swytl51jKZQyJ"><field name="NUM">500</field></block></value><next>
    <block type="penguin_lineto" id="XKyx/$a^ulZT7ctbUWfa"><value name="x"><block type="math_number" id="yPSyjG)B5[dLeHSIPoj*"><field name="NUM">200</field></block></value><value name="y"><block type="math_number" id="+-^NyRqtZmiSRU8n+Q@G"><field name="NUM">400</field></block></value></block></next>
    </block></next>
    </block></statement><next>
    <block type="penguin_strokepath" id="E!OR;MRW3VW%Bopk|Y-7"><statement name="path_block"><block type="penguin_linewidth" id="%Rf/5^wyKN[BrP!,sl3S"><value name="width"><block type="math_number" id="NyT^}f%?f$rA4nWd}nh="><field name="NUM">5</field></block></value><next>
    <block type="penguin_moveto" id="WDp4fgD%2,|aw#i~Pb|F"><value name="x"><block type="math_number" id="o@X}I!)TrD:vixi0EOnh"><field name="NUM">200</field></block></value><value name="y"><block type="math_number" id="z`SMT|,YYLE9vDct:vOM"><field name="NUM">400</field></block></value><next>
    <block type="penguin_lineto" id=")U$!-lr(iun7N]P5t;X4"><value name="x"><block type="math_number" id="Jd[Z%?XLoI[1j{?O{W[j"><field name="NUM">150</field></block></value><value name="y"><block type="math_number" id="Qw70J$JwG$R(SA=nn$y$"><field name="NUM">350</field></block></value><next>
    <block type="penguin_moveto" id="o_hp6/ow(R_$Xb-i!8Y%"><value name="x"><block type="math_number" id="bZ#$u^GZJlVw!q.9VfG5"><field name="NUM">200</field></block></value><value name="y"><block type="math_number" id="omPF0?:mUSwU/*V@$Qpc"><field name="NUM">400</field></block></value><next>
    <block type="penguin_lineto" id="jI)y-T3e81yF`WV5apQT"><value name="x"><block type="math_number" id="/6?#:B)}XjYjh=6fOy^b"><field name="NUM">220</field></block></value><value name="y"><block type="math_number" id="o_h?!D|MwR5;I*E^4}P5"><field name="NUM">380</field></block></value></block></next>
    </block></next></block></next></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block>
</xml>
*/
    }.toString().split("\n").slice(2, -2).join("\n");
    var xml = Blockly.Xml.textToDom(blocks);
    Blockly.Xml.domToWorkspace(xml, workspace);
}

function sampleCode() {
    var code = function() {
/*
var game = document.getElementById("game");
var ctx = game.getContext("2d");
ctx.clearRect(0,0,800,600);
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
    }.toString().split("\n").slice(2, -2).join("\n");
    editor.getSession().setValue(code);
}

function sampleProgram() {
    if (running) {
        return;
    }
    if (isBlocklyVisible()) {
        sampleBlocks();
    }
    else {
        sampleCode();
    }
}

document.getElementById('runBtn').addEventListener('click', runProgram, false);
document.getElementById('debugBtn').addEventListener('click', debugProgram, false);
document.getElementById('stopBtn').addEventListener('click', stopProgram, false);
document.getElementById('sampleBtn').addEventListener('click', sampleProgram, false);

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

        var xml = Blockly.Xml.workspaceToDom(workspace);
        var xml_text = Blockly.Xml.domToText(xml);
        console.log(xml_text);
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
