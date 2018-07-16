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

initWindow = function(interpreter, scope) {
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
    return annotatedLines.join("\n");
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

function sampleBlocks_() {
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

function sampleBlocks() {
// Program to run animation
    var blocks = function() {
/*
<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables><variable type="" id="%hqk*.WtWb6?[?dG^mSb">x</variable><variable type="" id="(Jy!R%Sxw;$!V9|,m)P1">vx</variable></variables>
    <block type="penguin_getcontext2d" id="v7:iaM*S!P{pi~(7tnGA" x="28" y="12"><next>
    <block type="variables_set" id="jA[xJscr[k,?Ct(F[y1O"><field name="VAR" id="%hqk*.WtWb6?[?dG^mSb" variabletype="">x</field><value name="VALUE"><block type="math_number" id="|NQS24{FBA@F+U/att:U"><field name="NUM">100</field></block></value><next>
    <block type="variables_set" id="iRS!=!M{B;U8|PE,NxGP"><field name="VAR" id="(Jy!R%Sxw;$!V9|,m)P1" variabletype="">vx</field><value name="VALUE"><block type="math_number" id="f%Q}eJcE0yMKgZ2c}GW$"><field name="NUM">10</field></block></value><next>
    <block type="penguin_fillstyle" id="%@?C(j[~`3Z||Wj0S8%."><field name="color">red</field><next>
    <block type="penguin_animation" id="d1c:+kzWynQiC|Dp`|IJ"><statement name="animation_block"><block type="penguin_clearrect" id="peE$BTe!WH=WXkwZeO#^"><value name="x"><block type="math_number" id="A|)2;esX~:XlnC4IC-[k"><field name="NUM">0</field></block></value><value name="y"><block type="math_number" id="1O1T$*WVu_5:{|QU(2{;"><field name="NUM">0</field></block></value><value name="width"><block type="math_number" id="+JH85%C++y](e}}z(zm{"><field name="NUM">800</field></block></value><value name="height"><block type="math_number" id="uC1{yK]q]K($lDSbF#Ts"><field name="NUM">600</field></block></value><next>
    <block type="penguin_fillpath" id="od_=U0O+!.YWD_K|H;.O"><statement name="path_block"><block type="penguin_circle" id="Diqx[w#X.v~EbsJy[-Ug"><value name="x"><block type="variables_get" id="(60S`@lr+NG.3R3_Ro:M"><field name="VAR" id="%hqk*.WtWb6?[?dG^mSb" variabletype="">x</field></block></value><value name="y"><block type="math_number" id=";qmzq]9D7*o+s2Bs45;z"><field name="NUM">400</field></block></value><value name="radius"><block type="math_number" id="tQS(?AgIQO`^.;pM2aVY"><field name="NUM">50</field></block></value><next>
    <block type="math_change" id="VZR2+l%|Njp7d64rUTs^"><field name="VAR" id="%hqk*.WtWb6?[?dG^mSb" variabletype="">x</field><value name="DELTA"><shadow type="math_number" id="Xld|-+;LQIy:@}HE65O3"><field name="NUM">1</field></shadow><block type="variables_get" id="nnx|A_XB6`/5:Ue3Og2I"><field name="VAR" id="(Jy!R%Sxw;$!V9|,m)P1" variabletype="">vx</field></block></value><next>
    <block type="controls_if" id="fe[L;Lz14,V5!|Z_RK4/"><value name="IF0"><block type="logic_operation" id=")#vt|=]*rwi}d1|XIf^B"><field name="OP">OR</field><value name="A"><block type="logic_compare" id="{nAEp|GvanqEDcOBT4:p"><field name="OP">LT</field><value name="A"><block type="variables_get" id="KnQwlQq!2o8qWW.3emEo"><field name="VAR" id="%hqk*.WtWb6?[?dG^mSb" variabletype="">x</field></block></value><value name="B"><block type="math_number" id="}Lw4tRMa}mx7~ZOY4m:?"><field name="NUM">100</field></block></value></block></value><value name="B"><block type="logic_compare" id="1vkj80YG8^ND.?zR9V.I"><field name="OP">GT</field><value name="A"><block type="variables_get" id="4VOG/gVeT[]PO65c9m;]"><field name="VAR" id="%hqk*.WtWb6?[?dG^mSb" variabletype="">x</field></block></value><value name="B"><block type="math_number" id="~Zx3;R)PF)m9%Fv]EzLe"><field name="NUM">700</field></block></value></block></value></block></value><statement name="DO0"><block type="variables_set" id="tOtiDhs1!?L_p_xWjR.}"><field name="VAR" id="(Jy!R%Sxw;$!V9|,m)P1" variabletype="">vx</field><value name="VALUE"><block type="math_arithmetic" id=".{P,bei{,@~,nKa(}v5i"><field name="OP">MINUS</field><value name="A"><block type="math_number" id="_ak[qb~xP?^^/EP+^%p7"><field name="NUM">0</field></block></value><value name="B"><block type="variables_get" id="7zM]S7j]*]H;N{Q0@q}n"><field name="VAR" id="(Jy!R%Sxw;$!V9|,m)P1" variabletype="">vx</field></block></value></block></value></block></statement></block></next></block></next></block></statement></block></next></block></statement></block></next></block></next></block></next></block></next></block></xml>
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
}

function saveProgram(e) {
    if (isBlocklyVisible()) {
        saveBlocks();
    }
    else {
        saveCode();
    }
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

document.getElementById('runBtn').addEventListener('click', runProgram, false);
document.getElementById('debugBtn').addEventListener('click', debugProgram, false);
document.getElementById('stopBtn').addEventListener('click', stopProgram, false);
document.getElementById('saveBtn').addEventListener('click', saveProgram, false);
document.getElementById('loadBtn').addEventListener('click', loadProgram, false);
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
