'use strict';

import React from "react";

export default class Program extends React.Component {

    constructor(props) {
        super(props);
        this.running = false;
        this.mustStop = false;
        this.setRunning(false);
    }

    isAsynchronous(code) {
        return (code.indexOf('requestAnimationFrame') !== -1 ||
                code.indexOf('setTimeout') !== -1)
    }

    annotateCodeForStopping(code) {
        const lines = code.split("\n");
        var annotatedLines = [];
        lines.forEach((l, i) => {
            annotatedLines[2*i] = l;
            annotatedLines[2*i+1] = 'if (window.mustStop()) { window.setRunning(false); throw EvalError("Stopped."); }';
        });
        var annotatedCode = annotatedLines.join("\n");
        if (!this.isAsynchronous(annotatedCode)) {
            annotatedCode += '\nwindow.setRunning(false);\n';
        }
        return annotatedCode;
    }

    setRunning(value) {
        this.running = value;
        this.mustStop = false;
    }

    run() {
    }

    debug() {
    }

    stop() {
        if (!this.running) {
            return;
        }
        this.mustStop = true;
    }

    save() {
    }

    load() {
    }

    isCodeUpdated() {
        return false;
    }

    notifyCodeUpdated() {
    }

    discardUpdates() {
    }
};

