'use strict';

import React from "react";

import createInterpreter from '../interpreter';
import Program from './Program';

export default class ProgramCode extends Program {

    constructor(props) {
        super(props);
        this.codeUpdated = false;
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    setEditor(editor) {
        this.editor = editor;
    }

    annotateCodeForHighlight(code) {
        const lines = code.split("\n");
        var annotatedLines = [];
        lines.forEach((l, i) => {
            annotatedLines[2*i] = 'highlightLine(' + i + ');';
            annotatedLines[2*i+1] = l;
        });
        return annotatedLines.join("\n") + 'highlightLine(-1);';
    }

    run() {
        window.setRunning(true);
        const code = this.annotateCodeForStopping(this.editor.getSession().getValue());
        eval(code);
    }

    debug() {
        window.setRunning(true);
        const code = this.annotateCodeForHighlight(this.editor.getSession().getValue());
        console.log(code);
        const jsInterpreter = createInterpreter(code, null, this.editor);
        const editor = this.editor;
        var runOnce = function() {
            if (jsInterpreter.run() && !window.mustStop()) {
                setTimeout(runOnce, 1000);
            }
            else {
                if (window.mustStop()) {
                    editor.selection.clearSelection();
                }
                window.setRunning(false);
            }
        };
        runOnce();
    }

    save(filename, link) {
        const code = this.editor.getSession().getValue();
        link.download = filename;
        link.href = 'data:text/plain;charset=utf-8,' +
            encodeURIComponent(code);
        this.codeUpdated = false;
    }

    load(filename) {
        var reader = new FileReader();
        reader.readAsText(filename);
        const editor = this.editor;
        reader.onload = function(ev) {
            editor.getSession().setValue(reader.result);
        }
    }

    isCodeUpdated() {
        return this.codeUpdated;
    }

    notifyCodeUpdated() {
        this.codeUpdated = true;
    }

    discardUpdates() {
        this.codeUpdated = false;
    }

    render() {
        return (
        <div id="codePanel" class="fit-parent">
          <div id="jsCode" class="fit-parent"></div>
        </div>
        );
    }
};

