'use strict';

const createPseudoContext = function(interpreter, context) {
    var myContext = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
    var contextFunctions = ['beginPath', 'stroke', 'fill',
        'moveTo', 'lineTo', 'fillRect', 'strokeRect', 'clearRect', 'arc', 'drawImage'
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
            case 9:
                wrapper = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
                    return interpreter.createPrimitive(context[fn].call(
                        context, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8));
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

    function drawGridWrapper() {
        return interpreter.createPrimitive(window.penguin_drawgrid());
    }
    interpreter.setProperty(scope, 'penguin_drawgrid',
        interpreter.createNativeFunction(drawGridWrapper));
};

const initHighlightBlock = function(interpreter, scope, workspace) {
    var highlightBlockWrapper = function(id, callback) {
        var ret = workspace.highlightBlock(id);
        setTimeout(callback, 1000);
        return ret;
    };
    interpreter.setProperty(scope, 'highlightBlock',
        interpreter.createAsyncFunction(highlightBlockWrapper));
};

const initHighlightLine = function(interpreter, scope, editor) {
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
};

const initAlert = function(interpreter, scope) {
    function alertWrapper(text) {
        const msg = text ? text.toString() : '';
        return interpreter.createPrimitive(window.alert(msg));
    }
    interpreter.setProperty(scope, 'alert',
        interpreter.createNativeFunction(alertWrapper));
};

function createInterpreter(code, workspace, editor) {
    function initialize(interpreter, scope) {
        initDocument(interpreter, scope);
        initConsole(interpreter, scope);
        initWindow(interpreter, scope);
        initAlert(interpreter, scope);
        if (workspace) {
            initHighlightBlock(interpreter, scope, workspace);
        }
        if (editor) {
            initHighlightLine(interpreter, scope, editor);
        }
    }
    return new Interpreter(code, initialize);
}

export default createInterpreter;

